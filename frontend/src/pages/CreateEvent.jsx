import { useState } from "react";
import { apiPost } from "../utils/api";

function CreateEvent() {

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await apiPost("/events", {
        title,
        location,
        event_date: eventDate,
        organizer_id: 1
      });

      alert(data.message);

      setTitle("");
      setLocation("");
      setEventDate("");

    } catch (error) {

      console.log(error);

      alert("Failed to create event");

    }

  };

  return (
    <div className="form-container">

      <h1>Create Event</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <button type="submit">
          Create Event
        </button>

      </form>

    </div>
  );
}

export default CreateEvent;
