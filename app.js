const express = require("express");
const app = express();
app.use(express.json());
const endpoints = require("./endpoints.json");

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  getArticles,
  postCommentById,
} = require("./controllers/articles.controller");

const { getUsers } = require("./controllers/users.controller");

const { deleteCommentById } = require("./controllers/comments.controller");

app.get("/api", (req, res) => res.send(endpoints));
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentById);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.all("/api/articles?jgdgv", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
