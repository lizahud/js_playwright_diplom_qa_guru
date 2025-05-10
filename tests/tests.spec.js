import * as allure from 'allure-js-commons';
import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixture/index';
import { CommentBuilder } from '../src/helpers/builder/index';


const BUG_ERROR_MESSAGE = 'What did you find out?';
const CRASH_BUG_ERROR_MESSAGE = 'You found a crash bug, examine the page';
const FIRST_BUG_ERROR_MESSAGE = '#1 Awesome! You found a bug. Pretty easy right?'


test.describe('Тесты в рамках ДЗ №16 по academybugs', () => {

	test.beforeEach(async ({ webApp }) => {
    await webApp.main.open();
	});

  test('Выбранное количество результатов отображается в соответствии с нажатыми кнопками.', async ({ webApp }) => {
    await allure.tags('mainPage');

    await webApp.main.clickNextPaginationPage();
    await expect(webApp.main.bugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Изображение продукта полностью заполняет поле, как и все остальные изображения продуктов.', async ({ webApp }) => {
    await allure.tags('mainPage');

    await webApp.main.clickImageProduct();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Краткое описание и описание продукта на английском языке.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.clickDescriptionDetails();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Желтый и оранжевый цвета написаны правильно.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.chooseOrangProductColor();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Комментарий размещается под продуктом.', async ({ webApp }) => {
    await allure.tags('productPage');

    const commentData = new CommentBuilder()
    .addComment()
    .addName()
    .addEmail()
    .addWebsite()
    .generateCommentData();

    await webApp.main.gotoSelectOptions();
    await webApp.product.createComment(commentData.comment, commentData.name, commentData.email, commentData.website)
    await expect(webApp.main.crashBugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Ссылка на производителя показывает соответствующую страницу.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.clickManufacturerDetails();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Значок Twitter должен перенаправлять пользователя в Twitter.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.clickXIcon();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Валюта изменена, как и ожидалось.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.selectEurCurrency();
    await expect(webApp.main.crashBugOverlay).toContainText(CRASH_BUG_ERROR_MESSAGE);
  });

  test('Отображается список товаров в выбранном ценовом диапазоне.', async ({ webApp }) => {
    await allure.tags('productPage');

    await webApp.main.gotoSelectOptions();
    await webApp.product.clickFilterBySmallPrice();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Надпись кнопки «Войти» располагается по центру вертикально.', async ({ webApp }) => {
    await allure.tags('accountPage');

    await webApp.main.gotoLoginForPricing();
    await webApp.account.clickAccountSignInButton();
    await expect(webApp.main.firstBugOverlay).toContainText(FIRST_BUG_ERROR_MESSAGE);
  });

  test('Текст в разделе «Новый пользователь» на английском языке.', async ({ webApp }) => {
    await allure.tags('accountPage');

    await webApp.main.gotoLoginForPricing();
    await webApp.account.clickAccountSubheader();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });

  test('Заголовок поля пароля выравнивается так же, как и поле выше.', async ({ webApp }) => {
    await allure.tags('accountPage');

    await webApp.main.gotoLoginForPricing();
    await webApp.account.clickAccountPasswordLabel();
    await expect(webApp.main.bugPopup).toContainText(BUG_ERROR_MESSAGE);
  });
});
