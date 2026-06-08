// Import React hooks
import { useEffect, useState } from "react"
import { apiGet } from "../utils/api"
import EventCard from "../components/EventCard"

function Home() {

  // Events state
  const [events, setEvents] = useState([])

  // Load events when page opens
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await apiGet("/events")
        console.log(data)
        setEvents(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchEvents()
  }, [])

  return (
    <main>

      <h1>STEMS Events</h1>

      {/* Events List */}
      <div className="events-container">

        {
          events.map((event) => (

            <EventCard key={event.id} event={event} />

          ))
        }

      </div>

    </main>
  )
}

export default Home
