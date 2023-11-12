const { expect } = require("chai");
const { Up, Days, Seconds, Minutes } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers, waffle } = require("hardhat");
var chai = require('chai');
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
chai.use(require('chai-bignumber')());

describe("PositionLocker:", function () {
    let token;
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let positionsController;
    let lock;
    let tradingPair;
    let ethAssetsController;
    let erc20AssetsController;
    let erc721AssetsController;
    let posFactory;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy();
        positionsController = await (await ethers.getContractFactory("PositionsController")).deploy(feeSettings.address);
        ethAssetsController = await (await ethers.getContractFactory("EthAssetsController")).deploy(positionsController.address);
        erc20AssetsController = await (await ethers.getContractFactory("Erc20AssetsController")).deploy(positionsController.address);
        erc721AssetsController = await (await ethers.getContractFactory("Erc721ItemAssetsController")).deploy(positionsController.address);
        lock = await (await ethers.getContractFactory("PositionLockerAlgorithm")).deploy(positionsController.address);
        tradingPair = await (await ethers.getContractFactory("TradingPairAlgorithm")).deploy(positionsController.address);

        posFactory = await (await ethers.getContractFactory("PositionsFactory")).deploy(
            positionsController.address,
            ethAssetsController.address,
            erc20AssetsController.address,
            erc721AssetsController.address,
            lock.address,
            tradingPair.address
        );

        // задаем фабрики
        positionsController.setFactories([
            posFactory.address,
            ethAssetsController.address,
            erc20AssetsController.address,
            erc721AssetsController.address,
            lock.address,
            tradingPair.address], true);

        token = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
    });

    describe("создаем лок", async () => {
        var token1;
        var positionData;
        var algorithm;
        var asset1;
        var asset2;
        var positionId;

        beforeEach(async () => {
            // привязка тестовых токенов
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

            token1.mint(1000);
            token1.approve(erc20AssetsController.address, 1000);

            await expect(posFactory.createLockPosition(
                [2, token1.address, 1000],
                1000))
                .to.emit(positionsController, 'NewPosition')
                .withArgs(owner.address, lock.address, 1);

            // читаем позицию
            positionId = 1;
            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];
        });

        it("проверка ассетов после создания", async () => {

            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];

            // проверяем 1 ассет
            expect(await asset1.addr).to.eq(erc20AssetsController.address);
            expect(await asset1.id).to.eq(1);
            expect(await asset1.assetTypeId).to.eq(2);
            expect(await asset1.positionId).to.eq(positionId);
            expect(await asset1.positionAssetCode).to.eq(1);
            expect(await asset1.owner).to.eq(owner.address);
            expect(await asset1.count).to.eq(1000);
            expect(await asset1.contractAddr).to.eq(token1.address);
            expect(await asset1.value).to.eq(0);

            // проверяем 2 ассет
            expect(await asset2.addr).to.eq('0x0000000000000000000000000000000000000000');

            // токен перешел от владельца на ассет
            expect(await token1.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(asset1.addr)).to.eq(1000);
        });
        it("позиция залочена сразу", async () => {
            expect(await positionsController.positionLocked(positionId)).to.eq(true);
        });
        it("вывести ассеты нельзя", async () => {
            await expect(positionsController.withdraw(positionId, 1,
                await positionsController.count([asset1.addr, asset1.id])))
                .to.be.revertedWith('position is locked');
        });
        it("время лока", async () => {
            expect(await lock.lapsedLockSeconds(positionId)).to.eq(1000);
            Up(Seconds(100));
            expect((await lock.lapsedLockSeconds(positionId))).to.eq(900);
            Up(Seconds(1000));
            expect(await lock.lapsedLockSeconds(positionId)).to.eq(0);
            expect(await positionsController.positionLocked(positionId)).to.eq(false);
        });
        it("вывод выждав время лока", async () => {
            Up(Seconds(1000));
            await positionsController.withdraw(positionId, 1,
                await positionsController.count([asset1.addr, asset1.id]));

            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            expect(await asset1.count).to.eq(0);
            expect(await token1.balanceOf(owner.address)).to.eq(1000);
            expect(await token1.balanceOf(asset1.addr)).to.eq(0);
        });
    });

    describe("создаем лок с ассетами разных типов", async () => {
        var token1;
        var positionData;
        var algorithm;
        var asset1;
        var asset2;
        var positionId;

        it("erc721 asset", async () => {
            // привязка тестовых токенов
            token1 = await (await ethers.getContractFactory("Erc721TestToken")).deploy();

            token1.mint(1, owner.address);
            token1.approve(erc721AssetsController.address, 1);

            await expect(posFactory.createLockPosition(
                [3, token1.address, 1],
                0))
                .to.emit(positionsController, 'NewPosition')
                .withArgs(owner.address, lock.address, 1);

            // читаем позицию
            positionId = 1;
            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];

            expect(await token1.ownerOf(1)).to.eq(asset1.addr);

            // вывод
            await positionsController.withdraw(positionId, 1, 1);
            expect(await token1.ownerOf(1)).to.eq(owner.address);
        });

        it("eth asset", async () => {
            await expect(posFactory.createLockPosition(
                [1, token1.address, ethers.utils.parseEther("1.0")],
                0, { value: ethers.utils.parseEther("1.0") }))
                .to.emit(positionsController, 'NewPosition')
                .withArgs(owner.address, lock.address, 1);

            // читаем позицию
            positionId = 1;
            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];

            expect(await waffle.provider.getBalance(asset1.addr))
                .to.eq(ethers.utils.parseEther("1.0"));

            // вывод
            await positionsController.withdraw(positionId, 1, ethers.utils.parseEther("1.0"));
            expect(await waffle.provider.getBalance(asset1.addr)).to.eq(0);
        });

        it("eth asset сдача выдается", async () => {
            var lastBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
            await posFactory.createLockPosition(
                [1, '0x0000000000000000000000000000000000000000', ethers.utils.parseEther("1.0")],
                1000, { value: ethers.utils.parseEther("10.0") });

            // проверка сдачи
            var newBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
            var consumedEthers = lastBalance.minus(newBalance).div(new BigNumber('1e18'));
            //console.log('consumed ', consumedEthers.toFixed());
            expect(consumedEthers.isLessThan(new BigNumber('1.01'))).to.eq(true);
        });
    });
});