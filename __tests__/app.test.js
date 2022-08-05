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
        expect(Array.isArray(res.body.topics)).toBe(true);
        expect(res.body.topics.length > 1).toBe(true);
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
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
        expect(res.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test(`responds with an article object`, () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });

  test("status:400, responds with an error message when passed a bad ID", () => {
    return request(app)
      .get("/api/articles/abcd")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });

  test("status:404, responds with an error message when passed an id that doesn't belong to an article", () => {
    return request(app)
      .get("/api/articles/11111111")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No article found by that ID");
      });
  });
});

//describe("Error Handling", () => {
// test("status:400, responds with an error message when passed a bad ID", () => {
//   return request(app)
//     .get("/api/articles/abcd")
//     .expect(400)
//     .then((res) => {
//       expect(res.body.msg).toBe("Invalid input");
//     });
// });
// test("status:404, responds with an error message when passed an id that doesn't belong to an article", () => {
//   return request(app)
//     .get("/api/articles/11111111")
//     .expect(404)
//     .then((res) => {
//       expect(res.body.msg).toBe("No article found by that ID");
//     });
// });
// it("status:400, responds with an error message when not passed an integer", () => {
//   const articleUpdate = { inc_votes: "hello" };
//   return request(app)
//     .patch("/api/articles/1")
//     .send(articleUpdate)
//     .expect(400)
//     .then((res) => {
//       expect(res.body.msg).toBe("Invalid input");
//     });
// });
// test("status:400, responds with an error message when passed a bad ID", () => {
//   return request(app)
//     .get("/api/articles/abcd/comments")
//     .expect(400)
//     .then((res) => {
//       expect(res.body.msg).toBe("Invalid input");
//     });
// });

// test("status:404, responds with an error message when article does not exist", () => {
//   return request(app)
//     .get("/api/articles/1234/comments")
//     .expect(404)
//     .then((res) => {
//       expect(res.body.msg).toBe("No article found by that ID");
//     });
// });

// test("status:404, responds with an error message when comment is posted to an article that does not exist", () => {
//   const newComment = {
//     username: "icellusedkars",
//     body: "I have no idea where this will lead us, but I have a definite feeling it will be a place both wonderful and strange.",
//   };
//   return request(app)
//     .post("/api/articles/1234/comments")
//     .send(newComment)
//     .expect(404)
//     .then((res) => {
//       expect(res.body.msg).toBe("No article found by that ID");
//     });
// });

// test("status:400, responds with an error message when passed an object with invalid inputs", () => {
//   const newComment = {
//     username: 4567,
//     body: null,
//   };
//   return request(app)
//     .post("/api/articles/1/comments")
//     .expect(400)
//     .then((res) => {
//       expect(res.body.msg).toBe("Invalid input");
//     });
// });
//});

describe("PATCH /api/articles/:article_id", () => {
  it("status:200, responds with the updated article object with new votes added to the previous votes value", () => {
    const articleUpdate = { inc_votes: 20 };

    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 120,
        });
      });
  });
  it("status:200, responds with the updated article object when passed votes are negative", () => {
    const articleUpdate = { inc_votes: -20 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 80,
        });
      });
  });
});
it("status:400, responds with an error message when not passed an integer", () => {
  const articleUpdate = { inc_votes: "hello" };
  return request(app)
    .patch("/api/articles/1")
    .send(articleUpdate)
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid input");
    });
});

describe("GET /api/users", () => {
  test("Responds with an array of users objects, each of which should have 'username', 'name' and 'avatar_url' properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users.length > 1).toBe(true);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200, returns an array of article objects sorted descending by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([
          {
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 16,
            created_at: "2020-04-06T12:17:00.000Z",
          },
          {
            comment_id: 17,
            body: "The owls are not what they seem.",
            article_id: 9,
            author: "icellusedkars",
            votes: 20,
            created_at: "2020-03-14T17:02:00.000Z",
          },
        ]);
      });
  });

  test("status:400, responds with an error message when passed a bad ID", () => {
    return request(app)
      .get("/api/articles/abcd/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });

  test("status:404, responds with an error message when article does not exist", () => {
    return request(app)
      .get("/api/articles/1234/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with comment newly added to the database", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I have no idea where this will lead us, but I have a definite feeling it will be a place both wonderful and strange.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 1,
          author: "icellusedkars",
          body: "I have no idea where this will lead us, but I have a definite feeling it will be a place both wonderful and strange.",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("status:404, responds with an error message when comment is posted to an article that does not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I have no idea where this will lead us, but I have a definite feeling it will be a place both wonderful and strange.",
    };
    return request(app)
      .post("/api/articles/1234/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No article found by that ID");
      });
  });
  test("status:400, responds with an error message when passed an object with invalid inputs", () => {
    const newComment = {
      username: 4567,
      body: null,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("status:200, returns all articles sorted by a passed in parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("status:200, returns all articles sorted by date in a specified order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("status:200, returns articles, filtered by a specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(11);
      });
  });
  test("status:400, responds with and error when passed an invalid sort by query", () => {
    return request(app)
      .get("/api/articles?sort_by=titlegg")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("status:400, responds with and error when passed an invalid order by query", () => {
    return request(app)
      .get("/api/articles?order=balls")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("status:404, responds with an error message when article does not exist", () => {
    return request(app)
      .get("/api/articles?topic=nothing")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found");
      });
  });
  test("status:200, returns all articles sorted by date in a specified order", () => {
    return request(app)
      .get("/api/articles?order=ASC&sort_by=votes&topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", {
          ascending: true,
        });
        expect(articles.length).toBe(11);
      });
  });
  test("status:404, responds with an error message when article does not exist", () => {
    return request(app)
      .get("/api/articles?jgdgv")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
