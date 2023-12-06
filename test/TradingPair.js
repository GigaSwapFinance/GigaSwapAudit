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
    let positionsController;
    let lock;
    let giga;
    let erc20Factory;
    let tradingPair;
    let tradingPairReader;
    let ethAssetsController;
    let erc20AssetsController;
    let erc721AssetsController;
    let posFactory;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        positionsController = await (await ethers.getContractFactory("PositionsController")).deploy(feeSettings.address);
        ethAssetsController = await (await ethers.getContractFactory("EthAssetsController")).deploy(positionsController.address);
        erc20AssetsController = await (await ethers.getContractFactory("Erc20AssetsController")).deploy(positionsController.address);
        erc721AssetsController = await (await ethers.getContractFactory("Erc721ItemAssetsController")).deploy(positionsController.address);
        lock = await (await ethers.getContractFactory("PositionLockerAlgorithm")).deploy(positionsController.address);
        erc20Factory = await (await ethers.getContractFactory("Erc20ForFactoryFactory")).deploy()
        tradingPair = await (await ethers.getContractFactory("TradingPairAlgorithm")).deploy(positionsController.address, erc20Factory.address);
        tradingPairReader = await (await ethers.getContractFactory("TradingPairReader")).deploy(tradingPair.address)
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

    it("проверка ридера сделок", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [1, 2], [3, 4]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        var data = await tradingPairReader.getTradingPair(positionId);
        expect(data.owner).to.eq(owner.address);
        //console.log('data:\n', data);
    });

    it("создание сделки с эфиром", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));
    });

    it("ограничение свапа по влиянию на цену обратный свап", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = 30;
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await expect(positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap))
            .to.be.revertedWith('7');
    });

    it("свап (тратим токен получаем эфир)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = 1;
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);
    });

    it("свап (тратим эфир получаем токен)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = '1000000000000';
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap, { value: swapCount });

        expect(await waffle.provider.getBalance(tradingPair.address)).to.eq(0);
        expect((await waffle.provider.getBalance(asset1.addr)).toString()).to.eq('1001000000000000');
    });

    it("свап (тратим эфир, проверка сбора налога)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [100, 200], [300, 400]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = '1000000000000';
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap, { value: swapCount });

        expect(await waffle.provider.getBalance(tradingPair.address)).to.eq(0);
        expect((await waffle.provider.getBalance(asset1.addr)).toString()).to.eq('1001000000000000');

        //var feeToken = await ethers.getContractAt("Erc20ForFactory", tradingPair.feeTokens(positionId));

        var feeDistributer = await ethers.getContractAt("TradingPairFeeDistributer",
            await tradingPair.feedistributors(positionId));

        var asset1Ref = await feeDistributer.asset(1);
        var asset2Ref = await feeDistributer.asset(2);
        var feeAsset1 = await ethers.getContractAt("IAssetsController", asset1Ref.addr);
        var feeAsset2 = await ethers.getContractAt("IAssetsController", asset2Ref.addr);
        //console.log('feeAsset1Count ', await feeAsset1.count(asset1Ref.id));
        //console.log('feeAsset2Count ', await feeAsset2.count(asset2Ref.id));

        expect(new BigNumber((await feeAsset1.count(asset1Ref.id)).toString())
            .isGreaterThan(new BigNumber(0))).to.eq(true);
        //expect(new BigNumber((await feeAsset2.count(asset2Ref.id)).toString())
        //    .isGreaterThan(new BigNumber(0))).to.eq(true);
    });

    it("свап (тратим эфир, проверка получения собранного налога - через принудительныую прокрутку интервала налогооблажения)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [100, 200], [300, 400]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = '1000000000000';
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap, { value: swapCount });

        expect(await waffle.provider.getBalance(tradingPair.address)).to.eq(0);
        expect((await waffle.provider.getBalance(asset1.addr)).toString()).to.eq('1001000000000000');

        var feeDistributer = await ethers.getContractAt("TradingPairFeeDistributer",
            await tradingPair.feedistributors(positionId));

        var asset1Ref = await feeDistributer.asset(1);
        var asset2Ref = await feeDistributer.asset(2);
        var feeAsset1 = await ethers.getContractAt("IAssetsController", asset1Ref.addr);
        var feeAsset2 = await ethers.getContractAt("IAssetsController", asset2Ref.addr);
        //console.log('feeAsset1Count ', await feeAsset1.count(asset1Ref.id));
        //console.log('feeAsset2Count ', await feeAsset2.count(asset2Ref.id));

        expect(new BigNumber((await feeAsset1.count(asset1Ref.id)).toString())
            .isGreaterThan(new BigNumber(0))).to.eq(true);
        //expect(new BigNumber((await feeAsset2.count(asset2Ref.id)).toString())
        //    .isGreaterThan(new BigNumber(0))).to.eq(true);

        // лочим токен налога
        var feeToken = await ethers.getContractAt("Erc20ForFactory", tradingPair.feeTokens(positionId));
        var feeTokensCount = new BigNumber((await feeToken.balanceOf(owner.address)).toString());
        await feeToken.approve(feeDistributer.address, feeTokensCount.toString());
        await feeDistributer.lockFeeTokens(feeTokensCount.toString());

        // изначально нет реварда
        var lastFeeCountData = await feeDistributer.getExpectedRewardForTokensCount(feeTokensCount.toString());
        var lastRewardCount = new BigNumber((lastFeeCountData[0]).toString());
        expect(lastRewardCount.toString()).to.eq('0');

        // ждем интервала сбора налога
        expect(await feeDistributer.feeRoundNumber()).to.eq(0);
        //Up(Minutes(await feeDistributer.nextFeeRoundLapsedMinutes()));
        Up(Days(1));

        // ревард есть
        await feeDistributer.tryNextFeeRound();
        expect(await feeDistributer.feeRoundNumber()).to.eq(1);
        var newFeeCountData = await feeDistributer.getExpectedRewardForTokensCount(feeTokensCount.toString());
        var newRewardCount = new BigNumber((newFeeCountData[0]).toString());
        expect(newRewardCount.isGreaterThan(new BigNumber(0))).to.eq(true);

        // вывод реварда
        await feeDistributer.claimRewards();

        // ревард дошел

    });

    it("свап (тратим эфир, проверка получения собранного налога - интервал налогооблажения меняется во время вывода реварда)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [100, 200], [300, 400]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2
        swapCount = '1000000000000';
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap, { value: swapCount });

        expect(await waffle.provider.getBalance(tradingPair.address)).to.eq(0);
        expect((await waffle.provider.getBalance(asset1.addr)).toString()).to.eq('1001000000000000');

        var feeDistributer = await ethers.getContractAt("TradingPairFeeDistributer",
            await tradingPair.feedistributors(positionId));

        var asset1Ref = await feeDistributer.asset(1);
        var asset2Ref = await feeDistributer.asset(2);
        var feeAsset1 = await ethers.getContractAt("IAssetsController", asset1Ref.addr);
        var feeAsset2 = await ethers.getContractAt("IAssetsController", asset2Ref.addr);
        //console.log('feeAsset1Count ', await feeAsset1.count(asset1Ref.id));
        //console.log('feeAsset2Count ', await feeAsset2.count(asset2Ref.id));

        expect(new BigNumber((await feeAsset1.count(asset1Ref.id)).toString())
            .isGreaterThan(new BigNumber(0))).to.eq(true);
        //expect(new BigNumber((await feeAsset2.count(asset2Ref.id)).toString())
        //    .isGreaterThan(new BigNumber(0))).to.eq(true);

        // лочим токен налога
        var feeToken = await ethers.getContractAt("Erc20ForFactory", tradingPair.feeTokens(positionId));
        var feeTokensCount = new BigNumber((await feeToken.balanceOf(owner.address)).toString());
        await feeToken.approve(feeDistributer.address, feeTokensCount.toString());
        await feeDistributer.lockFeeTokens(feeTokensCount.toString());

        // изначально нет реварда
        var lastFeeCountData = await feeDistributer.getExpectedRewardForTokensCount(feeTokensCount.toString());
        var lastRewardCount = new BigNumber((lastFeeCountData[0]).toString());
        expect(lastRewardCount.toString()).to.eq('0');

        // ждем интервала сбора налога
        expect(await feeDistributer.feeRoundNumber()).to.eq(0);
        //Up(Minutes(await feeDistributer.nextFeeRoundLapsedMinutes()));
        Up(Days(1));

        // вывод реварда
        await feeDistributer.claimRewards();
        expect(await feeDistributer.feeRoundNumber()).to.eq(1);

        // ревард дошел

    });

    it("свап (erc20 decimals 0/18)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);

        token1.mint('100000');
        token2.mint('100000000000000000000');
        token1.approve(erc20AssetsController.address, '100000000000000000000');
        token2.approve(erc20AssetsController.address, '100000000000000000000');

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 100000],
            [2, token2.address, '100000000000000000'],
            [24, [0, 0], [0, 0]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2      
        swapCount = '10000';
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);

        var lastToken2Balance = new BigNumber((await token2.balanceOf(acc2.address)).toString());
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap);
        var newToken2Balance = new BigNumber((await token2.balanceOf(acc2.address)).toString());
        expect(lastToken2Balance.isLessThan(newToken2Balance)).to.eq(true);
    });

    it("свап (erc20 decimals 18/0)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint('100000000000000000000');
        token2.mint('100000');
        token1.approve(erc20AssetsController.address, '100000000000000000000');
        token2.approve(erc20AssetsController.address, '100000000000000000000');

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, '100000000000000000'],
            [2, token2.address, 1000],
            [24, [0, 0], [0, 0]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // читаем снапшот c 100% слипейдж
        snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        // покупка токена 1 акком 2      
        swapCount = '100';
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);
    });

    it("фабрика выдает сдачу эфиром", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        // минт токена и апрув
        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        // создаем торговую пару
        var lastBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
        await posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', ethers.utils.parseEther("1.0")],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("10.0") });

        // проверка сдачи
        var newBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
        var consumedEthers = lastBalance.minus(newBalance).div(new BigNumber('1e18'));
        expect(consumedEthers.isLessThan(new BigNumber('1.01'))).to.eq(true);
    });

    it("пополнение ликвидности (эфир токен)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await expect(posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") }))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        token1.mint(100000);
        token1.approve(erc20AssetsController.address, 100000);
        await tradingPair.addLiquidity(positionId, 1, ethers.utils.parseEther("1.0"),
            { value: ethers.utils.parseEther("10.0") });
    });

    it("пополнение ликвидности выдает сдачу эфиром (эфир токен)", async function () {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token1.approve(erc20AssetsController.address, 1000);

        await posFactory.createTradingPairPosition(
            [1, '0x0000000000000000000000000000000000000000', '1000000000000000'],
            [2, token1.address, 100],
            [24, [0, 0], [0, 0]], [false, false], { value: ethers.utils.parseEther("1.0") });

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 100% слипейдж
        token1.mint(100000);
        token1.approve(erc20AssetsController.address, 100000);
        var lastBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
        await tradingPair.addLiquidity(positionId, 1, ethers.utils.parseEther("1.0"),
            { value: ethers.utils.parseEther("10.0") });

        // проверка сдачи
        var newBalance = new BigNumber((await waffle.provider.getBalance(owner.address)).toString());
        var consumedEthers = lastBalance.minus(newBalance).div(new BigNumber('1e18'));
        expect(consumedEthers.isLessThan(new BigNumber('1.01'))).to.eq(true);
    });

    describe("создаем торговую пару", async () => {
        var token1;
        var token2;
        var positionData;
        var algorithm;
        var asset1;
        var asset2;
        var positionId;
        let liquidity;

        beforeEach(async () => {
            // привязка тестовых токенов
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

            token1.mint(1000);
            token2.mint(100);
            token1.approve(erc20AssetsController.address, 1000);
            token2.approve(erc20AssetsController.address, 100);

            await expect(posFactory.createTradingPairPosition(
                [2, token1.address, 1000],
                [2, token2.address, 100],
                [24, [0, 2000], [0, 0]], [false, false]))
                .to.emit(positionsController, 'NewPosition')
                .withArgs(owner.address, tradingPair.address, 1);

            // читаем позицию
            positionId = 1;
            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];

            // получаем токен ликвидности
            liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
                .attach(tradingPair.getLiquidityToken(positionId));
        });

        it("проверка ассетов после создания", async () => {
            positionData = await positionsController.getPosition(positionId);
            algorithm = positionData[0];
            asset1 = positionData[1];
            asset2 = positionData[2];

            // проверяем 1 позицию
            expect(await asset1.addr).to.eq(erc20AssetsController.address);
            expect(await asset1.id).to.eq(1);
            expect(await asset1.assetTypeId).to.eq(2);
            expect(await asset1.positionId).to.eq(positionId);
            expect(await asset1.positionAssetCode).to.eq(1);
            expect(await asset1.owner).to.eq(owner.address);
            expect(await asset1.count).to.eq(1000);
            expect(await asset1.contractAddr).to.eq(token1.address);
            expect(await asset1.value).to.eq(0);

            // проверяем 2 позицию
            expect(await asset2.addr).to.eq(erc20AssetsController.address);
            expect(await asset2.id).to.eq(2);
            expect(await asset2.assetTypeId).to.eq(2);
            expect(await asset2.positionId).to.eq(positionId);
            expect(await asset2.positionAssetCode).to.eq(2);
            expect(await asset2.owner).to.eq(owner.address);
            expect(await asset2.count).to.eq(100);
            expect(await asset2.contractAddr).to.eq(token2.address);
            expect(await asset2.value).to.eq(0);
        });
        it("проверка лока", async () => {
            expect(await tradingPair.positionLocked(positionId)).to.eq(true);
            expect(await tradingPair.isPermanentLock(positionId)).to.eq(true);
            expect(await tradingPair.lapsedLockSeconds(positionId)).to.eq(0);
        });
        it("проверка созданных токенов ликвидности", async () => {
            expect(await liquidity.balanceOf(owner.address)).to.eq(100000);
        });
        it("вывод всей ликвидности", async () => {
            await tradingPair.withdraw(positionId, await liquidity.balanceOf(owner.address));
            expect(await liquidity.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(owner.address)).to.eq(1000);
            expect(await token2.balanceOf(owner.address)).to.eq(100);
        });
        it("добавление ликвидности", async () => {
            token1.mint(1000);
            token2.mint(100);
            token1.approve(erc20AssetsController.address, 10000000000);
            token2.approve(erc20AssetsController.address, 10000000000);

            await tradingPair.addLiquidity(positionId, 1, 100);
            expect(await liquidity.balanceOf(owner.address)).to.eq(110000);
            expect(await token1.balanceOf(owner.address)).to.eq(900);
            expect(await token1.balanceOf(erc20AssetsController.address)).to.eq(1100);
            expect(await token2.balanceOf(owner.address)).to.eq(90);
            expect(await token2.balanceOf(erc20AssetsController.address)).to.eq(110);
        });
        it("позиция залочена сразу", async () => {
            expect(await positionsController.positionLocked(positionId)).to.eq(true);
        });
        it("вывести ассеты нельзя", async () => {
            await expect(positionsController.withdraw(positionId, 1,
                await positionsController.count([asset1.addr, asset1.id])))
                .to.be.revertedWith('3');
            await expect(positionsController.withdraw(positionId, 2,
                await positionsController.count([asset2.addr, asset2.id])))
                .to.be.revertedWith('3');
        });
        it("проверка слишком большого влияния на цену - не прокатит более 50%", async () => {
            // читаем снапшот c 100% слипейдж
            snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
            // покупка токена 1 акком 2
            swapCount = 30;
            await token2.connect(acc2).mint(swapCount);
            await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
            await expect(positionsController.connect(acc2)
                .transferToAsset(positionId, 2, swapCount, snap))
                .to.be.revertedWith('7');
        });

        describe("производим покупку 2 акком", async () => {
            beforeEach(async () => {
                // читаем снапшот c 20% слипейдж
                snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
                // покупка токена 1 акком 2      
                swapCount = 10;
                await token2.connect(acc2).mint(swapCount);
                await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
                await positionsController.connect(acc2)
                    .transferToAsset(positionId, 2, swapCount, snap);
            });

            it("проверка покупки", async () => {
                // за 10 токенов купили 73 токена 1
                expect(await token1.balanceOf(acc2.address)).to.eq(73);
                // все токена 2 потрачены
                expect(await token2.balanceOf(acc2.address)).to.eq(0);
            });
        });
    });

    it("баг сбора ерц20 налога", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);


        var pair = await tradingPairReader.getTradingPair(positionId);
        var feeDistributer = await (await ethers.getContractFactory("TradingPairFeeDistributer")).attach(pair.feeDistributer);
        //console.log('fee distributer ', feeDistributer.address);

        expect(await feeDistributer.assetCount(1)).is.not.eq(0);
        expect(await feeDistributer.assetCount(2)).is.not.eq(0);
    });

    it("сбор налога - ограничитель сбора в текущем интервале", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);


        var pair = await tradingPairReader.getTradingPair(positionId);
        var feeDistributer = await (await ethers.getContractFactory("TradingPairFeeDistributer")).attach(pair.feeDistributer);
        //console.log('fee distributer ', feeDistributer.address);

        expect(await feeDistributer.assetCount(1)).is.not.eq(0);
        expect(await feeDistributer.assetCount(2)).is.not.eq(0);

        //console.log(await feeDistributer.assetCount(1))
        //console.log(await feeDistributer.assetCount(2))

        var reward = await feeDistributer.getExpectedRewardForAccount(owner.address);
        expect(reward[0].toString()).to.eq('0');
        expect(reward[1].toString()).to.eq('0');

        await Up(Minutes(await feeDistributer.nextFeeRoundLapsedMinutes()));
        await Up(Minutes(await feeDistributer.nextFeeRoundLapsedMinutes()));
        await Up(Minutes(100000));
        reward = await feeDistributer.getExpectedRewardForAccount(owner.address);
        expect(reward[0].toString()).to.eq('0');
        expect(reward[1].toString()).to.eq('0');
        //console.log(await feeDistributer.nextFeeRoundLapsedMinutes())
        //console.log(await feeDistributer.feeRoundNumber())

        feetoken = await (await ethers.getContractFactory("Erc20ForFactory")).attach(pair.feeToken);
        await feetoken.approve(feeDistributer.address, 100000);

        await feeDistributer.lockFeeTokens(10000);
        reward = await feeDistributer.getExpectedRewardForAccount(owner.address);
        expect(reward[0].toString()).to.eq('0');
        expect(reward[1].toString()).to.eq('0');
        await expect(feeDistributer.claimRewards()).to.be.revertedWith('claimed yet or stacked on current round - wait for next round');
    });

    it("сбор налога", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);


        var pair = await tradingPairReader.getTradingPair(positionId);
        var feeDistributer = await (await ethers.getContractFactory("TradingPairFeeDistributer")).attach(pair.feeDistributer);

        feetoken = await (await ethers.getContractFactory("Erc20ForFactory")).attach(pair.feeToken);
        await feetoken.approve(feeDistributer.address, 100000);
        await feeDistributer.lockFeeTokens(10000);
        //console.log('fee distributer ', feeDistributer.address);

        expect(await feeDistributer.assetCount(1)).is.not.eq(0);
        expect(await feeDistributer.assetCount(2)).is.not.eq(0);

        //console.log(await feeDistributer.assetCount(1))
        //console.log(await feeDistributer.assetCount(2))

        // console.log(await feeDistributer.getExpectedRewardForAccount(owner.address))

        await Up((await feeDistributer.nextFeeRoundLapsedTime()) * 1);
        //console.log(await feeDistributer.getExpectedRewardForAccount(owner.address))
        //console.log(await feeDistributer.nextFeeRoundLapsedMinutes())
        //console.log(await feeDistributer.feeRoundNumber())

        //console.log(await feeDistributer.getExpectedRewardForAccount(owner.address))
        await feeDistributer.claimRewards();
    });

    it("лок и анлок", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap);


        var pair = await tradingPairReader.getTradingPair(positionId);
        var feeDistributer = await (await ethers.getContractFactory("TradingPairFeeDistributer")).attach(pair.feeDistributer);

        feetoken = await (await ethers.getContractFactory("Erc20ForFactory")).attach(pair.feeToken);
        expect(await feetoken.balanceOf(owner.address)).to.eq(100000);
        await feetoken.approve(feeDistributer.address, 100000);
        await feeDistributer.lockFeeTokens(10000);

        await Up((await feeDistributer.nextFeeRoundLapsedTime()) * 1);

        await feeDistributer.claimRewards();

        expect(await feeDistributer.getLock(owner.address)).to.eq(10000);
        expect(await feetoken.balanceOf(owner.address)).to.eq(90000);
        await feeDistributer.unlockFeeTokens(10000);
        expect(await feeDistributer.getLock(owner.address)).to.eq(0);
        expect(await feetoken.balanceOf(owner.address)).to.eq(100000);
    });

    it("два запроса в тотже блок невозможны", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        positionData = await positionsController.getPosition(positionId);
        algorithm = positionData[0];
        asset1 = positionData[1];
        asset2 = positionData[2];

        // получаем токен ликвидности
        liquidity = await (await ethers.getContractFactory("Erc20ForFactory"))
            .attach(tradingPair.getLiquidityToken(positionId));

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount / 2, snap);
        await expect(positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount / 2, snap)).to.be.revertedWith('15');
        await positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount / 2, snap)
    });

    it("ограничитель прямого свапа", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [true, false]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        var data = await tradingPairReader.getTradingPair(positionId);
        expect(data.constraints.disableForwardSwap).to.eq(true);
        expect(data.constraints.disableBackSwap).to.eq(false);

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token2.connect(acc2).mint(swapCount);
        await token2.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await expect(positionsController.connect(acc2)
            .transferToAsset(positionId, 2, swapCount, snap)).to.be.revertedWith('10');
    });

    it("ограничитель обратного свапа", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [false, true]))
            .to.emit(positionsController, 'NewPosition')
            .withArgs(owner.address, tradingPair.address, 1);

        // читаем позицию
        positionId = 1;
        var data = await tradingPairReader.getTradingPair(positionId);
        expect(data.constraints.disableForwardSwap).to.eq(false);
        expect(data.constraints.disableBackSwap).to.eq(true);

        // читаем снапшот c 20% слипейдж
        snap = await tradingPair.getSnapshot(positionId, '1210121012101210120');
        // покупка токена 1 акком 2      
        swapCount = 10;
        await token1.connect(acc2).mint(swapCount);
        await token1.connect(acc2).approve(erc20AssetsController.address, swapCount);
        await expect(positionsController.connect(acc2)
            .transferToAsset(positionId, 1, swapCount, snap)).to.be.revertedWith('11');
    });

    it("ограничитель создания полностью блокированной позиции", async () => {
        // привязка тестовых токенов
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);

        token1.mint(1000);
        token2.mint(100);
        token1.approve(erc20AssetsController.address, 1000);
        token2.approve(erc20AssetsController.address, 100);

        await expect(posFactory.createTradingPairPosition(
            [2, token1.address, 1000],
            [2, token2.address, 100],
            [24, [1000, 1000], [1000, 1000]], [true, true]))
            .to.be.revertedWith('both directions of the swap are disallowed')
    });
});