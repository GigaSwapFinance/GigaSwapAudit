const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");

describe("Erc20Sale:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let giga;
    let erc20Sale;
    //let packet;
    let locker;
    const LOCK_PRECISION = 10000;

    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
    });

    it("проверка процента налога", async () => {
        await giga.connect(addrs[3]).mint(100);
        const tokensCount = 100000;
        const tokensFee = 300;
        expect(await feeSettings.feeForCount(owner.address, tokensCount)).to.eq(tokensFee);
    });
});
