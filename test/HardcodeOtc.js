const { expect } = require("chai");
var chai = require('chai');
const { Up, Days, Seconds, Minutes } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
chai.use(require('chai-bignumber')());
const { ethers, waffle } = require("hardhat");

describe("TradingPair:", function () {
    let token;
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let otc;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        //feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy();
        otc = await (await ethers.getContractFactory("OtcPair")).deploy();
    });

    it("создаем пару", async () => {
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token1.mint(100);
        token2.mint(50);
        await token1.approve(otc.address, 100);
        await token2.approve(otc.address, 50);

        await expect(otc.createPair(token1.address, token2.address, 100, 50)).that.emit(otc, 'OnCreatePair');

        pair = await otc.getPair(1);
        expect(pair[0]).to.eq(token1.address);
        expect(pair[1]).to.eq(token2.address);
        expect(pair[2]).to.eq(100);
        expect(pair[3]).to.eq(50);
    });

    it("свапаем в прямом порядке", async () => {
        // создаем пару
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token1.mint(100);
        token2.mint(50);
        await token1.approve(otc.address, 100);
        await token2.approve(otc.address, 50);
        await expect(otc.createPair(token1.address, token2.address, 100, 50)).that.emit(otc, 'OnCreatePair');

        // свапаем
        for (var i = 0; i < 100; ++i) {
            await token1.mint(10);
            await token1.approve(otc.address, 10);
            await expect(otc.buy2ForCertain1(1, 10)).to.emit(otc, 'OnSwap');
        }
    });

});