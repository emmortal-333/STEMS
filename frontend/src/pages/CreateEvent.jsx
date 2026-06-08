import { useState } from "react";
import axios from "axios";

function CreateEvent() {

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:5000/events",
        {
          title,
          location,
          event_date: eventDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

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