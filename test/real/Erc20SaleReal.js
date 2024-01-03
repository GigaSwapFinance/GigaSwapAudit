const { expect } = require("chai");
const { Up, Days, Seconds } = require("../Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
//const helpers = require("@nomicfoundation/hardhat-network-helpers");
/*
describe("Erc20SaleReal:", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let erc20Sale;

    // перед каждым тестом деплоим контракт
    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).attach("0xE66bD09f8F3bbAD899E9F2CB2458EB1BBD70eF53");
    });

    it("bug 1", async () => {
        //token1 = await (await ethers.getContractFactory("Erc20TestToken")).attach("0x46111689E2C214e912B950fceA4c2188dE9C24e7");
        //token2 = await (await ethers.getContractFactory("Erc20TestToken")).attach("0xE46Ee2658bcb4fBafC0AD618FC12C2890042C35C");

        const acc = await ethers.getImpersonatedSigner("0x7e6Ed4DC265Ef8ACc096e59B0d4FB932e7ebfd29");
        var position = await erc20Sale.connect(acc).getPosition(10);
        console.log(position);
        token1 = await (await ethers.getContractFactory("Erc20TestToken")).attach("0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60");
        token2 = await (await ethers.getContractFactory("Erc20TestToken")).attach("0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C");
        console.log('balance 1: ', await token1.balanceOf(acc.address));
        console.log('balance 2: ', await token2.balanceOf(acc.address));
        console.log('allowance: ', await token2.allowance(acc.address, erc20Sale.address));

        await erc20Sale.connect(acc).Buy(10, acc.address, "100", position.priceNom, position.priceDenom);
    });
});
*/