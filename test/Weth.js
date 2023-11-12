const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers, waffle } = require("hardhat");

describe("Weth:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let weth;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy();
        weth = await (await ethers.getContractFactory("gWETH")).deploy();
    });

    it("without allowance", async () => {
        await weth.setWithoutAllowance([owner.address], true);
        expect(await weth.allowance(acc1.address, owner.address)).to.eq('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    });

    it("transfer to mint", async () => {
        await owner.sendTransaction({
            to: weth.address,
            value: ethers.utils.parseEther("1")
        });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));

        await owner.sendTransaction({
            to: weth.address,
            value: ethers.utils.parseEther("1")
        });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("2.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("2.0"));
    });

    it("mint", async () => {
        await weth.mint({ value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));

        await weth.mint({ value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("2.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("2.0"));
    });
    it("mintTo", async () => {
        await weth.mintTo(acc2.address, { value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(acc2.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));

        await weth.mintTo(acc2.address, { value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(acc2.address)).to.eq(ethers.utils.parseEther("2.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("2.0"));
    });
    it("unwrap", async () => {
        await weth.mint({ value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));

        await weth.unwrap(ethers.utils.parseEther("0.7"));
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("0.3"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("0.3"));
        await weth.unwrap(ethers.utils.parseEther("0.3"));
        expect(await weth.balanceOf(owner.address)).to.eq(0);
        expect(await waffle.provider.getBalance(weth.address)).to.eq(0);
    });

    it("unwrap by transfer to contract", async () => {
        await weth.mint({ value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));

        await weth.transfer(weth.address, ethers.utils.parseEther("0.7"));
        expect(await weth.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("0.3"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("0.3"));
        await weth.transfer(weth.address, ethers.utils.parseEther("0.3"));
        expect(await weth.balanceOf(owner.address)).to.eq(0);
        expect(await waffle.provider.getBalance(weth.address)).to.eq(0);
    });

    it("test full", async () => {
        // set approwed address
        await weth.setWithoutAllowance([owner.address], true);

        // mint to account
        await weth.mintTo(acc1.address, { value: ethers.utils.parseEther("1.0") });
        expect(await weth.balanceOf(acc1.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("1.0"));
        expect(await waffle.provider.getBalance(acc1.address)) // only partial test - invoke only this file
            .to.eq(ethers.utils.parseEther("10000.0"));

        // unwrap account
        await weth.transferFrom(acc1.address, weth.address, ethers.utils.parseEther("0.7"));
        expect(await weth.balanceOf(acc1.address)).to.eq(ethers.utils.parseEther("0.3"));
        expect(await waffle.provider.getBalance(weth.address)).to.eq(ethers.utils.parseEther("0.3"));
        expect(await waffle.provider.getBalance(acc1.address))
            .to.eq(ethers.utils.parseEther("10000.7"));

        // unwrap account
        await weth.transferFrom(acc1.address, weth.address, ethers.utils.parseEther("0.3"));
        expect(await weth.balanceOf(owner.address)).to.eq(0);
        expect(await waffle.provider.getBalance(weth.address)).to.eq(0);
        expect(await waffle.provider.getBalance(acc1.address))
            .to.eq(ethers.utils.parseEther("10001.0"));

        // can not unwrap - has no balance
        await expect(weth.transferFrom(acc1.address, weth.address, 1))
            .to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });

    it("wrap unwrap gas", async () => {
        for (var i = 0; i < 100; ++i) {
            await weth.mint({ value: ethers.utils.parseEther("1.0") });
            await weth.unwrap(ethers.utils.parseEther("1.0"));
            await weth.mint({ value: ethers.utils.parseEther("1.0") });
            await weth.transfer(acc2.address, ethers.utils.parseEther("1.0"));
        }
    });
});