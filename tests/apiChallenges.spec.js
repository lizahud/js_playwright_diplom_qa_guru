import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';

test.describe("API challenge", () => {
  let URL = "https://apichallenges.herokuapp.com/";
  let token;

  test.beforeAll(async ({ request }) => {
    let response = await request.post(`${URL}challenger`);
    let headers = await response.headers();
    token = headers["x-challenger"];
    console.log('Это токен: ' + token);
  });

  test("GET /challenges (200)", {tag: ['@id_02', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}challenges`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    let headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body.challenges.length).toBe(59);
  });

  test("GET /todos (200)", {tag: ['@id_03', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.length).toBeGreaterThan(0);
  });

  test("GET /todo (404) not plural", {tag: ['@id_04', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todo`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe('Not Found');
  });

  test("GET /todos/{id} (200)", {tag: ['@id_05', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos/7`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
  });

  test("GET /todos/{id} (404)", {tag: ['@id_06', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos/777`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe('Not Found');
  });

  test("GET /todos (200) ?filter", {tag: ['@id_07', '@GET']}, async ({ request }) => {
    let response1 = await request.post(`${URL}todos`, {
        headers: {
          "x-challenger": token,
          'content-type': 'application/json',
        },
        data: {
            "title": "order products",
            "doneStatus": true,
            "description": ""
          },
      });
    let response2 = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
          },
        });
    let response3 = await request.get(`${URL}todos?doneStatus=true`, {
      headers: {
        "x-challenger": token,
      },
    });
    let filteredBody = await response3.json();
    expect(response3.status()).toBe(200);
    expect(Array.isArray(filteredBody.todos)).toBe(true);
  });

test("HEAD /todos (200)", {tag: ['@id_08', '@HEAD']}, async ({ request }) => {
    let response = await request.head(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
  });

  test("POST /todos (201)", {tag: ['@id_09', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
        'content-type': 'application/json',
      },
      data: {
        "title": "order products",
        "doneStatus": true,
        "description": ""
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body.title).toBe("order products");
  });

  test("POST /todos (400) doneStatus", {tag: ['@id_10', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": 777,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Failed Validation: doneStatus should be BOOLEAN but was NUMERIC');
  });

  test("POST /todos (400) title too long", {tag: ['@id_11', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(55),
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50');
  });

  test("POST /todos (400) description too long", {tag: ['@id_12', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": faker.lorem.words(207)
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200');
  });

  test("POST /todos (201) max out content", {tag: ['@id_13', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.string.alphanumeric({ length: 50 }),
            "doneStatus": true,
            "description": faker.string.alphanumeric({ length: 200 })
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.title.length).toBeLessThanOrEqual(50);
    expect(body.description.length).toBeLessThanOrEqual(200);
  });

  test("POST /todos (413) content too long", {tag: ['@id_14', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": faker.lorem.words(1000)
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(413);
    expect(body.errorMessages).toContain('Error: Request body too large, max allowed is 5000 bytes');
  });

  test("POST /todos (400) extra", {tag: ['@id_15', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": "",
            "newField": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Could not find field: newField');
  });

  test("PUT /todos/{id} (400)", {tag: ['@id_16', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/777`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Cannot create todo with PUT due to Auto fields id');
  });

  test("POST /todos/{id} (200)", {tag: ['@id_17', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos/1`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBeDefined();
    expect(body.id).toBe(1);
  });

  test("POST /todos/{id} (404)", {tag: ['@id_18', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos/777`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
          },
    });
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe('Not Found');
  });

  test("PUT /todos/{id} full (200)", {tag: ['@id_19', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/1`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("doneStatus");
    expect(body).toHaveProperty("description");
  });

  test("PUT /todos/{id} partial (200)", {tag: ['@id_20', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/1`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "title": faker.lorem.words(2),
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("title");
    expect(body.title.length).toBeGreaterThan(0);
  });

  test("PUT /todos/{id} no title (400)", {tag: ['@id_21', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/1`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('title : field is mandatory');
  });

  test("PUT /todos/{id} no amend id (400)", {tag: ['@id_22', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/1`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
          data: {
            "id": 777,
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toContain('Can not amend id from 1 to 777');
  });

  test("DELETE /todos/{id} (200)", {tag: ['@id_23', '@DELETE']}, async ({ request }) => {
    let response = await request.delete(`${URL}todos/5`, {
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
    });
    expect(response.status()).toBe(200);
  });

  test("OPTIONS /todos (200)", {tag: ['@id_24', '@OPTIONS']}, async ({ request }) => {
    let response = await request.fetch(`${URL}todos`, {
        method: 'OPTIONS',
        headers: {
            "x-challenger": token,
            'content-type': 'application/json',
          },
    });
    let allowedMethods = response.headers()["allow"];
    expect(response.status()).toBe(200);
    expect(allowedMethods).toContain("OPTIONS, GET, HEAD, POST");
  });

  test("GET /todos (200) XML", {tag: ['@id_25', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "application/xml",
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(200);
    expect(contentType).toContain("application/xml");
  });

  test("GET /todos (200) JSON", {tag: ['@id_26', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "application/json",
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(200);
    expect(contentType).toContain("application/json");
  });

  test("GET /todos (200) ANY", {tag: ['@id_27', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "*/*",
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(200);
    expect(contentType).toContain("application/json");
  });

  test("GET /todos (200) XML pref", {tag: ['@id_28', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "application/xml, application/json",
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(200);
    expect(contentType).toContain("application/xml");
  });

  test("GET /todos (200) no accept", {tag: ['@id_29', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "",
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(200);
    expect(contentType).toContain("");
  });

  test("GET /todos (406)", {tag: ['@id_30', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "accept": "application/gzip",
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(406);
    expect(body.errorMessages).toContain('Unrecognised Accept Type');
  });

  test("POST /todos XML", {tag: ['@id_31', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "content-type": "application/xml",
            "accept": "application/xml",
          },
          data:
            '<todo><doneStatus>false</doneStatus><description>my description</description><title>A title</title></todo>'
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(201);
    expect(contentType).toContain('application/xml');
  });

  test("POST /todos JSON", {tag: ['@id_32', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "content-type": "application/json",
            "accept": "application/json",
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(201);
    expect(contentType).toContain('application/json');
  });

  test("POST /todos (415)", {tag: ['@id_33', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "content-type": "application/gzip",
            "accept": "application/json",
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(415);
    expect(body.errorMessages).toContain('Unsupported Content Type - application/gzip');
  });

  test("GET /challenger/guid (existing X-CHALLENGER)", {tag: ['@id_34', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}challenger/${token}`, {
        headers: {
            "x-challenger": token,
          },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.xChallenger).toBe(token)
    expect(body).toHaveProperty('challengeStatus');
  });

  test("PUT /challenger/guid RESTORE", {tag: ['@id_35', '@PUT']}, async ({ request }) => {
    let response1 = await request.get(`${URL}challenger/${token}`, {
      headers: {
          "x-challenger": token,
        },
    });
    let body = await response1.json();
    let response2 = await request.put(`${URL}challenger/${token}`, {
        headers: {
            "x-challenger": token,
          },
          data: body
    });
    let body1 = await response2.json();
    expect(response2.status()).toBe(200);
    expect(body1.xChallenger).toBe(token)
  });

  test("PUT /challenger/guid CREATE", {tag: ['@id_36', '@PUT']}, async ({ request }) => {
    let new_token = faker.string.uuid();
    let response1 = await request.get(`${URL}challenger/${token}`, {
      headers: {
          "x-challenger": token,
        },
    });
    let body = await response1.json();
    body.xChallenger = new_token;
    console.log(body.xChallenger);
    let response2 = await request.put(`${URL}challenger/${new_token}`, {
        headers: {
            "x-challenger": new_token,
          },
          data: body
    });
    expect(response2.status()).toBe(201);
    expect(body.xChallenger).toBe(new_token)
  });

  test("GET /challenger/database/guid (200)", {tag: ['@id_37', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}challenger/database/${token}`, {
        headers: {
            "x-challenger": token,
          },
    });
    expect(response.status()).toBe(200);
  });

  test("PUT /challenger/database/guid (Update)", {tag: ['@id_38', '@PUT']}, async ({ request }) => {
    let response = await request.get(`${URL}challenger/database/${token}`, {
      headers: {
          "x-challenger": token,
        },
    });
    let body = await response.json();
    let response1 = await request.put(`${URL}challenger/database/${token}`, {
        headers: {
            "x-challenger": token,
          },
          data: body
    });
    expect(response1.status()).toBe(204);
  });

  test("POST /todos XML to JSON", {tag: ['@id_39', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "content-type": "application/xml",
            "accept": "application/json",
          },
          data:
            '<todo><doneStatus>false</doneStatus><description>my description</description><title>A title</title></todo>'
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(201);
    expect(contentType).toContain('application/json');
  });

  test("POST /todos JSON to XML", {tag: ['@id_40', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
        headers: {
            "x-challenger": token,
            "content-type": "application/json",
            "accept": "application/xml",
          },
          data: {
            "title": faker.lorem.words(2),
            "doneStatus": true,
            "description": ""
          },
    });
    let contentType = response.headers()["content-type"];
    expect(response.status()).toBe(201);
    expect(contentType).toContain('application/xml');
  });
});
