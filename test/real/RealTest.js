const { expect } = require("chai");
const { Up, Days, Seconds, Minutes } = require("../Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
var chai = require('chai');
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
chai.use(require('chai-bignumber')());
const addresses = require("./ContractAddresses.js");

/*describe("RealTest:", function () {
    let token;
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let positionsController;
    let lock;
    let sale;
    let tradingPair;
    let ethAssetsController;
    let erc20AssetsController;
    let erc721AssetsController;
    let posFactory;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).attach(addresses.FeeSettings);
        positionsController = await (await ethers.getContractFactory("PositionsController")).attach(addresses.PositionTrading.PositionsController);
        ethAssetsController = await (await ethers.getContractFactory("EthAssetsController")).attach(addresses.PositionTrading.Assets.EthAssetsController);
        erc20AssetsController = await (await ethers.getContractFactory("Erc20AssetsController")).attach(addresses.PositionTrading.Assets.Erc20AssetsController);
        erc721AssetsController = await (await ethers.getContractFactory("Erc721ItemAssetsController")).attach(addresses.PositionTrading.Assets.Erc721ItemAssetsController);
        lock = await (await ethers.getContractFactory("PositionLockerAlgorithm")).attach(addresses.PositionTrading.Algorithms.PositionLockerAlgorithm);
        tradingPair = await (await ethers.getContractFactory("TradingPairAlgorithm")).attach(addresses.PositionTrading.Algorithms.TradingPairAlgorithm);
        tradingPairReader = await (await ethers.getContractFactory("TradingPairReader")).attach(addresses.PositionTrading.Algorithms.TradingPairReader)

        posFactory = await (await ethers.getContractFactory("PositionsFactory")).attach(addresses.PositionTrading.PositionsFactory);
    });

    it("проверка торговой пары 3", async function () {
        const acc = await ethers.getImpersonatedSigner('0xdba78819EBAA14b4F8CA97841c0ab63886D23E6d');
        positionId = 3;
        let feeDistributer = await (await ethers.getContractFactory("TradingPairFeeDistributer")).attach("0x181F3bE323D7725Be2838Aa10C46E1438083b6EA");
        console.log("asset 1 count ", await feeDistributer.assetCount(1))
        console.log("asset 2 count ", await feeDistributer.assetCount(2))
        console.log("asset 1 ", await feeDistributer.asset(1))
        console.log("asset 2 ", await feeDistributer.asset(2))

        /*snap = await tradingPair.getSnapshot(positionId, (new BigNumber('1e18')).toString());
        //await token2.connect(acc).approve(erc20AssetsController.address, swapCount);
        swapCount = '100';
        await positionsController.connect(acc)
            .transferToAsset(
                positionId,
                1,
                swapCount,
                snap);*/
    /*});
});*/