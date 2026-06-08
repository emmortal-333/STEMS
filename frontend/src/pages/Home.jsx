// Import React hooks
import { useEffect, useState } from "react"

function Home() {

  // Events state
  const [events, setEvents] = useState([])
  const [error, setError] = useState("")

  // Load events when page opens
  useEffect(() => {

    const fetchEvents = async () => {

      try {

        // Send GET request
        const response = await fetch(
          "http://localhost:5000/events"
        )

        // Check for server errors
        if (!response.ok) {
          const data = await response.json()
          setError(data.message || "Failed to load events")
          return
        }

        // Convert response to JSON
        const data = await response.json()

        // Save events in state
        setEvents(data)

      } catch (error) {

        console.error("Failed to fetch events:", error)
        setError("Could not connect to server. Please try again later.")

      }

    }

    fetchEvents()

  }, [])

  return (
    <main>

      <h1>STEMS Events</h1>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Events List */}
      <div className="events-container">

        {
          events.map((event) => (

            <div key={event.id} className="event-card">

              <h3>{event.title}</h3>

              <p>{event.location}</p>

            </div>

          ))
        }

      </div>

    </main>
  )
}

export default Home