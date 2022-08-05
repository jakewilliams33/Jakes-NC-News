const {removeCommentById} = require("../models/comments.model")

exports.deleteCommentById = (req, res, next) => {
  let id = req.params.comment_id;
  removeCommentById(id)
    .then((comment) => {
      res.status(204).send({ comment: comment });
    })
    .catch((err) => next(err));
};