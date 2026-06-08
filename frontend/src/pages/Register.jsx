// Import React state hook
import { useState } from "react"
import { apiPost } from "../utils/api"

function Register() {

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")

  // Success message state
  const [message, setMessage] = useState("")

  // Handle registration
  const handleRegister = async (event) => {

    // Prevent page refresh
    event.preventDefault()

    try {

      // Send POST request to backend
      const { data } = await apiPost("/register", {
        name,
        email,
        password,
        role
      })

      console.log(data)

      // Show success message
      setMessage(data.message)

    } catch (error) {

      console.log(error)

      setMessage("Something went wrong")

    }

  }

  return (
    <main>

      <h2>Create Account</h2>

      {/* Success message */}
      <p>{message}</p>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="form-container">

        {/* Full Name */}
        <input
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {/* Role Selection */}
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >

          <option value="student">
            Student
          </option>

          <option value="organizer">
            Organizer
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        {/* Submit Button */}
        <button type="submit">
          Register
        </button>

      </form>

    </main>
  )
}

export default Register
