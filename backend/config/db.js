// Import mysql2
const mysql = require("mysql2")

// Load environment variables
require("dotenv").config()

// Create database connection
const db = mysql.createConnection({

  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  port: process.env.DB_PORT

})

// Connect to MySQL
db.connect((error) => {

  if (error) {

    console.log("Database connection failed")

    console.log(error)

  } else {

    console.log("MySQL connected successfully")

  }

})

// Export database connection
module.exports = db