
// Import express
const express = require("express")

const cors = require("cors")

const db = require("./config/db")

const bcrypt = require("bcrypt")

// Create express app
const app = express()

// Define server port
const PORT = 5000

app.use(cors())
// Middleware to read JSON data
app.use(express.json())

// Test route
app.get("/", (req, res) => {

  res.json({
    message: "STEMS backend server is running"
  })

})

/*
===================================
GET EVENTS ROUTE
===================================
*/

// Sample event data
const events = [
  {
    id: 1,
    title: "Tech Conference",
    location: "KCA Main Hall"
  },
  {
    id: 2,
    title: "Cybersecurity Workshop",
    location: "Lab 3"
  }
]

/*
===================================
GET EVENTS ROUTE (Updated to use Database)
===================================
*/

// GET all events with attendance status for a specific user
app.get("/events", (req, res) => {
  const userId = req.query.userId; // We get the user_id from the URL query string

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
      console.log(err);
      return res.status(500).json({ message: "Failed to fetch events" });
    }
    res.json(results);
  });
});

/*
===================================
POST RSVP ROUTE
===================================
*/
app.post("/rsvps", (req, res) => {
  const { user_id, event_id } = req.body

  // 1. Basic Validation check: Make sure both IDs were actually sent
  if (!user_id || !event_id) {
    return res.status(400).json({ 
      message: "Missing required user_id or event_id" 
    })
  }

  // 2. Prepare the SQL insertion command
  const sql = `
    INSERT INTO rsvps (user_id, event_id) 
    VALUES (?, ?)
  `

  // 3. Run the query on your MySQL connection
  db.query(sql, [user_id, event_id], (err, result) => {
    if (err) {
      console.log(err)

      // Handle duplicate entries gracefully (Error 1062 is MySQL's code for unique constraint violations)
      if (err.errno === 1062) {
        return res.status(400).json({ 
          message: "You have already RSVP'd for this event!" 
        })
      }

      return res.status(500).json({ 
        message: "Failed to process RSVP entry" 
      })
    }

    // 4. Send back a clean success response code
    res.status(201).json({ 
      message: "RSVP confirmed successfully!" 
    })
  })
})

/*
===================================
REGISTER ROUTE
===================================
*/

// POST register route
app.post("/register", (req, res) => {

  // Extract frontend data
  const { name, email, password, role } = req.body

  // Hash password
const hashedPassword = bcrypt.hashSync(password, 10)

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

      console.log(error)

      return res.status(500).json({
        message: "Registration failed"
      })

    }

    // Success response
    res.json({
      message: "User registered successfully"
    })

  })

})

// CREATE EVENT ROUTE
app.post("/events", (req, res) => {

  const {
    title,
    location,
    event_date,
    organizer_id
  } = req.body

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

        console.log(err)

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
LOGIN ROUTE
===================================
*/

app.post("/login", (req, res) => {

  // Extract login data
  const { email, password } = req.body

  // Find user by email
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `

  db.query(sql, [email], (error, results) => {

    if (error) {

      console.log(error)

      return res.status(500).json({
        message: "Login failed"
      })

    }

    // User not found
    if (results.length === 0) {

      return res.status(404).json({
        message: "User not found"
      })

    }

    // Get user from database
    const user = results[0]

    // Compare passwords
    const passwordMatch = bcrypt.compareSync(
      password,
      user.password
    )

    // Wrong password
    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid password"
      })

    }

    // Successful login
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  })

})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})