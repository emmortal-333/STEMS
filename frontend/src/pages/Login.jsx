// Import React state hook
import { useState } from "react"

function Login() {

  // State variables
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Handle form submission
  const handleLogin = (event) => {

    // Prevent page refresh
    event.preventDefault()

    // Temporary console output
    console.log("Email:", email)
    console.log("Password:", password)

    alert("Login submitted!")
  }

  return (
    <main>

      <h2>Login Page</h2>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="form-container">

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {/* Submit Button */}
        <button type="submit">
          Login
        </button>

      </form>

    </main>
  )
}

export default Login