import { useState, useEffect } from "react"

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch events with the user's ID as a query parameter
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/events?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setEvents(data)
          setLoading(false)
        })
    }
  }, [user])

  const handleRSVP = (eventId) => {
    fetch("http://localhost:5000/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, event_id: eventId })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message)
      // Re-fetch events to update the UI button status
      window.location.reload() 
    })
  }

  return (
    <main className="dashboard">
      <h1>Student Dashboard</h1>
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