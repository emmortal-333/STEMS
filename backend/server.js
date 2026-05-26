
// Import express
const express = require("express")

const cors = require("cors")

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

// GET all events
app.get("/events", (req, res) => {

  res.json(events)

})

/*
===================================
REGISTER ROUTE
===================================
*/

// POST register route
app.post("/register", (req, res) => {

  // Access frontend data
  const userData = req.body

  console.log(userData)

  // Send response
  res.json({
    message: "User registered successfully",
    data: userData
  })

})


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})