const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { Up, Days } = require("./Helpers/TimeHelper");

describe("swapper:", function () {
    let dealsController;
    let erc20Token;
    let owner;
    let acc1;
    let acc2;
    let addrs;
    let feeSettings;
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    let erc20PointsController;
    let erc721ItemPointsController;
    let erc721CountPointsController;
    let etherPointsController;
    let dealsFactory;
    let dealId;
    let giga;

    beforeEach(async () => {
        [owner, acc1, acc2, ...addrs] = await ethers.getSigners();

        // гигасвап токен
        giga = await (await ethers.getContractFactory("Erc20TestToken")).deploy(9);
        // настройки налога
        feeSettings = await (await ethers.getContractFactory("FeeSettings")).deploy(giga.address);
        // свапер
        dealsController = await (await ethers.getContractFactory("GigaSwap")).deploy(feeSettings.address);
        // контроллер эфировых позиций
        etherPointsController = await (await ethers.getContractFactory("EtherDealPointsController")).deploy(dealsController.address);
        // контроллер позиций erc20
        erc20PointsController = await (await ethers.getContractFactory("Erc20DealPointsController")).deploy(dealsController.address);
        // контроллер позиций erc721 итемов
        erc721ItemPointsController = await (await ethers.getContractFactory("Erc721ItemDealPointsController")).deploy(dealsController.address);
        // контроллер позиций erc721 количества
        erc721CountPointsController = await (await ethers.getContractFactory("Erc721CountDealPointsController")).deploy(dealsController.address);

        // фабрика сделок
        dealsFactory = await (await ethers.getContractFactory("DealsFactory")).deploy(
            dealsController.address,
            etherPointsController.address,
            erc20PointsController.address,
            erc721ItemPointsController.address,
            erc721CountPointsController.address);

        // регистрируем фабрику позиций в свапере
        dealsController.setFactories([
            dealsFactory.address,
            erc20PointsController.address,
            erc721ItemPointsController.address,
            etherPointsController.address], true);

        // тестовый erc20
        erc20Token = await (await ethers.getContractFactory("Erc20TestToken")).deploy(2);
    });
    it("проверка наличия фабрики", async () => {
        expect(await dealsController.isFactory(erc20PointsController.address)).to.equals(true);
    });
    it("проверка изначального состояния", async () => {
        expect(await dealsController.getTotalDealPointsCount()).to.eq(0);
    });
    it("создавать пункты может только фабрика", async () => {
        await expect(dealsController.createDeal(acc1.address, acc2.address))
            .to.be.revertedWith('only for factories');
        await expect(erc20PointsController.createPoint(
            1, erc20Token.address, owner.address, acc2.address, 100, 0))
            .to.be.revertedWith('only factory can call this function');
        // делаем акк фабрикой
        await dealsController.setFactories([owner.address], true);
        // после чего можно создавать
        await dealsController.createDeal(acc1.address, acc2.address);
        await erc20PointsController.createPoint(
            1, erc20Token.address, owner.address, acc2.address, 100, 0);
    });
    it("проводим закрытую сделку", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;
        await expect(dealsFactory.connect(acc1).createDeal([acc2.address,
        [[acc2.address, acc1.address, etherCount, withdrawTimer]],
        [[acc1.address, acc2.address, erc20Token.address, erc20Count, withdrawTimer]],
        [],
        []]))
            .to.emit(dealsController, 'NewDeal')
            .withArgs(1, acc1.address);

        // id сделки
        var dealId = 1;

        // получаем сделку
        var deal = await dealsController.getDeal(dealId);
        expect(deal[0].state).to.eq(2); // состояние сделки - выполняется
        expect(deal[0].pointsCount).to.eq(2);
        expect(deal[1][0].controller).to.eq(etherPointsController.address);
        expect(deal[1][1].controller).to.eq(erc20PointsController.address);
        expect(deal[1][0].id).to.eq(1);
        expect(deal[1][1].id).to.eq(2);

        pointsController0 = await ethers.getContractAt("IDealPointsController", deal[1][0].controller);
        pointsController1 = await ethers.getContractAt("IDealPointsController", deal[1][1].controller);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
        expect(await dealsController.isExecuted(dealId)).to.eq(false);
        expect(await dealsController.executeEtherValue(dealId, 1)).to.eq(0);
        expect(await dealsController.executeEtherValue(dealId, 2)).to.eq(etherCount);

        // выполняем сделку
        // 1 акк
        await erc20Token.mintTo(acc1.address, erc20Count);
        await erc20Token.connect(acc1).approve(deal[1][1].controller, erc20Count);
        await expect(dealsController.connect(acc1).execute(dealId))
            .to.emit(dealsController, 'Execute').withArgs(dealId, acc1.address, true);
        expect(await erc20Token.balanceOf(pointsController1.address)).to.eq(erc20Count);
        expect(await pointsController1.balance(deal[1][1].id)).to.eq(erc20Count);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
        expect(await dealsController.isExecuted(dealId)).to.eq(false);
        expect(await pointsController0.from(deal[1][0].id)).to.eq(acc2.address);
        expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);
        expect(await pointsController1.from(deal[1][1].id)).to.eq(acc1.address);
        expect(await pointsController1.to(deal[1][1].id)).to.eq(acc2.address);
        // 2 акк
        await expect(dealsController.connect(acc2).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 2) }))
            .to.emit(dealsController, 'Execute').withArgs(dealId, acc2.address, true);
        expect(Number(await ethers.provider.getBalance(pointsController0.address)))
            .to.eq(Number(etherCount));
        expect(Number(await pointsController0.balance(deal[1][0].id))).to.eq(Number(etherCount));
        expect(await erc20Token.balanceOf(acc2.address)).to.eq(0);
        expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
            .to.eq(100);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(true);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
        expect(await dealsController.isExecuted(dealId)).to.eq(true);
        expect(await pointsController0.from(deal[1][0].id)).to.eq(acc2.address);
        expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);

        // свапаем сделку
        expect(await dealsController.isSwapped(dealId)).to.eq(false);
        await expect(dealsController.swap(dealId))
            .to.emit(dealsController, 'Swap').withArgs(dealId);
        expect(await dealsController.isSwapped(dealId)).to.eq(true);

        // выводим ассеты
        // 1 акк выводит эфир
        lastBalance = await ethers.provider.getBalance(acc1.address);
        await dealsController.connect(acc1).withdraw(dealId);
        expect(Number(await ethers.provider.getBalance(acc1.address)))
            .to.be.greaterThan(Number(lastBalance));
        expect(await pointsController0.balance(deal[1][0].id)).to.eq(0);
        // 2 акк выводит токен
        await dealsController.connect(acc2).withdraw(dealId);
        expect(await erc20Token.balanceOf(acc2.address)).to.eq(erc20Count);
        expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
            .to.eq(0);
        expect(await pointsController1.balance(deal[1][1].id)).to.eq(0);
    });
    it("проводим открытую сделку", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;
        await expect(dealsFactory.connect(acc1).createDeal([zeroAddress,
            [[zeroAddress, acc1.address, etherCount, withdrawTimer]],
            [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer]],
            [],
            []]))
            .to.emit(dealsController, 'NewDeal')
            .withArgs(1, acc1.address);

        // id сделки
        var dealId = 1;

        // получаем сделку
        var deal = await dealsController.getDeal(dealId);
        expect(deal[0].owner1).to.eq(acc1.address);
        expect(deal[0].owner2).to.eq(zeroAddress);
        expect(deal[0].state).to.eq(2); // состояние сделки - выполняется
        expect(deal[0].pointsCount).to.eq(2);
        expect(deal[1][0].controller).to.eq(etherPointsController.address);
        expect(deal[1][1].controller).to.eq(erc20PointsController.address);
        expect(deal[1][0].id).to.eq(1);
        expect(deal[1][1].id).to.eq(2);

        pointsController0 = await ethers.getContractAt("IDealPointsController", deal[1][0].controller);
        pointsController1 = await ethers.getContractAt("IDealPointsController", deal[1][1].controller);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
        expect(await dealsController.isExecuted(dealId)).to.eq(false);

        // выполняем сделку
        // 1 акк
        await erc20Token.mintTo(acc1.address, erc20Count);
        await erc20Token.connect(acc1).approve(deal[1][1].controller, erc20Count);
        await expect(dealsController.connect(acc1).execute(dealId))
            .to.emit(dealsController, 'Execute').withArgs(dealId, acc1.address, true);
        expect(await erc20Token.balanceOf(pointsController1.address)).to.eq(erc20Count);
        expect(await pointsController1.balance(deal[1][1].id)).to.eq(erc20Count);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
        expect(await dealsController.isExecuted(dealId)).to.eq(false);
        expect(await pointsController0.from(deal[1][0].id)).to.eq(zeroAddress);
        expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);
        expect(await pointsController1.from(deal[1][1].id)).to.eq(acc1.address);
        expect(await pointsController1.to(deal[1][1].id)).to.eq(zeroAddress);
        // 2 акк
        await expect(dealsController.connect(acc2).execute(dealId, { value: etherCount }))
            .to.emit(dealsController, 'Execute').withArgs(dealId, acc2.address, true);
        expect(Number(await ethers.provider.getBalance(pointsController0.address)))
            .to.eq(Number(etherCount));
        expect(Number(await pointsController0.balance(deal[1][0].id))).to.eq(Number(etherCount));
        expect(await erc20Token.balanceOf(acc2.address)).to.eq(0);
        expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
            .to.eq(100);
        expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(true);
        expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
        expect(await dealsController.isExecuted(dealId)).to.eq(true);
        expect(await pointsController0.from(deal[1][0].id)).to.eq(acc2.address);
        expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);
        expect(await pointsController1.from(deal[1][1].id)).to.eq(acc1.address);
        expect(await pointsController1.to(deal[1][1].id)).to.eq(acc2.address);

        // свапаем сделку
        expect(await dealsController.isSwapped(dealId)).to.eq(false);
        await expect(dealsController.swap(dealId))
            .to.emit(dealsController, 'Swap').withArgs(dealId);
        expect(await dealsController.isSwapped(dealId)).to.eq(true);

        // выводим ассеты
        // 1 акк выводит эфир
        lastBalance = await ethers.provider.getBalance(acc1.address);
        await dealsController.connect(acc1).withdraw(dealId);
        expect(Number(await ethers.provider.getBalance(acc1.address)))
            .to.be.greaterThan(Number(lastBalance));
        expect(await pointsController0.balance(deal[1][0].id)).to.eq(0);
        // 2 акк выводит токен
        await dealsController.connect(acc2).withdraw(dealId);
        expect(await erc20Token.balanceOf(acc2.address)).to.eq(100);
        expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
            .to.eq(0);
        expect(await pointsController1.balance(deal[1][1].id)).to.eq(0);
    });
    it("проверка чтения сделки", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer1 = 123;
        const withdrawTimer2 = 456;
        await dealsFactory.connect(acc1).createDeal([zeroAddress,
            [[zeroAddress, acc1.address, etherCount, withdrawTimer1]],
            [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer2]],
            [],
            []]);

        // id сделки
        var dealId = 1;

        // получаем сделку
        var deal = await dealsController.getDeal(dealId);
        // данные сделки
        expect(deal[0].owner1).to.eq(acc1.address);
        expect(deal[0].owner2).to.eq(zeroAddress);
        expect(deal[0].state).to.eq(2); // состояние сделки - выполняется
        expect(deal[0].pointsCount).to.eq(2);
        // данные позиций сделки
        // controller
        expect(deal[1][0].controller).to.eq(etherPointsController.address);
        expect(deal[1][1].controller).to.eq(erc20PointsController.address);
        // id
        expect(deal[1][0].id).to.eq(1);
        expect(deal[1][1].id).to.eq(2);
        // dealPointTypeId
        expect(deal[1][0].dealPointTypeId).to.eq(1);
        expect(deal[1][1].dealPointTypeId).to.eq(2);
        // dealId
        expect(deal[1][0].dealId).to.eq(1);
        expect(deal[1][1].dealId).to.eq(1);
        // from
        expect(deal[1][0].from).to.eq(zeroAddress);
        expect(deal[1][1].from).to.eq(acc1.address);
        // to
        expect(deal[1][0].to).to.eq(acc1.address);
        expect(deal[1][1].to).to.eq(zeroAddress);
        // withdrawTimer
        expect(deal[1][0].withdrawTimer).to.eq(withdrawTimer1);
        expect(deal[1][1].withdrawTimer).to.eq(withdrawTimer2);
        // owner
        expect(deal[1][0].owner).to.eq(zeroAddress);
        expect(deal[1][1].owner).to.eq(acc1.address);
        // value (count)
        expect(deal[1][0].value).to.eq(etherCount);
        expect(deal[1][1].value).to.eq(100);
        // balance
        expect(deal[1][0].balance).to.eq(0);
        expect(deal[1][1].balance).to.eq(0);
        // fee
        expect(deal[1][0].fee).to.eq(0);
        expect(deal[1][1].fee).to.eq(0);
        // tokenAddress
        expect(deal[1][0].tokenAddress).to.eq(zeroAddress);
        expect(deal[1][1].tokenAddress).to.eq(erc20Token.address);
        // isSwapped
        expect(deal[1][0].isSwapped).to.eq(false);
        expect(deal[1][1].isSwapped).to.eq(false);
        // isExecuted
        expect(deal[1][0].isExecuted).to.eq(false);
        expect(deal[1][1].isExecuted).to.eq(false);

        // выполняем сделку
        // 1 акк
        await erc20Token.mintTo(acc1.address, erc20Count);
        await erc20Token.connect(acc1).approve(deal[1][1].controller, erc20Count);
        await dealsController.connect(acc1).execute(dealId);
        // isExecuted
        deal = await dealsController.getDeal(dealId);
        expect(deal[1][0].isExecuted).to.eq(false);
        expect(deal[1][1].isExecuted).to.eq(true);
        // balance
        expect(deal[1][0].balance).to.eq(0);
        expect(deal[1][1].balance).to.eq(erc20Count);
        // 2 акк
        await dealsController.connect(acc2).execute(dealId, { value: etherCount });
        // isExecuted
        deal = await dealsController.getDeal(dealId);
        expect(deal[1][0].isExecuted).to.eq(true);
        expect(deal[1][1].isExecuted).to.eq(true);
        // balance
        expect(deal[1][0].balance).to.eq(etherCount);
        expect(deal[1][1].balance).to.eq(erc20Count);

        // свапаем сделку
        await dealsController.swap(dealId);
        // isSwapped
        deal = await dealsController.getDeal(dealId);
        expect(deal[1][0].isSwapped).to.eq(true);
        expect(deal[1][1].isSwapped).to.eq(true);
        // owner
        expect(deal[1][0].owner).to.eq(acc1.address);
        expect(deal[1][1].owner).to.eq(acc2.address);
    });
    it("bug 1", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;

        // deal members
        alice = acc1;
        bob = acc2;

        // create the deal
        await dealsFactory.connect(alice).createDeal([bob.address,
        [[bob.address, alice.address, etherCount, withdrawTimer]],
        [[alice.address, bob.address, erc20Token.address, erc20Count, withdrawTimer]],
        [],
        []]);

        // deal id
        var dealId = 1;

        // get deal
        var deal = await dealsController.getDeal(dealId);

        // execute the deal
        // alice
        await erc20Token.mintTo(alice.address, erc20Count);
        await erc20Token.connect(alice).approve(deal[1][1].controller, erc20Count);
        await expect(dealsController.connect(alice).execute(dealId))
            .to.emit(dealsController, 'Execute').withArgs(dealId, alice.address, true);
        // bob
        await expect(dealsController.connect(bob).execute(dealId, { value: etherCount }))
            .to.emit(dealsController, 'Execute').withArgs(dealId, bob.address, true);

        // bob withdraw
        dealsController.connect(bob).withdraw(dealId);

        // bob swaps the deal
        await expect(dealsController.connect(bob).swap(dealId))
            .to.be.revertedWith('there are not executed deal points');
    });
    it("increment deal id", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;

        await expect(dealsFactory.connect(acc1).createDeal([zeroAddress,
            [[zeroAddress, acc1.address, etherCount, withdrawTimer]],
            [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer]],
            [],
            []]))
            .to.emit(dealsController, 'NewDeal')
            .withArgs(1, acc1.address);
        await expect(dealsFactory.connect(acc1).createDeal([zeroAddress,
            [[zeroAddress, acc1.address, etherCount, withdrawTimer]],
            [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer]],
            [],
            []]))
            .to.emit(dealsController, 'NewDeal')
            .withArgs(2, acc1.address);
    });
    it("addDealPoint - only for factories", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;

        await dealsFactory.connect(acc1).createDeal([zeroAddress,
            [[zeroAddress, acc1.address, etherCount, withdrawTimer]],
            [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer]],
            [],
            []]);
        var dealPointId = 1;
        await expect(dealsController.connect(acc1).addDealPoint(dealPointId, erc20PointsController.address, 1))
            .to.be.revertedWith('only for factories');
    });
    it("свап erc721 и проверка вывода", async () => {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc721TokenId = 1;
        const withdrawTimer = 0;

        var erc721 = await (await ethers.getContractFactory("Erc721TestToken")).deploy();
        await erc721.connect(acc1).mint(erc721TokenId, acc1.address);

        var deal;
        var pointsController0;
        var pointsController1;
        await dealsFactory.connect(acc1).createDeal([acc2.address,
        [[acc2.address, acc1.address, etherCount, withdrawTimer]],
        [],
        [[acc1.address, acc2.address, erc721.address, erc721TokenId, withdrawTimer]],
        []]);
        dealId = 1;
        deal = await dealsController.getDeal(dealId);

        // выполняем 1 акк
        await erc721.connect(acc1).approve(deal[1][1].controller, erc721TokenId);
        dealsController.connect(acc1).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 1) });

        // выполняем 2 акк
        await dealsController.connect(acc2).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 2) });

        // свап
        dealsController.swap(dealId);

        // выводим ассеты
        // 1 акк выводит эфир
        lastBalance = await ethers.provider.getBalance(acc1.address);
        await dealsController.connect(acc1).withdraw(dealId);
        expect(Number(await ethers.provider.getBalance(acc1.address)))
            .to.be.greaterThan(Number(lastBalance));
        // 2 акк выводит свое, включая токен и оплату газом
        await dealsController.connect(acc2).withdraw(dealId, { value: await dealsController.feeEthOnWithdraw(dealId, 2) });
        expect(await erc721.ownerOf(erc721TokenId)).to.eq(acc2.address);
    });
    describe("создаем закрытую сделку:", async function () {
        var deal;
        var pointsController0;
        var pointsController1;
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;
        beforeEach(async () => {
            await expect(dealsFactory.connect(acc1).createDeal([acc2.address,
            [[acc2.address, acc1.address, etherCount, withdrawTimer]],
            [[acc1.address, acc2.address, erc20Token.address, erc20Count, withdrawTimer]],
            [],
            []]))
                .to.emit(dealsController, 'NewDeal')
                .withArgs(1, acc1.address);
            dealId = 1;
            deal = await dealsController.getDeal(dealId);

            pointsController0 = await ethers.getContractAt("IDealPointsController", deal[1][0].controller);
            pointsController1 = await ethers.getContractAt("IDealPointsController", deal[1][1].controller);
            expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
            expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
            expect(await dealsController.isExecuted(dealId)).to.eq(false);
        });

        describe("выполняем сделку:", async function () {
            beforeEach(async () => {
                // выполняем сделку
                // 1 акк
                await erc20Token.mintTo(acc1.address, erc20Count);
                await erc20Token.connect(acc1).approve(deal[1][1].controller, erc20Count);
                await expect(dealsController.connect(acc1).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 2) }))
                    .to.emit(dealsController, 'Execute').withArgs(dealId, acc1.address, true);
                expect(await erc20Token.balanceOf(pointsController1.address)).to.eq(erc20Count);
                expect(await pointsController1.balance(deal[1][1].id)).to.eq(erc20Count);
                expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
                expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
                expect(await dealsController.isExecuted(dealId)).to.eq(false);
                expect(await pointsController0.from(deal[1][0].id)).to.eq(acc2.address);
                expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);
                expect(await pointsController1.from(deal[1][1].id)).to.eq(acc1.address);
                expect(await pointsController1.to(deal[1][1].id)).to.eq(acc2.address);
                // 2 акк
                await expect(dealsController.connect(acc2).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 2) }))
                    .to.emit(dealsController, 'Execute').withArgs(dealId, acc2.address, true);
                expect(Number(await ethers.provider.getBalance(pointsController0.address)))
                    .to.eq(Number(etherCount));
                expect(Number(await pointsController0.balance(deal[1][0].id))).to.eq(Number(etherCount));
                expect(await erc20Token.balanceOf(acc2.address)).to.eq(0);
                expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
                    .to.eq(100);
                expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(true);
                expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
                expect(await dealsController.isExecuted(dealId)).to.eq(true);
                expect(await pointsController0.from(deal[1][0].id)).to.eq(acc2.address);
                expect(await pointsController0.to(deal[1][0].id)).to.eq(acc1.address);
            });
            it("вывод средств делает сделку не выполненной", async function () {
                await expect(dealsController.connect(acc1).withdraw(dealId))
                    .to.emit(dealsController, 'Execute')
                    .withArgs(dealId, acc1.address, false);
                expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
            });
            it("напрямую через пункт сделки ничего не вывести", async function () {
                await expect(pointsController1.withdraw(dealId))
                    .to.be.revertedWith('only deals controller can call this function');
                await expect(pointsController1.connect(acc1).withdraw(dealId))
                    .to.be.revertedWith('only deals controller can call this function');
                await expect(pointsController1.connect(acc2).withdraw(dealId))
                    .to.be.revertedWith('only deals controller can call this function');
            });
            it("не выполненая сделка не свапается", async function () {
                await dealsController.connect(acc1).withdraw(dealId);
                await expect(dealsController.swap(dealId))
                    .to.be.revertedWith('there are not executed deal points');
            });
            describe("свапаем сделку:", async function () {
                beforeEach(async () => {
                    // свапаем сделку
                    expect(await dealsController.isSwapped(dealId)).to.eq(false);
                    await expect(dealsController.swap(dealId))
                        .to.emit(dealsController, 'Swap').withArgs(dealId);
                    expect(await dealsController.isSwapped(dealId)).to.eq(true);
                });

                it("вывод средств не меняет статус выполненной сделки", async function () {
                    await expect(dealsController.connect(acc1).withdraw(dealId))
                        .to.not.emit(dealsController, 'Execute');
                    expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(true);
                    expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(true);
                });
            });
        });
    });
    describe("делаем овнера фабрикой (работаем от имени фабрики сделок):", function () {
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer = 0;

        beforeEach(async () => {
            await dealsController.setFactories([owner.address], true);
        });
        it("создание сделки", async () => {
            // создаем открытую сделку
            await dealsController.createDeal(acc1.address, acc2.address);
            // id сделки
            var dealId = 1;

            // получаем сделку
            var deal = await dealsController.getDeal(dealId);
            expect(deal[0].state).to.eq(1);
            expect(deal[0].owner1).to.eq(acc1.address);
            expect(deal[0].owner2).to.eq(acc2.address);
        });
        it("создание открытой сделки", async () => {
            // создаем открытую сделку
            await dealsController.createDeal(acc1.address, zeroAddress);
            // id сделки
            var dealId = 1;

            // получаем сделку
            var deal = await dealsController.getDeal(dealId);
            expect(deal[0].state).to.eq(1);
            expect(deal[0].owner1).to.eq(acc1.address);
            expect(deal[0].owner2).to.eq(zeroAddress);
        });
        it("создание и заполнение пунктами сделки", async () => {
            // создаем открытую сделку
            await dealsController.createDeal(acc1.address, acc2.address);
            // id сделки
            var dealId = 1;

            // создаем erc20 пункт (передача от первого втомроу)
            await erc20PointsController
                .createPoint(dealId, acc1.address, acc2.address, erc20Token.address, erc20Count, withdrawTimer);
            expect(await dealsController.getDealPointsCount(dealId)).to.eq(1);
            expect(await dealsController.getTotalDealPointsCount()).to.eq(1);

            // создаем eth пункт (передача от второго первому)
            await etherPointsController
                .createPoint(dealId, acc2.address, acc1.address, etherCount, withdrawTimer);
            expect(await dealsController.getDealPointsCount(dealId)).to.eq(2);
            expect(await dealsController.getTotalDealPointsCount()).to.eq(2);

            // завершаем редактирование сделки
            await dealsController.stopDealEditing(dealId);

            // получаем всю сделку
            var deal = await dealsController.getDeal(dealId);
            expect(deal[0].state).to.eq(2); // состояние сделки - выполняется
            expect(deal[0].pointsCount).to.eq(2);
            expect(deal[1][0].controller).to.eq(erc20PointsController.address);
            expect(deal[1][1].controller).to.eq(etherPointsController.address);
            expect(deal[1][0].id).to.eq(1);
            expect(deal[1][1].id).to.eq(2);
        });
        it("выполнение закрытой сделки", async () => {
            // создаем открытую сделку
            await dealsController.createDeal(acc1.address, acc2.address);
            // id сделки
            var dealId = 1;

            // создаем erc20 пункт (передача от первого втомроу)
            await erc20PointsController
                .createPoint(dealId, acc1.address, acc2.address, erc20Token.address, erc20Count, withdrawTimer);

            // создаем eth пункт (передача от второго первому)
            await etherPointsController
                .createPoint(dealId, acc2.address, acc1.address, etherCount, withdrawTimer);

            // завершаем редактирование сделки
            await dealsController.stopDealEditing(dealId);

            // сделка не свапается пока не выполнена
            await expect(dealsController.swap(dealId)).to.be.revertedWith('there are not executed deal points');

            // получаем всю сделку
            var deal = await dealsController.getDeal(dealId);
            pointsController0 = await ethers.getContractAt("IDealPointsController", deal[1][0].controller);
            pointsController1 = await ethers.getContractAt("IDealPointsController", deal[1][1].controller);
            expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(false);
            expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
            expect(await dealsController.isExecuted(dealId)).to.eq(false);

            // выполняем сделку
            // 1 акк
            await erc20Token.mintTo(acc1.address, erc20Count);
            await erc20Token.connect(acc1).approve(deal[1][0].controller, erc20Count);
            await expect(dealsController.connect(acc1).execute(dealId))
                .to.emit(dealsController, 'Execute').withArgs(dealId, acc1.address, true);
            expect(await pointsController0.isExecuted(deal[1][0].id)).to.eq(true);
            expect(await pointsController1.isExecuted(deal[1][1].id)).to.eq(false);
            expect(await dealsController.isExecuted(dealId)).to.eq(false);
            // 2 акк
            await expect(dealsController.connect(acc2).execute(dealId, { value: etherCount }))
                .to.emit(dealsController, 'Execute').withArgs(dealId, acc2.address, true);
            expect(await dealsController.isExecuted(dealId)).to.eq(true);

            // свапаем сделку
            expect(await dealsController.isSwapped(dealId)).to.eq(false);
            await expect(dealsController.swap(dealId))
                .to.emit(dealsController, 'Swap').withArgs(dealId);
            expect(await dealsController.isSwapped(dealId)).to.eq(true);
        });
    });

    describe("создаем открытую сделку с таймерами вывода ассетов:", async function () {
        const dealId = 1;
        const etherCount = ethers.utils.parseEther("1.0");
        const erc20Count = 100;
        const withdrawTimer1 = 120;
        const withdrawTimer2 = 240;

        beforeEach(async () => {
            await dealsFactory.connect(acc1).createDeal([zeroAddress,
                [[zeroAddress, acc1.address, etherCount, withdrawTimer1]],
                [[acc1.address, zeroAddress, erc20Token.address, erc20Count, withdrawTimer2]],
                [],
                []]);
        });
        it("таймеры сделки заданы", async function () {
            // получаем сделку
            var deal = await dealsController.getDeal(dealId);
            // withdrawTimer
            expect(deal[1][0].withdrawTimer).to.eq(withdrawTimer1);
            expect(deal[1][1].withdrawTimer).to.eq(withdrawTimer2);
        });
        it("время вывода равно 0 (пока не свапнуто)", async function () {
            // получаем сделку
            var deal = await dealsController.getDeal(dealId);
            // withdrawTimer
            expect(deal[1][0].withdrawTime).to.eq(0);
            expect(deal[1][1].withdrawTime).to.eq(0);
        });
        it("создатель выводить ничего не может - выводить пока нечего (сделка не выполнена овнером)", async function () {
            await expect(dealsController.connect(acc1).withdraw(dealId)).to.be.revertedWith('has no balance to withdraw');
        });
        describe("овнер выполняет сделку:", async function () {
            beforeEach(async () => {
                var deal = await dealsController.getDeal(dealId);
                await erc20Token.mintTo(acc1.address, erc20Count);
                await erc20Token.connect(acc1).approve(deal[1][1].controller, erc20Count);
                await dealsController.connect(acc1).execute(dealId);
            });
            it("создатель может вывести ассеты обратно, пока небыло свапа", async function () {
                // вывод
                await dealsController.connect(acc1).withdraw(dealId);

                // проверка
                var deal = await dealsController.getDeal(dealId);
                expect(await erc20Token.balanceOf(acc1.address)).to.eq(erc20Count);
                expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
                    .to.eq(0);
                expect(await pointsController1.balance(deal[1][0].id)).to.eq(0);
            });
            it("при выводе до свапа выводит эвенты вывода ассета и смены состояния сделки (todo тут можно сократить газ - упразднив здесь эвент смены состояния выполненности)", async function () {
                expect(await dealsController.connect(acc1).withdraw(dealId))
                    .to.emit(dealsController, 'Execute').withArgs(dealId, acc1.address, false)
                    .to.emit(dealsController, 'OnWithdraw').withArgs(dealId, acc1.address);
            });
            it("двойной вывод невозможен", async function () {
                await dealsController.connect(acc1).withdraw(dealId);
                await expect(dealsController.connect(acc1).withdraw(dealId)).to.be.revertedWith('has no balance to withdraw');
            });
            it("время вывода равно 0 (пока не свапнуто)", async function () {
                // получаем сделку
                var deal = await dealsController.getDeal(dealId);
                // withdrawTimer
                expect(deal[1][0].withdrawTime).to.eq(0);
                expect(deal[1][1].withdrawTime).to.eq(0);
            });
            it("сделка не выполнена", async function () {
                expect(await dealsController.isSwapped(dealId)).to.eq(false);
            });

            describe("второй акк выполняет сделку", async function () {
                beforeEach(async () => {
                    await dealsController.connect(acc2).execute(dealId, { value: await dealsController.executeEtherValue(dealId, 2) });
                });
                it("таймеры сделки остались прежними", async function () {
                    // получаем сделку
                    var deal = await dealsController.getDeal(dealId);
                    // withdrawTimer
                    expect(deal[1][0].withdrawTimer).to.eq(withdrawTimer1);
                    expect(deal[1][1].withdrawTimer).to.eq(withdrawTimer2);
                });
                it("сделка не выполнена", async function () {
                    expect(await dealsController.isSwapped(dealId)).to.eq(false);
                });

                describe("свапаем сделку", async function () {
                    let timeTowithdraw1;
                    let timeTowithdraw2;
                    beforeEach(async () => {
                        await expect(dealsController.swap(dealId))
                            .to.emit(dealsController, 'Swap').withArgs(dealId);
                        const timeAfterSwap = (await ethers.provider.getBlock()).timestamp;
                        timeTowithdraw1 = timeAfterSwap + withdrawTimer1;
                        timeTowithdraw2 = timeAfterSwap + withdrawTimer2;
                    });
                    it("сделка стала выполненой", async function () {
                        expect(await dealsController.isSwapped(dealId)).to.eq(true);
                    });
                    it("время вывода НЕ равно 0 (свапнуто)", async function () {
                        // получаем сделку
                        var deal = await dealsController.getDeal(dealId);
                        // withdrawTimer
                        expect(deal[1][0].withdrawTime).to.not.eq(0);
                        expect(deal[1][1].withdrawTime).to.not.eq(0);
                    });
                    it("проверка времени вывода", async function () {
                        // получаем сделку
                        var deal = await dealsController.getDeal(dealId);
                        // withdrawTimer
                        expect(deal[1][0].withdrawTime.toString()).to.eq(timeTowithdraw1.toString());
                        expect(deal[1][1].withdrawTime.toString()).to.eq(timeTowithdraw2.toString());
                    });
                    it("таймеры сделки остались прежними", async function () {
                        // получаем сделку
                        var deal = await dealsController.getDeal(dealId);
                        // withdrawTimer
                        expect(deal[1][0].withdrawTimer).to.eq(withdrawTimer1);
                        expect(deal[1][1].withdrawTimer).to.eq(withdrawTimer2);
                    });
                    it("создатель выводить ничего не может - по правилам текущей сделки настроено что ждать должен даже создатеть", async function () {
                        await expect(dealsController.connect(acc1).withdraw(dealId)).to.be.revertedWith('nothing to withdraw');
                    });
                    it("второй акк выводить ничего не может - выжидание таймера вывода", async function () {
                        await expect(dealsController.connect(acc2).withdraw(dealId)).to.be.revertedWith('nothing to withdraw');
                    });
                    describe("выждали возможность вывода ассета, доступного создателю (по правилам сделки)", async function () {
                        beforeEach(async () => {
                            await Up(withdrawTimer1);
                        });
                        it("создатель может вывести ассеты", async function () {
                            // вывод
                            lastBalance = await ethers.provider.getBalance(acc1.address);
                            expect(await dealsController.connect(acc1).withdraw(dealId))
                                .to.emit(dealsController, 'OnWithdraw').withArgs(dealId, acc1.address);

                            // проверка
                            expect(Number(await ethers.provider.getBalance(acc1.address)))
                                .to.be.greaterThan(Number(lastBalance));
                            var deal = await dealsController.getDeal(dealId);
                            expect(await pointsController0.balance(deal[1][1].id)).to.eq(0);
                        });
                        it("второй акк не может вывести ассеты - выжидание по правилам сделки", async function () {
                            // вывод            
                            await expect(dealsController.connect(acc2).withdraw(dealId)).to.be.revertedWith('nothing to withdraw');
                        });

                        describe("выждали возможность вывода ассета, доступного второму аккаунту (по правилам сделки)", async function () {
                            beforeEach(async () => {
                                await Up(withdrawTimer2 - withdrawTimer1);
                            });
                            it("второй акк может вывести ассеты", async function () {
                                // вывод            
                                expect(await dealsController.connect(acc2).withdraw(dealId))
                                    .to.emit(dealsController, 'OnWithdraw').withArgs(dealId, acc2.address);

                                // проверка
                                var deal = await dealsController.getDeal(dealId);
                                expect(await erc20Token.balanceOf(acc2.address)).to.eq(erc20Count);
                                expect(await erc20Token.balanceOf((await dealsController.getDeal(dealId))[1][1].controller))
                                    .to.eq(0);
                                expect(await pointsController1.balance(deal[1][0].id)).to.eq(0);
                            });
                            it("создатль до сих пор может вывести свое", async function () {
                                await dealsController.connect(acc1).withdraw(dealId);
                                await expect(dealsController.connect(acc1).withdraw(dealId)).to.be.revertedWith('has no balance to withdraw');
                            });
                            it("двойной вывод невозможен ни кому", async function () {
                                await dealsController.connect(acc1).withdraw(dealId);
                                await dealsController.connect(acc2).withdraw(dealId);
                                await expect(dealsController.connect(acc1).withdraw(dealId)).to.be.revertedWith('has no balance to withdraw');
                                await expect(dealsController.connect(acc2).withdraw(dealId)).to.be.revertedWith('has no balance to withdraw');
                            });
                        });
                    });
                });
            });
        });
    });
});