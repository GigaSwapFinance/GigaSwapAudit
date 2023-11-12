const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers, waffle } = require("hardhat");

describe("GigaSwapErc20Votes:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let vote;
    let erc20;
    let giga;
    let erc20Writer;
    let GigaSwapTokenRemoveExtraContractAddressVote;
    let GigaSwapTokenSetExtraContractAddressVote;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        erc20 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        giga = await (await ethers.getContractFactory("GigaSwapToken")).deploy();
        erc20Writer = await (await ethers.getContractFactory("GigaSwapTokenWriter")).deploy(giga.address);

        vote = await (await ethers.getContractFactory("Vote")).deploy(erc20.address);
        GigaSwapTokenRemoveExtraContractAddressVote = await (await ethers.getContractFactory("GigaSwapTokenRemoveExtraContractAddressVote"))
            .deploy(vote.address, erc20Writer.address);
        GigaSwapTokenSetExtraContractAddressVote = await (await ethers.getContractFactory("GigaSwapTokenSetExtraContractAddressVote"))
            .deploy(vote.address, erc20Writer.address);

        await vote.setFactories([
            GigaSwapTokenRemoveExtraContractAddressVote.address,
            GigaSwapTokenSetExtraContractAddressVote.address],
            true);
        await erc20Writer.setFactories([
            GigaSwapTokenRemoveExtraContractAddressVote.address,
            GigaSwapTokenSetExtraContractAddressVote.address],
            true);

        await owner.sendTransaction({
            to: giga.address,
            value: ethers.utils.parseEther("1.0")
        });

        await giga.createLiquidity();
        await giga.connect(await ethers.getImpersonatedSigner("0x3e9643C6C9dB1cAd49637d1C329805Ba61914f20"))
            .setWithdrawAddress(erc20Writer.address);
        await giga.transferOwnership(erc20Writer.address);
    });

    it("начальная ситуация", async () => {
        expect(await giga.buyFeePpm()).to.eq(35);
        expect(await giga.sellFeePpm()).to.eq(35);
        expect(await giga.thisShare()).to.eq(750);
        expect(await giga.extraShare()).to.eq(0);
        expect(await giga.extraAddress()).to.eq("0x0000000000000000000000000000000000000000");
    });

    it("задаем экстра адрес", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await GigaSwapTokenSetExtraContractAddressVote.startVote(acc2.address, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        await vote.execute(1);

        // проверка
        expect(await giga.extraAddress()).to.eq(acc2.address);
    });
});