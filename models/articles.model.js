const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id):: INT AS comment_count
        FROM comments
        LEFT JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
         GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found by that ID",
        });
      }
      return rows[0];
    });
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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc", "ASC", "DESC"];
  const queryValues = [];

  if (topic) {
    await checkExists("articles", "topic", topic);
  }

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr = ``;
  let queryStr1 = `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
                     FROM articles
                     LEFT JOIN comments ON comments.article_id = articles.article_id `;

  let queryStr2 = ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  if (topic) {
    queryValues.push(topic);
    queryStr = queryStr1 + `WHERE topic = $1` + queryStr2;
  }

  return db.query(queryStr, queryValues).then(({ rows }) => {
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
      return rows;
    });
};

exports.insertCommentById = (id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `SELECT * FROM articles
          WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found by that ID",
        });
      } else if (typeof username !== "string" || typeof body !== "string") {
        return Promise.reject({
          status: 400,
          msg: "Invalid input",
        });
      }
      return db
        .query(
          "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
          [username, body, id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};
