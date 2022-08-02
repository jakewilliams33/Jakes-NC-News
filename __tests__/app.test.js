const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());


describe("GET /api/topics", () => {
  test("Responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.topics)).toBe(true)
        expect(res.body.topics.length>1).toBe(true)
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe("ALL /api/*", () => {
  test("responds with error 404 when passed a route that does not exist", () => {
    return request(app)
    .get("/api/jake")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('Not Found');
    })
  });
})
