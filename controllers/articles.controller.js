const { checkExists } = require("../db/seeds/utils");
const {
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  selectArticles,
  insertCommentById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  let id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (req, res, next) => {
  let id = req.params.article_id;
  let newVotes = req.body.inc_votes;

  updateArticleById(id, newVotes)
    .then((article) => {
      res.status(200).send({ article: article[0] });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  let id = req.params.article_id;
  Promise.all([
    selectCommentsByArticleId(id),
    checkExists("articles", "article_id", id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentById = (req, res, next) => {
  let id = req.params.article_id;
  let newComment = req.body;

  insertCommentById(id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
