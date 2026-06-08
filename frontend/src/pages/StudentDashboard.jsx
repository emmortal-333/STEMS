import { useState, useEffect } from "react"

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

function StudentDashboard() {
  const [user] = useState(() => getStoredUser())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(() => getStoredUser() !== null)
  const [error, setError] = useState("")

  // Fetch events with the user's ID as a query parameter
  useEffect(() => {
    if (!user) {
      return
    }

    let cancelled = false

    fetch(`http://localhost:5000/events?userId=${user.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load events")
        }
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setEvents(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err)
        if (!cancelled) {
          setError("Could not load events. Please try again later.")
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [user])

  const handleRSVP = (eventId) => {
    fetch("http://localhost:5000/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, event_id: eventId })
    })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      alert(data.message)
      if (ok) {
        window.location.reload()
      }
    })
    .catch((err) => {
      console.error("RSVP failed:", err)
      alert("Could not process RSVP. Please try again later.")
    })
  }

  return (
    <main className="dashboard">
      <h1>Student Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading events...</p> : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>📍 Location: {event.location}</p>
              
              {/* Conditional Rendering: If is_attending is 1, show "Already Attending" */}
              {event.is_attending === 1 ? (
                <button disabled style={{ backgroundColor: "#6c757d" }}>
                  Already Attending
                </button>
              ) : (
                <button onClick={() => handleRSVP(event.id)}>
                  Confirm RSVP
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default StudentDashboard