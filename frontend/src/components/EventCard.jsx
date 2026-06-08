function EventCard({ event, children }) {
  return (
    <div key={event.id} className="event-card">

      <h3>{event.title}</h3>

      <p>{event.location}</p>

      {children}

    </div>
  )
}

export default EventCard
