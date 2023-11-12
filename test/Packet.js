const { expect } = require("chai");
const { Up, Days, Seconds } = require("./Helpers/TimeHelper");
const { BigNumber } = require("bignumber.js");
const { ethers } = require('hardhat');

describe("PacketErc20:", function () {
    let owner;
    let accs;
    let packet;
    let token;
    beforeEach(async () => {
        [owner, ...accs] = await ethers.getSigners();
        packet = await (await ethers.getContractFactory("PacketErc20")).deploy();
        token = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
    });
    describe("шлем в карман токен", function () {
        const count = 100;
        const time = 60;
        beforeEach(async () => {
            await token.mint(count);
            await token.approve(packet.address, count);
            var timeToClaim = (await ethers.provider.getBlock()).timestamp + time + 1;
            await expect(packet.addStack(owner.address, token.address, count, time))
                .that.emit(packet, 'OnAddStack').withArgs(owner.address, token.address, count, timeToClaim);
        });
        it("баланс равен всему что выслали", async () => {
            expect(await packet.balance(owner.address, token.address)).to.eq(count);
        });
        it("количество на минт равно 0 тк не вышло время", async () => {
            expect(await packet.claimCount(owner.address, token.address)).to.eq(0);
        });
        it("имеется 1 стак", async () => {
            const stacks = await packet.stacks(owner.address, token.address);
            expect(stacks.length).to.eq(1);
            expect(stacks[0].count).to.eq(count);
        });
        it("стак имеет указанный размер", async () => {
            const stacks = await packet.stacks(owner.address, token.address);
            expect(stacks[0].count).to.eq(count);
        });
        it("токен перешел на баланс кармана", async () => {
            expect(await token.balanceOf(owner.address)).to.eq(0);
            expect(await token.balanceOf(packet.address)).to.eq(count);
        });
        describe("выжидаем время вывода", function () {
            beforeEach(async () => {
                await Up(time);
            });
            it("баланс равен всему что выслали", async () => {
                expect(await packet.balance(owner.address, token.address)).to.eq(count);
            });
            it("количество на минт стало равно разблокированному количеству", async () => {
                expect(await packet.claimCount(owner.address, token.address)).to.eq(count);
            });
        });

        describe("шлем в карман токен второй раз, на время в 2 раза большее", function () {
            beforeEach(async () => {
                await token.mint(count);
                await token.approve(packet.address, count);
                var timeToClaim = (await ethers.provider.getBlock()).timestamp + 2 * time + 1;
                await expect(packet.addStack(owner.address, token.address, count, 2 * time))
                    .that.emit(packet, 'OnAddStack').withArgs(owner.address, token.address, count, timeToClaim);
            });
            it("баланс равен всему что выслали", async () => {
                expect(await packet.balance(owner.address, token.address)).to.eq(2 * count);
            });
            it("количество на минт равно 0 тк не вышло время", async () => {
                expect(await packet.claimCount(owner.address, token.address)).to.eq(0);
            });
            it("имеется 2 стака", async () => {
                const stacks = await packet.stacks(owner.address, token.address);
                expect(stacks.length).to.eq(2);
            });
            it("2 стак имеет указанный размер", async () => {
                const stacks = await packet.stacks(owner.address, token.address);
                expect(stacks[0].count).to.eq(count);
            });
            it("токен перешел на баланс кармана", async () => {
                expect(await token.balanceOf(owner.address)).to.eq(0);
                expect(await token.balanceOf(packet.address)).to.eq(2 * count);
            });
            it("2 стак разблокируется позже 1", async () => {
                const stacks = await packet.stacks(owner.address, token.address);
                expect(new BigNumber(stacks[0].claimTime.toString()) < (new BigNumber(stacks[1].claimTime.toString())))
                    .to.eq(true);
            });
            it("с пустым балансом клеймить нельзя", async () => {
                await expect(packet.connect(accs[1]).claim(token.address)).to.be.revertedWith('nothing to claim');
            });
            describe("выжидаем время вывода одного стака", function () {
                beforeEach(async () => {
                    await Up(time);
                });
                it("баланс равен всему что выслали", async () => {
                    expect(await packet.balance(owner.address, token.address)).to.eq(2 * count);
                });
                it("количество на минт стало равно разблокированному стаку", async () => {
                    expect(await packet.claimCount(owner.address, token.address)).to.eq(count);
                });
                it("с пустым балансом клеймить нельзя", async () => {
                    await expect(packet.connect(accs[1]).claim(token.address)).to.be.revertedWith('nothing to claim');
                });
                describe("выводим первый стак", function () {
                    beforeEach(async () => {
                        await expect(packet.claim(token.address))
                            .that.emit(packet, 'OnClaim').withArgs(owner.address, token.address, count);
                    });
                    it("баланс стака перешел на овнера", async () => {
                        expect(await token.balanceOf(owner.address)).to.eq(count);
                        expect(await token.balanceOf(packet.address)).to.eq(count);
                    });
                    it("остался 1 стак", async () => {
                        const stacks = await packet.stacks(owner.address, token.address);
                        expect(stacks.length).to.eq(1);
                    });
                    it("баланс в пакете уменьшен", async () => {
                        expect(await packet.balance(owner.address, token.address)).to.eq(count);
                    });
                    it("количество на минт занулилось", async () => {
                        expect(await packet.claimCount(owner.address, token.address)).to.eq(0);
                    });
                });
                describe("выжидаем время вывода второго стака", function () {
                    beforeEach(async () => {
                        await Up(time);
                    });
                    it("баланс равен всему что выслали", async () => {
                        expect(await packet.balance(owner.address, token.address)).to.eq(2 * count);
                    });
                    it("количество на минт стало равно двум разблокированным стакам", async () => {
                        expect(await packet.claimCount(owner.address, token.address)).to.eq(2 * count);
                    });
                });
            });
        });
    });
});
