// Import React state hook
import { useState } from "react"

function Register() {

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")

  // Handle form submission
  const handleRegister = (event) => {

    // Prevent page refresh
    event.preventDefault()

    // Display form data
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("Role:", role)

    alert("Registration submitted!")
  }

  return (
    <main>

      <h2>Create Account</h2>

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