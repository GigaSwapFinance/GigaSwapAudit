const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers, waffle } = require("hardhat");

describe("Vote:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let vote;
    let erc20;
    let feeSettings;
    let feeSettingsOwner;
    let feeSettingsSetFeeAddressExecutor;
    let feeSettingsSetFeeEthExecutor;
    let feeSettingsSetFeePercentExecutor;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        erc20 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy();
        feeSettingsOwner = await (await ethers.getContractFactory("FeeSettingsWriter")).deploy(feeSettings.address);

        vote = await (await ethers.getContractFactory("Vote")).deploy(erc20.address);
        feeSettingsSetFeeAddressExecutor = await (await ethers.getContractFactory("FeeSettingsSetFeeAddressVote"))
            .deploy(vote.address, feeSettingsOwner.address);
        feeSettingsSetFeeEthExecutor = await (await ethers.getContractFactory("FeeSettingsSetFeeEthVote"))
            .deploy(vote.address, feeSettingsOwner.address);
        feeSettingsSetFeePercentExecutor = await (await ethers.getContractFactory("FeeSettingsSetFeePercentVote"))
            .deploy(vote.address, feeSettingsOwner.address);

        vote.setFactories([
            feeSettingsSetFeeAddressExecutor.address,
            feeSettingsSetFeeEthExecutor.address,
            feeSettingsSetFeePercentExecutor.address],
            true);
        feeSettingsOwner.setFactories([
            feeSettingsSetFeeAddressExecutor.address,
            feeSettingsSetFeeEthExecutor.address,
            feeSettingsSetFeePercentExecutor.address],
            true);
        feeSettings.transferOwnership(feeSettingsOwner.address);
    });

    it("начальная ситуация", async () => {
        expect(await feeSettings.feeAddress()).to.eq(owner.address);
        expect(await feeSettings.feePercent()).to.eq(300);
        expect((await feeSettings.feeEth()).toString()).to.eq("10000000000000000");
    });

    it("смена адреса", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await feeSettingsSetFeeAddressExecutor.startVote(acc2.address, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        await vote.execute(1);

        // проверка
        expect(await feeSettings.feeAddress()).to.eq(acc2.address);
    });

    it("смена налога в этериуме", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await feeSettingsSetFeeEthExecutor.startVote(123, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        await vote.execute(1);

        // проверка
        expect(await feeSettings.feeEth()).to.eq(123);
    });

    it("смена налога в процентах", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await feeSettingsSetFeePercentExecutor.startVote(123, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        await vote.execute(1);

        // проверка
        expect(await feeSettings.feePercent()).to.eq(123);
    });
});