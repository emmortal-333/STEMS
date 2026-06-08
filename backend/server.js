
// Import express
const express = require("express")

const cors = require("cors")

const dbQuery = require("./utils/dbQuery")

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
GET EVENTS ROUTE (Updated to use Database)
===================================
*/

// GET all events with attendance status for a specific user
app.get("/events", async (req, res) => {
  const userId = req.query.userId;

  const sql = `
    SELECT e.*, 
    CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as is_attending
    FROM events e
    LEFT JOIN rsvps r ON e.id = r.event_id AND r.user_id = ?
    ORDER BY e.event_date DESC
  `;

  try {
    const results = await dbQuery(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

/*
===================================
POST RSVP ROUTE
===================================
*/
app.post("/rsvps", async (req, res) => {
  const { user_id, event_id } = req.body

  if (!user_id || !event_id) {
    return res.status(400).json({ 
      message: "Missing required user_id or event_id" 
    })
  }

  const sql = `
    INSERT INTO rsvps (user_id, event_id) 
    VALUES (?, ?)
  `

  try {
    await dbQuery(sql, [user_id, event_id]);
    res.status(201).json({ 
      message: "RSVP confirmed successfully!" 
    })
  } catch (err) {
    console.log(err)

    if (err.errno === 1062) {
      return res.status(400).json({ 
        message: "You have already RSVP'd for this event!" 
      })
    }

    res.status(500).json({ 
      message: "Failed to process RSVP entry" 
    })
  }
})

/*
===================================
REGISTER ROUTE
===================================
*/

// POST register route
app.post("/register", async (req, res) => {

  const { name, email, password, role } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `

  const values = [name, email, hashedPassword, role]

  try {
    await dbQuery(sql, values);
    res.json({
      message: "User registered successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Registration failed"
    })
  }

})

// CREATE EVENT ROUTE
app.post("/events", async (req, res) => {

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

  try {
    await dbQuery(sql, [title, location, event_date, organizer_id]);
    res.status(201).json({
      message: "Event created successfully"
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Failed to create event"
    })
  }

})


/*
===================================
LOGIN ROUTE
===================================
*/

app.post("/login", async (req, res) => {

  const { email, password } = req.body

  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `

  try {
    const results = await dbQuery(sql, [email]);

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const user = results[0]

    const passwordMatch = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid password"
      })
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Login failed"
    })
  }

})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
