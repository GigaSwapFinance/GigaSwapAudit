const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");

describe("Erc20Sale:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let erc20AssetsController;
    let erc20Sale;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy();
        erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).deploy(feeSettings.address);
    });

    describe("создание позиции", function () {
        var token1;
        var token2;
        var positionId;
        var position;

        beforeEach(async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(1000);
            await token1.approve(erc20Sale.address, 1000);

            await expect(erc20Sale.createAsset(token1.address, token2.address, 2, 1, 1000))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1, owner.address, token1.address, token2.address, 2, 1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);
        });

        it("покупка", async function () {
            await token2.connect(acc2).mint(1000);
            await token2.connect(acc2).approve(erc20Sale.address, 1000);

            for (var i = 0; i < 100; ++i) {
                await erc20Sale.connect(acc2).buy(positionId, acc2.address, 1, position.priceNom, position.priceDenom);
            }
        });
    });
});
