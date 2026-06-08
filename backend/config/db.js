// Import mysql2
const mysql = require("mysql2")

// Load environment variables
require("dotenv").config()

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"]
const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
)

if (missingVars.length > 0) {
  console.error(
    `Missing required database environment variables: ${missingVars.join(", ")}`
  )
  process.exit(1)
}

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

    console.error("Database connection failed:", error.message)
    process.exit(1)

  } else {

    console.log("MySQL connected successfully")

  }

})

// Export database connection
module.exports = db