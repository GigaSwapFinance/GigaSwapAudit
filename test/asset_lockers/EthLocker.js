const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { Up, Days } = require("../Helpers/TimeHelper");

describe("EthLocker", function () {
    let owner;
    let acc1;
    let acc2;
    let addrs;

    let giga;
    let feeSettings;
    let locker;

    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();

        // гигасвап токен
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        // настройки налога
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        // локер
        locker = await (await ethers.getContractFactory("EthLocker")).deploy(feeSettings.address);
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
        const lockCount = ethers.utils.parseEther("1.0");
        await expect(locker.lockSeconds(lockSeconds, { value: lockCount }))
            .to.emit(locker, "OnLockPosition").withArgs(positionId);
    });

    describe("делаем лок", function () {
        const lockSeconds = 100;
        const positionId = 1;
        const lockCount = ethers.utils.parseEther("1.0");
        beforeEach(async () => {
            await locker.lockSeconds(lockSeconds, { value: lockCount });
        });

        it("стало позиций 1", async () => {
            expect(await locker.positionsCount()).to.equals(1);
        });

        it("ассет перешел на локер", async () => {
            const lockerBalance = await ethers.provider.getBalance(locker.address);
            expect(lockerBalance).to.equals(lockCount);
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
                    const lockerBalance = await ethers.provider.getBalance(locker.address);
                    expect(lockerBalance).to.equals(0);
                });

                it("позиция изменила состояние в выведено", async () => {
                    const position = await locker.position(positionId);
                    expect(position.withdrawed).to.equals(true);
                });

                it("повторное списание невозможно", async () => {
                    await expect(locker.withdraw(positionId))
                        .to.be.revertedWith('already withdrawed');
                });
            });
        });
    });
});