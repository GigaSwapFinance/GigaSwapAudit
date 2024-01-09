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
        //packet = await (await ethers.getContractFactory("PacketErc20")).deploy();
        locker = await (await ethers.getContractFactory("Erc20Locker")).deploy(feeSettings.address);
        //erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).deploy(feeSettings.address, packet.address);
        erc20Sale = await (await ethers.getContractFactory("Erc20Sale")).deploy(feeSettings.address, locker.address);
    });
    describe("создание позиции", function () {
        var token1;
        var token2;
        var positionId;
        var position;
        const token1Count = 1000;
        const priceNom = 2;
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const lockSettings = [0, 0, 0];

        beforeEach(async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom,
                token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);
        });
        it("проверка флагов", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.flags).to.eq(0);
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

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(2);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(3);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(4);
        });
        describe("покупка 100 штук", function () {
            beforeEach(async () => {
                await token2.connect(acc2).mint(1000);
                await token2.connect(acc2).approve(erc20Sale.address, 1000);
                await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, 100, position.priceNom, position.priceDenom, acc2.address))
                    .to.emit(erc20Sale, 'OnBuy')
                    .withArgs(positionId, acc2.address, 100);
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
                expect(await token1.balanceOf(acc2.address)).to.eq(100);

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
    describe("создание позиции с локом после покупки", function () {
        var token1;
        var token2;
        var positionId;
        var position;
        const token1Count = 1000;
        const priceNom = 2;
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const packetClaimTime = 123;
        const lockSettings = [0, packetClaimTime, LOCK_PRECISION];

        beforeEach(async () => {
            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);
        });
        it("проверка флагов", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.flags).to.eq(4);
        });
        it("получаем опции лока для позиции", async () => {
            const lockSettingsResponse = await erc20Sale.getPositionLockSettings(positionId);
            expect(lockSettingsResponse.receivePercent).to.eq(lockSettings[0]);
            expect(lockSettingsResponse.lockTime).to.eq(lockSettings[1]);
            expect(lockSettingsResponse.unlockPercentByTime).to.eq(lockSettings[2]);
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

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(2);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(3);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom, token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate').withArgs(4);
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
                expect(await token1.balanceOf(acc2.address)).to.eq(0);
            });
            it("тот, кто купил - получает токен в лок", async () => {
                //expect(await packet.balance(acc2.address, token1.address)).to.eq(buyCount);
                const lockPositionId = 1;
                const lockPosition = await locker.position(lockPositionId);
                expect(lockPosition.count).to.eq(buyCount);
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
                expect(await token1.balanceOf(acc2.address)).to.eq(0);

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
                it("токены овнера отправились на лок", async () => {
                    expect(await token1.balanceOf(erc20Sale.address)).to.eq(0);
                    expect(await token1.balanceOf(acc2.address)).to.eq(0);
                    expect(await token1.balanceOf(locker.address)).to.eq(token1OfferCount);
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

    describe("покупка 100000 штук (если платим полный налог)", function () {
        const buyCount = 100000;
        var token1;
        var token2;
        var positionId;
        var position;
        const token1Count = buyCount;
        const priceNom = 2;
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const lockSettings = [0, 0, 0];

        beforeEach(async () => {
            await giga.connect(addrs[3]).mint(100);

            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);

            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom,
                token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);

            await token2.connect(acc2).mint(buyCount * 2);
            await token2.connect(acc2).approve(erc20Sale.address, buyCount * 2);
            await expect(erc20Sale.connect(acc2).buy(positionId, acc2.address, buyCount, position.priceNom, position.priceDenom, acc2.address))
                .to.emit(erc20Sale, 'OnBuy')
                .withArgs(positionId, acc2.address, buyCount);
        });
        it("проверка процента налога", async () => {
            const tokensCount = 100000;
            const tokensFee = 300;
            expect(await feeSettings.feeForCount(owner.address, tokensCount)).to.eq(tokensFee);
        });
        it("проверка покупки", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(0);
            expect(position.count2).to.eq(199400); // with fee
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token1.balanceOf(owner.address)).to.eq(300); // fee
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(0);
            expect(await token1.balanceOf(acc2.address)).to.eq(99700);

            expect(await token2.balanceOf(owner.address)).to.eq(600); // fee
            expect(await token2.balanceOf(erc20Sale.address)).to.eq(199400); // with fee
            expect(await token2.balanceOf(acc2.address)).to.eq(0);
        });
        it("овнер выводит ассет2 после покупки", async () => {
            // вывод
            await erc20Sale.withdraw(positionId, 2, owner.address, 200);

            // проверка
            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(0);
            expect(position.count2).to.eq(199200);
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token2.balanceOf(owner.address)).to.eq(800);
            expect(await token2.balanceOf(erc20Sale.address)).to.eq(199200);
        });
    });
    describe("покупка 100000 штук (если платим полный налог) через офер", function () {
        const buyCount = 100000;
        var token1;
        var token2;
        var positionId;
        var position;
        const token1Count = buyCount;
        const priceNom = 2;
        const pricceDenom = 1;
        const buyLimit = 0;
        const whiteList = [];
        const lockSettings = [0, 0, 0];
        const token1OfferCount = buyCount;
        const token2OfferCount = buyCount;

        beforeEach(async () => {
            await giga.connect(addrs[3]).mint(100);

            token1 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(18);
            token2 = await (await ethers.getContractFactory("Erc20TestToken")).deploy(6);

            // создаем позицию
            await token1.mint(token1Count);
            await token1.approve(erc20Sale.address, token1Count);
            await expect(erc20Sale.createPosition(token1.address, token2.address, priceNom, pricceDenom,
                token1Count, buyLimit, whiteList, lockSettings))
                .to.emit(erc20Sale, 'OnCreate')
                .withArgs(1);
            positionId = 1;
            position = await erc20Sale.getPosition(positionId);

            // создаем офер
            await token2.connect(acc2).mint(token2OfferCount);
            await token2.connect(acc2).approve(erc20Sale.address, token2OfferCount);
            await expect(erc20Sale.connect(acc2).createOffer(1, token1OfferCount, token2OfferCount))
                .to.emit(erc20Sale, 'OnOfer')
                .withArgs(positionId, 1);

            // принимаем офер
            await expect(erc20Sale.applyOffer(1))
                .to.emit(erc20Sale, 'OnApplyOfer')
                .withArgs(positionId, 1);
        });
        it("проверка процента налога", async () => {
            const tokensCount = 100000;
            const tokensFee = 300;
            expect(await feeSettings.feeForCount(owner.address, tokensCount)).to.eq(tokensFee);
        });
        it("проверка покупки", async () => {
            var position = await erc20Sale.getPosition(positionId);
            expect(position.owner).to.eq(owner.address);
            expect(position.asset1).to.eq(token1.address);
            expect(position.asset2).to.eq(token2.address);
            expect(position.count1).to.eq(0);
            expect(position.count2).to.eq(99700); // with fee
            expect(position.priceNom).to.eq(2);
            expect(position.priceDenom).to.eq(1);

            expect(await token1.balanceOf(owner.address)).to.eq(300); // fee
            expect(await token1.balanceOf(erc20Sale.address)).to.eq(0);
            expect(await token1.balanceOf(acc2.address)).to.eq(99700);

            expect(await token2.balanceOf(owner.address)).to.eq(300); // fee
            expect(await token2.balanceOf(erc20Sale.address)).to.eq(99700); // with fee
            expect(await token2.balanceOf(acc2.address)).to.eq(0);
        });
    });
});
