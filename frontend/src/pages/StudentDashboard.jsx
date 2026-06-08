import { useState, useEffect } from "react"
import { getUser } from "../utils/auth"
import { apiGet, apiPost } from "../utils/api"
import EventCard from "../components/EventCard"

function StudentDashboard() {
  const user = getUser()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch events with the user's ID as a query parameter
  useEffect(() => {
    if (user) {
      apiGet(`/events?userId=${user.id}`)
        .then((data) => {
          setEvents(data)
          setLoading(false)
        })
    }
  }, [user])

  const handleRSVP = async (eventId) => {
    try {
      const { data } = await apiPost("/rsvps", {
        user_id: user.id,
        event_id: eventId
      })
      alert(data.message)
      // Re-fetch events to update the UI button status
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="dashboard">
      <h1>Student Dashboard</h1>
      {loading ? <p>Loading events...</p> : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event}>
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
            </EventCard>
          ))}
        </div>
      )}
    </main>
  )
}

export default StudentDashboard
