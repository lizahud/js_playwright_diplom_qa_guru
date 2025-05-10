import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { ChallengerService }  from '../src/service/index';
require('dotenv').config();


test.describe("API challenge", () => {
  let token;

  test.beforeAll(async ({request}) => {
    let challengerService = new ChallengerService(request);

    let response = await challengerService.post();
    let headers = await response.headers();
    token = headers['x-challenger'];
    console.log('Это токен: '+token);
});

  test("GET /challenger/guid (existing X-CHALLENGER)", {tag: ['@id_34', '@GET']}, async ({ request }) => {
    let challengerService = new ChallengerService(request);

    let response = await challengerService.getChallengerGuid(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.xChallenger).toBe(token)
    expect(body).toHaveProperty('challengeStatus');
  });

  test("PUT /challenger/guid RESTORE", {tag: ['@id_35', '@PUT']}, async ({ request }) => {
    let challengerService = new ChallengerService(request);

    let response1 = await challengerService.getChallengerGuid(token);
    let body = await response1.json();
    let response2 = await challengerService.putChallengerGuid(body, token);
    let body1 = await response2.json();
    expect(response2.status()).toBe(200);
    expect(body1.xChallenger).toBe(token)
  });

  test("PUT /challenger/guid CREATE", {tag: ['@id_36', '@PUT']}, async ({ request }) => {
    let challengerService = new ChallengerService(request);

    let new_token = faker.string.uuid();
    let response1 = await challengerService.getChallengerGuid(token);
    let body = await response1.json();
    body.xChallenger = new_token;
    console.log(body.xChallenger);
    let response2 = await challengerService.putChallengerGuid(body, new_token);
    expect(response2.status()).toBe(201);
    expect(body.xChallenger).toBe(new_token)
  });

  test("GET /challenger/database/guid (200)", {tag: ['@id_37', '@GET']}, async ({ request }) => {
    let challengerService = new ChallengerService(request);

    let response = await challengerService.getDatabaseGuid(token);
    expect(response.status()).toBe(200);
  });

  test("PUT /challenger/database/guid (Update)", {tag: ['@id_38', '@PUT']}, async ({ request }) => {
    let challengerService = new ChallengerService(request);

    let response = await challengerService.getDatabaseGuid(token);
    let body = await response.json();
    let response1 = await challengerService.putDatabaseGuid(body, token);
    expect(response1.status()).toBe(204);
  });
});
