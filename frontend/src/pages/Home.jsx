// Import React hooks
import { useEffect, useState } from "react"

function Home() {

  // Events state
  const [events, setEvents] = useState([])

  // Load events when page opens
  useEffect(() => {

    // Fetch events from backend
    fetchEvents()

  }, [])

  // Function to fetch events
  const fetchEvents = async () => {

    try {

      // Send GET request
      const response = await fetch(
        "http://localhost:5000/events"
      )

      // Convert response to JSON
      const data = await response.json()

      console.log(data)

      // Save events in state
      setEvents(data)

    } catch (error) {

      console.log(error)

    }

  }

  return (
    <main>

      <h1>STEMS Events</h1>

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