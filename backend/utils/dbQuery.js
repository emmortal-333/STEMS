const db = require("../config/db")

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}

module.exports = dbQuery
