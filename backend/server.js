
// Import express
const express = require("express")

const cors = require("cors")

const db = require("./config/db")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const rateLimit = require("express-rate-limit")

const { authenticate, authorize } = require("./middleware/auth")

const {
  validateRegistration,
  validateLogin,
  validateEvent,
  validateRsvp
} = require("./middleware/validate")

// Create express app
const app = express()

// Define server port
const PORT = 5000

// CORS: only allow requests from the configured frontend origin
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",")

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

// Middleware to read JSON data
app.use(express.json())

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
})

// Test route
app.get("/", (req, res) => {

  res.json({
    message: "STEMS backend server is running"
  })

})

/*
===================================
GET EVENTS ROUTE (Updated to use Database)
===================================
*/

// GET all events with attendance status for a specific user
app.get("/events", (req, res) => {
  const userId = req.query.userId;

  // We use a LEFT JOIN to get all events, and match them with RSVPs for this specific user
  const sql = `
    SELECT e.*, 
    CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as is_attending
    FROM events e
    LEFT JOIN rsvps r ON e.id = r.event_id AND r.user_id = ?
    ORDER BY e.event_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch events:", err.code);
      return res.status(500).json({ message: "Failed to fetch events" });
    }
    res.json(results);
  });
});

/*
===================================
POST RSVP ROUTE (Protected)
===================================
*/
app.post("/rsvps", authenticate, validateRsvp, (req, res) => {
  const { event_id } = req.body
  const user_id = req.user.id

  // Prepare the SQL insertion command
  const sql = `
    INSERT INTO rsvps (user_id, event_id) 
    VALUES (?, ?)
  `

  // Run the query on your MySQL connection
  db.query(sql, [user_id, event_id], (err, result) => {
    if (err) {
      console.error("RSVP error:", err.code)

      // Handle duplicate entries gracefully
      if (err.errno === 1062) {
        return res.status(400).json({ 
          message: "You have already RSVP'd for this event!" 
        })
      }

      return res.status(500).json({ 
        message: "Failed to process RSVP entry" 
      })
    }

    // Send back a clean success response code
    res.status(201).json({ 
      message: "RSVP confirmed successfully!" 
    })
  })
})

/*
===================================
REGISTER ROUTE (with validation + rate limiting)
===================================
*/

// POST register route
app.post("/register", authLimiter, validateRegistration, async (req, res) => {

  // Extract frontend data
  const { name, email, password, role } = req.body

  try {
    // Hash password (async to avoid blocking the event loop)
    const hashedPassword = await bcrypt.hash(password, 10)

    // SQL query
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `

    // Values for query
    const values = [name, email, hashedPassword, role]

    // Execute query
    db.query(sql, values, (error, result) => {

      if (error) {

        console.error("Registration error:", error.code)

        if (error.errno === 1062) {
          return res.status(409).json({
            message: "An account with this email already exists"
          })
        }

        return res.status(500).json({
          message: "Registration failed"
        })

      }

      // Success response
      res.status(201).json({
        message: "User registered successfully"
      })

    })
  } catch (error) {
    console.error("Registration error:", error.message)
    return res.status(500).json({
      message: "Registration failed"
    })
  }

})

// CREATE EVENT ROUTE (Protected: organizer or admin only)
app.post("/events", authenticate, authorize("organizer", "admin"), validateEvent, (req, res) => {

  const {
    title,
    location,
    event_date
  } = req.body

  // Use authenticated user's ID as organizer
  const organizer_id = req.user.id

  const sql = `
    INSERT INTO events
    (title, location, event_date, organizer_id)
    VALUES (?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      title,
      location,
      event_date,
      organizer_id
    ],
    (err, result) => {

      if (err) {

        console.error("Event creation error:", err.code)

        return res.status(500).json({
          message: "Failed to create event"
        })

      }

      res.status(201).json({
        message: "Event created successfully"
      })

    }
  )

})


/*
===================================
LOGIN ROUTE (with validation + rate limiting)
===================================
*/

app.post("/login", authLimiter, validateLogin, async (req, res) => {

  // Extract login data
  const { email, password } = req.body

  // Find user by email
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `

  db.query(sql, [email], async (error, results) => {

    if (error) {

      console.error("Login error:", error.code)

      return res.status(500).json({
        message: "Login failed"
      })

    }

    // User not found — use generic message to prevent user enumeration
    if (results.length === 0) {

      return res.status(401).json({
        message: "Invalid email or password"
      })

    }

    // Get user from database
    const user = results[0]

    try {
      // Compare passwords (async)
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      )

      // Wrong password — same generic message
      if (!passwordMatch) {

        return res.status(401).json({
          message: "Invalid email or password"
        })

      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      )

      // Successful login
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (err) {
      console.error("Login error:", err.message)
      return res.status(500).json({
        message: "Login failed"
      })
    }

  })

})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
