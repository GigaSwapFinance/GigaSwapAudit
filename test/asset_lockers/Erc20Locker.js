const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { Up, Days } = require("../Helpers/TimeHelper");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("Erc20Locker", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;

    let giga;
    let token;
    let feeSettings;
    let locker;

    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();

        // гигасвап токен
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        // настройки налога
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        // локер
        locker = await (await ethers.getContractFactory("Erc20Locker")).deploy(feeSettings.address);
        // тестовый токен
        token = await (await ethers.getContractFactory("Erc20TestToken")).deploy(0);
    });

    it("вначале позиций 0", async () => {
        expect(await locker.positionsCount()).to.equals(0);
    });

    it("получить не существующую позицию нельзя", async () => {
        await expect(locker.position(1)).to.be.revertedWith('position is not exists');
    });

    it("эвент лока", async () => {
        const lockSeconds = 100;
        const positionId = 1;
        const lockCount = 1000;
        await token.mint(lockCount);
        await token.approve(locker.address, lockCount);
        await expect(locker.lockSeconds(token.address, lockCount, lockSeconds))
            .to.emit(locker, "OnLockPosition").withArgs(positionId);
    });

    describe("делаем простой лок", function () {
        const lockSeconds = 100;
        const positionId = 1;
        const lockCount = 1000;
        beforeEach(async () => {
            await token.mint(lockCount);
            await token.approve(locker.address, lockCount);
            await locker.lockSeconds(token.address, lockCount, lockSeconds);
        });

        it("стало позиций 1", async () => {
            expect(await locker.positionsCount()).to.equals(1);
        });

        it("ассет перешел на локер", async () => {
            const lockerBalance = await token.balanceOf(locker.address);
            expect(lockerBalance).to.equals(lockCount);
        });

        it("состояние позиции - не выведено", async () => {
            expect(await locker.withdrawed(positionId)).to.equals(false);
        });

        it("позиция залочена", async () => {
            expect(await locker.isLocked(positionId)).to.equals(true);
        });

        it("лок не перманентный", async () => {
            expect(await locker.isPermanentLock(positionId)).to.equals(false);
        });

        it("во время лока нельзя вывести", async () => {
            await expect(locker.withdraw(positionId)).to.be.revertedWith('still locked');
        });

        it("если выждать время анлока то будет анлок", async () => {
            await helpers.time.increaseTo(await locker.unlockTime(positionId));
            expect(await locker.isLocked(positionId)).to.equals(false);
        });

        describe("ждем анлока", function () {
            beforeEach(async () => {
                await Up(lockSeconds);
            });

            it("позиция разлочена", async () => {
                expect(await locker.isLocked(positionId)).to.equals(false);
            });

            it("вывод ассета работает", async () => {
                await locker.withdraw(positionId);
            });

            describe("вывод ассета", function () {
                beforeEach(async () => {
                    await locker.withdraw(positionId);
                });

                it("ассет списан с локера", async () => {
                    const lockerBalance = await token.balanceOf(locker.address);
                    expect(lockerBalance).to.equals(0);
                });

                it("состояние позиции - выведено", async () => {
                    expect(await locker.withdrawed(positionId)).to.equals(true);
                });

                it("количество выведенного изменилось", async () => {
                    const position = await locker.position(positionId);
                    expect(position.withdrawedCount).to.equals(position.count);
                });

                it("повторное списание невозможно", async () => {
                    await expect(locker.withdraw(positionId))
                        .to.be.revertedWith('already withdrawed');
                });
            });
        });
    });

    describe("делаем пошаговый лок, (за один шаг вывод всего)", function () {
        const lockSeconds = 100;
        const positionId = 1;
        const lockCount = 1000;
        const stepByStepUnlockCount = 1000;
        beforeEach(async () => {
            await token.mint(lockCount);
            await token.approve(locker.address, lockCount);
            await locker.lockStepByStepUnlocking(token.address, lockCount, owner.address, lockSeconds, stepByStepUnlockCount);
        });

        it("стало позиций 1", async () => {
            expect(await locker.positionsCount()).to.equals(1);
        });

        it("ассет перешел на локер", async () => {
            const lockerBalance = await token.balanceOf(locker.address);
            expect(lockerBalance).to.equals(lockCount);
        });

        it("состояние позиции - не выведено", async () => {
            expect(await locker.withdrawed(positionId)).to.equals(false);
        });

        it("позиция залочена", async () => {
            expect(await locker.isLocked(positionId)).to.equals(true);
        });

        it("лок не перманентный", async () => {
            expect(await locker.isPermanentLock(positionId)).to.equals(false);
        });

        it("во время лока нельзя вывести", async () => {
            await expect(locker.withdraw(positionId)).to.be.revertedWith('still locked');
        });

        it("если выждать время анлока то будет анлок", async () => {
            await helpers.time.increaseTo(await locker.unlockTime(positionId));
            expect(await locker.isLocked(positionId)).to.equals(false);
        });

        describe("ждем анлока", function () {
            beforeEach(async () => {
                await Up(lockSeconds);
            });

            it("позиция разлочена", async () => {
                expect(await locker.isLocked(positionId)).to.equals(false);
            });

            it("вывод ассета работает", async () => {
                await locker.withdraw(positionId);
            });

            describe("вывод ассета", function () {
                beforeEach(async () => {
                    await locker.withdraw(positionId);
                });

                it("ассет списан с локера", async () => {
                    const lockerBalance = await token.balanceOf(locker.address);
                    expect(lockerBalance).to.equals(0);
                });

                it("состояние позиции - выведено", async () => {
                    expect(await locker.withdrawed(positionId)).to.equals(true);
                });

                it("количество выведенного изменилось", async () => {
                    const position = await locker.position(positionId);
                    expect(position.withdrawedCount).to.equals(position.count);
                });

                it("повторное списание невозможно", async () => {
                    await expect(locker.withdraw(positionId))
                        .to.be.revertedWith('already withdrawed');
                });
            });
        });
    });

    describe("делаем пошаговый лок, (частичный вывод)", function () {
        const lockSeconds = 100;
        const positionId = 1;
        const lockCount = 1050;
        const stepByStepUnlockCount = 100;
        beforeEach(async () => {
            await token.mint(lockCount);
            await token.approve(locker.address, lockCount);
            await locker.lockStepByStepUnlocking(token.address, lockCount, owner.address, lockSeconds, stepByStepUnlockCount);
        });

        it("стало позиций 1", async () => {
            expect(await locker.positionsCount()).to.equals(1);
        });

        it("ассет перешел на локер", async () => {
            const lockerBalance = await token.balanceOf(locker.address);
            expect(lockerBalance).to.equals(lockCount);
        });

        it("состояние позиции - не выведено", async () => {
            expect(await locker.withdrawed(positionId)).to.equals(false);
        });

        it("позиция залочена", async () => {
            expect(await locker.isLocked(positionId)).to.equals(true);
        });

        it("лок не перманентный", async () => {
            expect(await locker.isPermanentLock(positionId)).to.equals(false);
        });

        it("во время лока нельзя вывести", async () => {
            await expect(locker.withdraw(positionId)).to.be.revertedWith('still locked');
        });

        it("если выждать время анлока то будет анлок", async () => {
            await helpers.time.increaseTo(await locker.unlockTime(positionId));
            expect(await locker.isLocked(positionId)).to.equals(false);
        });

        it("вывод всего по частям", async () => {
            var count = 0;
            while (await locker.withdrawed(positionId) == false) {
                ++count;
                await helpers.time.increaseTo(await locker.unlockTime(positionId));
                await locker.withdraw(positionId);
            }

            expect(count).to.equals(11);
            const position = await locker.position(positionId);
            expect(position.withdrawedCount).to.equals(lockCount);
            expect(await token.balanceOf(locker.address)).to.equals(0);
        });

        describe("ждем 1 анлока", function () {
            beforeEach(async () => {
                await helpers.time.increaseTo(await locker.unlockTime(positionId));
            });

            it("позиция разлочена", async () => {
                expect(await locker.isLocked(positionId)).to.equals(false);
            });

            it("вывод ассета работает", async () => {
                await locker.withdraw(positionId);
            });

            describe("вывод ассета", function () {
                beforeEach(async () => {
                    await locker.withdraw(positionId);
                });

                it("ассет списан с локера", async () => {
                    const lockerBalance = await token.balanceOf(locker.address);
                    expect(lockerBalance).to.equals(lockCount - stepByStepUnlockCount);
                });

                it("состояние позиции - все еще не выведено", async () => {
                    expect(await locker.withdrawed(positionId)).to.equals(false);
                });

                it("количество выведенного изменилось", async () => {
                    const position = await locker.position(positionId);
                    expect(position.withdrawedCount).to.equals(stepByStepUnlockCount);
                });

                it("повторное списание невозможно в данном интервале тк состояние стало все еще залочено", async () => {
                    await expect(locker.withdraw(positionId))
                        .to.be.revertedWith('still locked');
                });
            });
        });
    });
});