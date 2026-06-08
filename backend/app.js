const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const bcrypt = require("bcrypt")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "STEMS backend server is running"
  })
})

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

app.get("/events", (req, res) => {
  const userId = req.query.userId;

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

app.post("/rsvps", (req, res) => {
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

  db.query(sql, [user_id, event_id], (err, result) => {
    if (err) {
      console.log(err)

      if (err.errno === 1062) {
        return res.status(400).json({ 
          message: "You have already RSVP'd for this event!" 
        })
      }

      return res.status(500).json({ 
        message: "Failed to process RSVP entry" 
      })
    }

    res.status(201).json({ 
      message: "RSVP confirmed successfully!" 
    })
  })
})

app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `

  const values = [name, email, hashedPassword, role]

  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error)
      return res.status(500).json({
        message: "Registration failed"
      })
    }

    res.json({
      message: "User registered successfully"
    })
  })
})

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

app.post("/login", (req, res) => {
  const { email, password } = req.body

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
  })
})

module.exports = app
