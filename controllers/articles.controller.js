const {
    selectArticleById
} = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    let id = req.params.article_id;
    selectArticleById(id)
      .then((article) => {
        res.status(200).send({ article: article[0] });
      })
      .catch((err) => next(err))
    
}

