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
    let value;
    let executor;
    let erc20;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        erc20 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        vote = await (await ethers.getContractFactory("Vote")).deploy(erc20.address);
        value = await (await ethers.getContractFactory("TestValue")).deploy();
        executor = await (await ethers.getContractFactory("TestValueVoteExecutor")).deploy(vote.address, value.address);
        vote.setFactories([executor.address], true);
    });

    it("начальная ситуация", async () => {
        expect(await value.getValue()).to.eq(0);
    });

    it("начало голосования", async () => {
        var newVoteEtherPrice = await vote.newVoteEtherPrice();
        var newVoteErc20Price = await vote.newVoteErc20Price();
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, newVoteErc20Price);
        await expect(executor.startVote(1, { value: newVoteEtherPrice }))
            .to.emit(vote, 'NewVote').withArgs(1, executor.address);

        var data = await vote.getVote(1);
        expect(data[0].executor).to.eq(executor.address);
        expect(data[0].forCount).to.eq(0);
        expect(data[0].againstCount).to.eq(0);
        expect(data[0].owner).to.eq(owner.address);
        expect(await vote.isVoteEnd(1)).to.eq(false);
        expect(await vote.canExecute(1)).to.eq(false);
    });

    it("старт голосования тратит токены", async () => {
        var newVotePrice = await vote.newVoteErc20Price();
        await erc20.mint(newVotePrice);
        await erc20.approve(vote.address, newVotePrice);
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        expect(await erc20.balanceOf(owner.address)).to.eq(0);
        expect(await erc20.balanceOf(vote.address)).to.eq(newVotePrice);
    });

    it("проверка чтения ревардов голосования", async () => {
        var newVoteEtherPrice = await vote.newVoteEtherPrice();
        var newVoteErc20Price = await vote.newVoteErc20Price();
        await erc20.mint(newVoteErc20Price);
        await erc20.approve(vote.address, newVoteErc20Price);
        await executor.startVote(1, { value: newVoteEtherPrice });

        expect(await vote.voteEtherRewardCount(1)).to.eq(newVoteEtherPrice);
        expect(await vote.voteErc20RewardCount(1)).to.eq(newVoteErc20Price);
    });

    it("завершено без голоса", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));

        expect(await vote.isVoteEnd(1)).to.eq(true);
        expect(await vote.canExecute(1)).to.eq(false);
    });

    it("проверка процесса голосования", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        data = await vote.getVote(1);
        expect(data[0].forCount).to.eq(1);
        expect(data[0].againstCount).to.eq(0);
        await vote.connect(acc1).vote(1, true);
        data = await vote.getVote(1);
        expect(data[0].forCount).to.eq(2);
        expect(data[0].againstCount).to.eq(0);
        await vote.connect(acc2).vote(1, false);
        data = await vote.getVote(1);
        expect(data[0].forCount).to.eq(2);
        expect(data[0].againstCount).to.eq(1);
    });

    it("второй раз проголосовать нельзя", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await expect(vote.vote(1, true)).to.be.revertedWith('already voted by this address');
    });

    it("проверка результата голосования", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, false);

        // проверка
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        expect(await vote.isVoteEnd(1)).to.eq(true);
        expect(await vote.canExecute(1)).to.eq(true);
        data = await vote.getVote(1);
        expect(data[0].forCount).to.eq(2);
        expect(data[0].againstCount).to.eq(1);
    });

    it("проверка выполнения голосования", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await vote.connect(acc2).vote(1, false);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));

        // проверка
        expect(await value.getValue()).to.eq(0);
        await vote.execute(1);
        expect(await value.getValue()).to.eq(1);

        // второй раз не выполняется
        await expect(vote.execute(1)).to.be.revertedWith('vote can not be executed');
    });

    it("голосовать по завершению времени нельзя", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));

        // проверка
        await expect(vote.connect(acc2).vote(1, false)).to.be.revertedWith('can not vote - vote end');
    });

    it("клайм по завершению голосования", async () => {
        var newVoteErc20Price = await vote.newVoteErc20Price();
        await erc20.mint(newVoteErc20Price);
        await erc20.approve(vote.address, newVoteErc20Price);
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);

        expect(await vote.canClaim(1, owner.address)).to.eq(false);
        expect(await vote.canClaim(1, acc1.address)).to.eq(false);
        expect(await vote.canClaim(1, acc2.address)).to.eq(false);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        expect(await vote.canClaim(1, owner.address)).to.eq(true);
        expect(await vote.canClaim(1, acc1.address)).to.eq(true);
        expect(await vote.canClaim(1, acc2.address)).to.eq(false);

        // проверка
        await vote.claim(1);
        await vote.connect(acc1).claim(1);
        expect(await vote.canClaim(1, owner.address)).to.eq(false);
        expect(await vote.canClaim(1, acc1.address)).to.eq(false);

        // проверка клейма токенов erc20
        expect(await erc20.balanceOf(owner.address)).to.eq(await vote.voteErc20RewardCount(1));
        expect(await erc20.balanceOf(acc1.address)).to.eq(await vote.voteErc20RewardCount(1));
    });

    it("клайм по завершению голосования невозможен тем кто не голосовал", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await vote.connect(acc1).vote(1, true);

        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));

        // проверка
        await expect(vote.connect(acc2).claim(1)).to.be.revertedWith('can not claim vote reward');
    });

    it("если никто не голосовал то забрать ревард может только овнер голосования", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // ждем окончания голосования
        expect(await vote.canClaim(1, owner.address)).to.eq(false);
        expect(await vote.canClaim(1, acc2.address)).to.eq(false);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));
        expect(await vote.canClaim(1, owner.address)).to.eq(true);
        expect(await vote.canClaim(1, acc2.address)).to.eq(false);

        // проверка
        await vote.claim(1);
        expect(await vote.canClaim(1, owner.address)).to.eq(false);
    });

    it("клайм по завершению голосования второй раз невозможен", async () => {
        await erc20.mint(await vote.newVoteErc20Price());
        await erc20.approve(vote.address, await vote.newVoteErc20Price());
        await executor.startVote(1, { value: ethers.utils.parseEther("1.0") });

        // голосуем
        await vote.vote(1, true);
        await Up(parseInt((await vote.voteLapsedSeconds(1)).toString()));

        // проверка
        await vote.claim(1);
        await expect(vote.claim(1)).to.be.revertedWith('can not claim vote reward');
    });
});