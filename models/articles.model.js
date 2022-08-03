const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found by that ID",
        });
      }
      return rows;
    });
};

exports.updateArticleById = (id, updates) => {
  let newVotes = updates.inc_votes;

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [newVotes, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
