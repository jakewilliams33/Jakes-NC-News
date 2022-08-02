const express = require("express");
const app = express();
//app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

// app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
