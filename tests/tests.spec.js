import * as allure from 'allure-js-commons';
import { test, expect } from '@playwright/test';
import { CommentBuilder } from '../page_object/helpers/builder/index';
import { App } from '../page_object/pages/appPage';


const URL_UI = 'https://academybugs.com/find-bugs/';
const BUG_ERROR_MESSAGE = 'What did you find out?';
const CRASH_BUG_ERROR_MESSAGE = 'You found a crash bug, examine the page';
const FIRST_BUG_ERROR_MESSAGE = '#1 Awesome! You found a bug. Pretty easy right?'
let app;


test.describe('Тесты в рамках ДЗ №16 по academybugs', () => {

	test.beforeEach(async ({ page }) => {
    app = new App(page);
		await app.main.open(URL_UI);
	});

  test('Выбранное количество результатов отображается в соответствии с нажатыми кнопками.', async ({ page }) => {
    await allure.tags('mainPage');

    app = new App(page);

    await app.main.clickNextPaginationPage();
    await expect(app.main.bugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Изображение продукта полностью заполняет поле, как и все остальные изображения продуктов.', async ({ page }) => {
    await allure.tags('mainPage');

    app = new App(page);

    await app.main.clickImageProduct();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Краткое описание и описание продукта на английском языке.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.clickDescriptionDetails();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Желтый и оранжевый цвета написаны правильно.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.chooseOrangProductColor();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Комментарий размещается под продуктом.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    const commentData = new CommentBuilder()
    .addComment()
    .addName()
    .addEmail()
    .addWebsite()
    .generateCommentData();

    await app.main.gotoSelectOptions();
    await app.product.createComment(commentData.comment, commentData.name, commentData.email, commentData.website)
    await expect(app.main.crashBugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Ссылка на производителя показывает соответствующую страницу.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.clickManufacturerDetails();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Значок Twitter должен перенаправлять пользователя в Twitter.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.clickXIcon();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Валюта изменена, как и ожидалось.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.selectEurCurrency();
    await expect(app.main.crashBugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Отображается список товаров в выбранном ценовом диапазоне.', async ({ page }) => {
    await allure.tags('productPage');

    app = new App(page);

    await app.main.gotoSelectOptions();
    await app.product.clickFilterBySmallPrice();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Надпись кнопки «Войти» располагается по центру вертикально.', async ({ page }) => {
    await allure.tags('accountPage');

    app = new App(page);

    await app.main.gotoLoginForPricing();
    await app.account.clickAccountSignInButton();
    await expect(app.main.firstBugOverlay).toContainText(FIRST_BUG_ERROR_MESSAGE);
  });

  test('Текст в разделе «Новый пользователь» на английском языке.', async ({ page }) => {
    await allure.tags('accountPage');

    app = new App(page);

    await app.main.gotoLoginForPricing();
    await app.account.clickAccountSubheader();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Заголовок поля пароля выравнивается так же, как и поле выше.', async ({ page }) => {
    await allure.tags('accountPage');

    app = new App(page);

    await app.main.gotoLoginForPricing();
    await app.account.clickAccountPasswordLabel();
    await expect(app.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });
});
