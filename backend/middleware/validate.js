const ALLOWED_ROLES = ["student", "organizer"]

function validateRegistration(req, res, next) {
  const { name, email, password, role } = req.body

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" })
  }

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" })
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" })
  }

  if (!role || !ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({
      message: "Role must be one of: " + ALLOWED_ROLES.join(", ")
    })
  }

  req.body.name = name.trim()
  req.body.email = email.trim().toLowerCase()

  next()
}

function validateLogin(req, res, next) {
  const { email, password } = req.body

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ message: "Email is required" })
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ message: "Password is required" })
  }

  req.body.email = email.trim().toLowerCase()

  next()
}

function validateEvent(req, res, next) {
  const { title, location, event_date } = req.body

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({ message: "Event title must be at least 2 characters" })
  }

  if (!location || typeof location !== "string" || location.trim().length < 2) {
    return res.status(400).json({ message: "Location must be at least 2 characters" })
  }

  if (!event_date || isNaN(Date.parse(event_date))) {
    return res.status(400).json({ message: "A valid event date is required" })
  }

  req.body.title = title.trim()
  req.body.location = location.trim()

  next()
}

function validateRsvp(req, res, next) {
  const { event_id } = req.body

  if (!event_id || !Number.isInteger(Number(event_id))) {
    return res.status(400).json({ message: "A valid event_id is required" })
  }

  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateEvent,
  validateRsvp,
  ALLOWED_ROLES
}
