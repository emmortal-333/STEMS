const request = require("supertest")
const bcrypt = require("bcrypt")

// Mock the database module before requiring app
jest.mock("../config/db", () => {
  const mockQuery = jest.fn()
  const mockConnect = jest.fn((cb) => cb && cb(null))
  return {
    query: mockQuery,
    connect: mockConnect,
  }
})

const db = require("../config/db")
const app = require("../app")

afterEach(() => {
  jest.clearAllMocks()
})

/*
 * GET /
 */
describe("GET /", () => {
  it("should return server running message", async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(200)
    expect(res.body.message).toBe("STEMS backend server is running")
  })
})

/*
 * GET /events
 */
describe("GET /events", () => {
  it("should return events list for a given userId", async () => {
    const mockEvents = [
      { id: 1, title: "Tech Conference", location: "KCA Main Hall", is_attending: 0 },
      { id: 2, title: "Cybersecurity Workshop", location: "Lab 3", is_attending: 1 },
    ]
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, mockEvents)
    })

    const res = await request(app).get("/events?userId=1")
    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockEvents)
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it("should return events without userId", async () => {
    const mockEvents = [{ id: 1, title: "Event", location: "Loc", is_attending: 0 }]
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, mockEvents)
    })

    const res = await request(app).get("/events")
    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockEvents)
  })

  it("should return 500 on database error", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(new Error("DB error"), null)
    })

    const res = await request(app).get("/events?userId=1")
    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Failed to fetch events")
  })
})

/*
 * POST /rsvps
 */
describe("POST /rsvps", () => {
  it("should create RSVP successfully", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, { insertId: 1 })
    })

    const res = await request(app)
      .post("/rsvps")
      .send({ user_id: 1, event_id: 2 })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe("RSVP confirmed successfully!")
  })

  it("should return 400 when user_id is missing", async () => {
    const res = await request(app)
      .post("/rsvps")
      .send({ event_id: 2 })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("Missing required user_id or event_id")
  })

  it("should return 400 when event_id is missing", async () => {
    const res = await request(app)
      .post("/rsvps")
      .send({ user_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("Missing required user_id or event_id")
  })

  it("should return 400 on duplicate RSVP", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb({ errno: 1062 }, null)
    })

    const res = await request(app)
      .post("/rsvps")
      .send({ user_id: 1, event_id: 2 })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("You have already RSVP'd for this event!")
  })

  it("should return 500 on general database error", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb({ errno: 9999 }, null)
    })

    const res = await request(app)
      .post("/rsvps")
      .send({ user_id: 1, event_id: 2 })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Failed to process RSVP entry")
  })
})

/*
 * POST /register
 */
describe("POST /register", () => {
  it("should register a new user successfully", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, { insertId: 1 })
    })

    const res = await request(app)
      .post("/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "student",
      })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("User registered successfully")
    expect(db.query).toHaveBeenCalledTimes(1)

    // Verify the password was hashed (not stored as plaintext)
    const callArgs = db.query.mock.calls[0][1]
    expect(callArgs[2]).not.toBe("password123")
    expect(bcrypt.compareSync("password123", callArgs[2])).toBe(true)
  })

  it("should return 500 on database error", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(new Error("DB error"), null)
    })

    const res = await request(app)
      .post("/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "student",
      })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Registration failed")
  })
})

/*
 * POST /events
 */
describe("POST /events", () => {
  it("should create an event successfully", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, { insertId: 1 })
    })

    const res = await request(app)
      .post("/events")
      .send({
        title: "New Event",
        location: "Room 101",
        event_date: "2026-07-01",
        organizer_id: 1,
      })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe("Event created successfully")
  })

  it("should return 500 on database error", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(new Error("DB error"), null)
    })

    const res = await request(app)
      .post("/events")
      .send({
        title: "New Event",
        location: "Room 101",
        event_date: "2026-07-01",
        organizer_id: 1,
      })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Failed to create event")
  })
})

/*
 * POST /login
 */
describe("POST /login", () => {
  const hashedPassword = bcrypt.hashSync("password123", 10)

  it("should login successfully with correct credentials", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "student",
    }

    db.query.mockImplementation((sql, params, cb) => {
      cb(null, [mockUser])
    })

    const res = await request(app)
      .post("/login")
      .send({ email: "john@example.com", password: "password123" })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Login successful")
    expect(res.body.user).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "student",
    })
    // Password should not be returned
    expect(res.body.user.password).toBeUndefined()
  })

  it("should return 404 when user is not found", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(null, [])
    })

    const res = await request(app)
      .post("/login")
      .send({ email: "nonexistent@example.com", password: "password123" })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("User not found")
  })

  it("should return 401 with wrong password", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "student",
    }

    db.query.mockImplementation((sql, params, cb) => {
      cb(null, [mockUser])
    })

    const res = await request(app)
      .post("/login")
      .send({ email: "john@example.com", password: "wrongpassword" })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Invalid password")
  })

  it("should return 500 on database error", async () => {
    db.query.mockImplementation((sql, params, cb) => {
      cb(new Error("DB error"), null)
    })

    const res = await request(app)
      .post("/login")
      .send({ email: "john@example.com", password: "password123" })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe("Login failed")
  })
})
