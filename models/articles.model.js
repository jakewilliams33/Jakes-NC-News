const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return (
    db.query(
        `SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM comments
        LEFT JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
         GROUP BY articles.article_id;`,
        [id]
      ).then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "No article found by that ID",
          });
        }
        return rows[0];
      })
  );
};

exports.updateArticleById = (id, newVotes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [newVotes, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};


exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments found with that article ID",
        });
      }
      console.log(rows)
      return rows;
    });
};
