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
    let locker;
    const LOCK_PRECISION = 10000;

    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        locker = await (await ethers.getContractFactory("Erc20Locker")).deploy(feeSettings.address);
        erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).deploy(feeSettings.address, locker.address);
    });
    describe("создание позиции с локом после покупки (лок частичный)", function () {
        var token1;
        var token2;
        var positionId;
        var position;
        const token1Count = 1000;
        const positionFlags = 4;
        const priceNom = 2;
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const packetClaimTime = 123;
        const lockSettings = [LOCK_PRECISION / 5, packetClaimTime, LOCK_PRECISION / 10];

        beforeEach(async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, positionFlags, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1, owner.address, token1.address, token2.address, priceNom, pricceDenom);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);
        });
        it("получаем опции лока для позиции", async () => {
            const lockSettingsResponce = await erc20Sale.getPositionLockSettings(positionId);
            expect(lockSettingsResponce.receivePercent).to.eq(lockSettings[0]);
            expect(lockSettingsResponce.lockTime).to.eq(lockSettings[1]);
            expect(lockSettingsResponce.unlockPercentByTime).to.eq(lockSettings[2]);
        });
        it("токены овнера переведены на контракт, после создания позиции", async () => {
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(1000);
            expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
        });
        it("проверка создания позиции", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(1000);
            expect(position.count2).to.eq(0);
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token1.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(1000);
        });
        it("токенов 1 есть только на контракте с позицией", async () => {
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(token1Count);
            expect(await token1.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(acc2.address)).to.eq(0);
        });
        it("овнер выводит ассет1", async () => {
            await erc20Sale.withdraw(positionId, 1, owner.address, 1000);

            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(0);
            expect(position.count2).to.eq(0);
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token1.balanceOf(owner.address)).to.eq(1000);
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(0);
            expect(await token1.balanceOf(acc2.address)).to.eq(0);

            expect(await token2.balanceOf(owner.address)).to.eq(0);
            expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
            expect(await token2.balanceOf(acc2.address)).to.eq(0);
        });
        it("пополнение баланса ассет1", async () => {
            await token1.mint(1000);
            await token1.approve(erc20Sale.address, 1000);
            await erc20Sale.addBalance(positionId, 1000);

            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(2000); // added balance
            expect(position.count2).to.eq(0);
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token1.balanceOf(owner.address)).to.eq(0);
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(2000);
        });
        it("защита от фронтрана при покупке", async () => {
            await token2.connect(acc2).mint(1000);
            await token2.connect(acc2).approve(erc20Sale.address, 1000);
            await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, 100, 1, 1, acc2.address))
                .to.be.revertedWith('the price is changed');
        });
        it("смена цены", async () => {
            await erc20Sale.setPrice(positionId, 4, 5);
            var position = await erc20Sale.getPosition(positionId);
            expect(position.priceNom).to.eq(4);
            expect(position.priceDenom).to.eq(5);
        });
        it("инкремент id", async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(3 * token1Count);
            await token1.approve(erc20Sale.address, 3 * token1Count);

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, positionFlags, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(2, owner.address, token1.address, token2.address, priceNom, pricceDenom);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, positionFlags, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(3, owner.address, token1.address, token2.address, priceNom, pricceDenom);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, positionFlags, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(4, owner.address, token1.address, token2.address, priceNom, pricceDenom);
        });
        it("закуп создает лок, который можно забрать по прошествии указанного времни, при создании позиции", async () => {
            const buyCount = 100;
            const lockPositionId = 1;
            await token2.connect(acc2).mint(1000);
            await token2.connect(acc2).approve(erc20Sale.address, 1000);
            var timeToClaim = (await ethers.provider.getBlock()).timestamp + packetClaimTime + 1;
            /*await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, buyCount, position.priceNom, position.priceDenom, acc2.address))
                .to.emit(packet, 'OnAddStack')
                .withArgs(acc2.address, token1.address, buyCount, timeToClaim);*/
            await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, buyCount, position.priceNom, position.priceDenom, acc2.address))
                .to.emit(locker, 'OnLockPosition')
                .withArgs(lockPositionId);
        });
        describe("покупка 100 штук", function () {
            const buyCount = 100;
            beforeEach(async () => {
                await token2.connect(acc2).mint(1000);
                await token2.connect(acc2).approve(erc20Sale.address, 1000);
                await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, buyCount, position.priceNom, position.priceDenom, acc2.address))
                    .to.emit(erc20Sale, 'OnBuy')
                    .withArgs(positionId, acc2.address, buyCount);
            });
            it("тот, кто купил не получает токен", async () => {
                expect(await token1.balanceOf(acc2.address)).to.eq(20);
            });
            it("тот, кто купил - получает токен в лок", async () => {
                const lockPositionId = 1;
                const lockPosition = await locker.position(lockPositionId);
                expect(lockPosition.count).to.eq(80);
            });
            it("проверка лока", async () => {
                const lockPositionId = 1;
                const lockPosition = await locker.position(lockPositionId);
                expect(lockPosition.token).to.eq(token1.address);
                expect(lockPosition.withdrawer).to.eq(acc2.address);
                expect(lockPosition.timeInterval).to.eq(packetClaimTime);
                expect(lockPosition.withdrawedCount).to.eq(0);
                expect(lockPosition.count).to.eq(80);
                expect(lockPosition.stepByStepUnlockCount).to.eq(8);
            });
            it("проверка покупки", async () => {
                var position = await erc20Sale.getPosition(positionId);
                expect(position.owner).to.eq(owner.address);
                expect(position.asset1).to.eq(token1.address);
                expect(position.asset2).to.eq(token2.address);
                expect(position.count1).to.eq(900);
                expect(position.count2).to.eq(200);
                expect(position.priceNom).to.eq(2);
                expect(position.priceDenom).to.eq(1);

                expect(await token1.balanceOf(owner.address)).to.eq(0);
                expect(await token1.balanceOf(erc20Sale.address)).to.eq(900);
                expect(await token1.balanceOf(acc2.address)).to.eq(20);

                expect(await token2.balanceOf(owner.address)).to.eq(0);
                expect(await token2.balanceOf(erc20Sale.address)).to.eq(200);
                expect(await token2.balanceOf(acc2.address)).to.eq(800);
            });

            it("овнер выводит ассет2 после покупки", async () => {
                await erc20Sale.withdraw(positionId, 2, owner.address, 200);

                var position = await erc20Sale.getPosition(positionId);
                expect(position.owner).to.eq(owner.address);
                expect(position.asset1).to.eq(token1.address);
                expect(position.asset2).to.eq(token2.address);
                expect(position.count1).to.eq(900);
                expect(position.count2).to.eq(0);
                expect(position.priceNom).to.eq(2);
                expect(position.priceDenom).to.eq(1);

                expect(await token2.balanceOf(owner.address)).to.eq(200);
                expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
            });
        });
        describe("создаем офер", function () {
            const token1OfferCount = 1000;
            const token2OfferCount = 100;
            beforeEach(async () => {
                await token2.connect(acc2).mint(token2OfferCount);
                await token2.connect(acc2).approve(erc20Sale.address, token2OfferCount);
                await expect(erc20Sale.connect(acc2).createOffer(1, token1OfferCount, token2OfferCount))
                    .to.emit(erc20Sale, 'OnOfer')
                    .withArgs(positionId, 1);
            });
            it("токенов 2 есть только на контракте", async () => {
                expect(await token2.balanceOf(erc20Sale.address)).to.eq(token2OfferCount);
                expect(await token2.balanceOf(owner.address)).to.eq(0);
                expect(await token2.balanceOf(acc2.address)).to.eq(0);
            });
            it("токены офера переведены на контракт, после создания офера", async () => {
                expect(await token2.balanceOf(erc20Sale.address)).to.eq(100);
            });
            describe("овнер принял офер", function () {
                beforeEach(async () => {
                    await expect(erc20Sale.applyOffer(1))
                        .to.emit(erc20Sale, 'OnApplyOfer')
                        .withArgs(positionId, 1);
                });
                it("токены овнера отправились предлагавшей стороне, предложеное так и остается", async () => {
                    expect(await token1.balanceOf(erc20Sale.address)).to.eq(0);
                    expect(await token1.balanceOf(acc2.address)).to.eq(token1OfferCount);
                });
                it("токены предлагавшей стороны все еще лежат на контракте торговли, до востребования", async () => {
                    expect(await token2.balanceOf(erc20Sale.address)).to.eq(token2OfferCount);
                });
                it("токены предлагавшей стороны попали в каунт позиции", async () => {
                    expect((await erc20Sale.getPosition(1)).count2).to.eq(token2OfferCount);
                });
                it("овнер забрал то, на что согласися", async () => {
                    await erc20Sale.withdraw(1, 2, owner.address, token2OfferCount);
                    expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
                    expect(await token2.balanceOf(owner.address)).to.eq(token2OfferCount);
                });
                it("овнер забрал весь ассет", async () => {
                    await erc20Sale.withdrawAll(1, 2);
                    expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
                    expect(await token2.balanceOf(owner.address)).to.eq(100);
                });
                it("овнер забрал весь ассет себе", async () => {
                    await erc20Sale.withdrawAllTo(1, 2, owner.address);
                    expect(await token2.balanceOf(erc20Sale.address)).to.eq(0);
                    expect(await token2.balanceOf(owner.address)).to.eq(100);
                });
                it("ESS-1 (овнер одобрил офер и вывел все) bug", async () => {
                    // переводим на контракт токены (будто такие токены еще есть в других позициях)
                    await token1.mintTo(erc20Sale.address, 1000);
                    await expect(erc20Sale.withdraw(1, 1, owner.address, 1000))
                        .to.be.revertedWith('not enough asset count');
                });
            });
        });
    });
});
