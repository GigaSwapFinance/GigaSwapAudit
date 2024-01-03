const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers, waffle } = require("hardhat");

describe("Erc20SaleEth:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let erc20Sale;
    let erc20SaleEth;
    let weth;
    let giga;
    let packet;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        weth = await (await ethers.getContractFactory("gWETH")).deploy();
        packet = await (await ethers.getContractFactory("PacketErc20")).deploy();
        erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).deploy(feeSettings.address, packet.address);
        erc20SaleEth = await (await ethers.getContractFactory("Erc20SaleWeth")).deploy(erc20Sale.address, weth.address);
        await weth.setWithoutAllowance([erc20Sale.address, erc20SaleEth.address], true);
    });

    describe("создание позиции", function () {
        var token1;
        let positionId;
        var position;
        const token1Count = 1000;
        const positionFlags = 0;
        const priceNom = ethers.utils.parseEther("2.0");
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const packetClaimTime = 0;

        beforeEach(async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);

            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);
            await expect(erc20Sale.createPosition(token1.address, weth.address, priceNom, pricceDenom,
                token1Count, positionFlags, buyLimit, whiteList, packetClaimTime))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1, owner.address, token1.address, weth.address, priceNom, 1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);
        });

        it("проверка создания позиции", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(weth.address);
            expect(position.count1).to.eq(token1Count);
            expect(position.count2).to.eq(0);
            expect(position.priceNom).to.eq(priceNom);
            expect(position.priceDenom).to.eq(pricceDenom);

            expect(await token1.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(token1Count);
        });

        describe("покупка 10 штук через врапер", function () {
            let countToBuy = 10;
            let spendToBuy;
            beforeEach(async () => {
                //await weth.connect(acc2).approve(erc20Sale.address, 1000);
                spendToBuy = await erc20Sale.spendToBuy(positionId, countToBuy);
                await expect(erc20SaleEth.connect(acc2).buy(positionId, acc2.address, countToBuy,
                    position.priceNom, position.priceDenom,
                    acc2.address,
                    { value: spendToBuy }))
                    .to.emit(erc20Sale, 'OnBuy')
                    .withArgs(positionId, acc2.address, countToBuy);
            });

            it("проверка покупки", async () => {
                expect(await waffle.provider.getBalance(weth.address)).to.eq(spendToBuy);

                var position = await erc20Sale.getPosition(positionId);
                expect(position.owner).to.eq(owner.address);
                expect(position.asset1).to.eq(token1.address);
                expect(position.asset2).to.eq(weth.address);
                expect(position.count1).to.eq(990);
                expect(position.count2).to.eq(spendToBuy);
                expect(position.priceNom).to.eq(priceNom);
                expect(position.priceDenom).to.eq(1);

                expect(await token1.balanceOf(owner.address)).to.eq(0);
                expect(await token1.balanceOf(erc20Sale.address)).to.eq(990);
                expect(await token1.balanceOf(acc2.address)).to.eq(10);

                expect(await weth.balanceOf(owner.address)).to.eq(0);
                expect(await weth.balanceOf(erc20Sale.address)).to.eq(spendToBuy);
                expect(await weth.balanceOf(acc2.address)).to.eq(0);
            });
        });
    });
});
