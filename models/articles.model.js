const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then(({ rows }) => {
        console.log(rows)
        if(rows.length === 0 ){
            return Promise.reject({
                status: 404,
                msg: "No article found by that ID"
            })
        }
      return rows;
    })

};
