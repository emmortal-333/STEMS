import { useState } from "react"
import { apiPost } from "../utils/api"
import { saveUser } from "../utils/auth"
import { getDashboardPath } from "../utils/roles"

function Login() {

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Message state
  const [message, setMessage] = useState("")

  // Handle login
  const handleLogin = async (event) => {

    // Prevent page refresh
    event.preventDefault()

    try {

      // Send login request
      const { response, data } = await apiPost("/login", {
        email,
        password
      })

      console.log(data)

      // If login successful
      if (response.ok) {

        // Save user in localStorage
        saveUser(data.user)

        setMessage("Login successful")

        // Redirect based on role
        window.location.href = getDashboardPath(data.user.role)

      } else {

        setMessage(data.message)

      }

    } catch (error) {

      console.log(error)

      setMessage("Something went wrong")

    }

  }

  return (
    <main>

      <h2>Login</h2>

      {/* Message */}
      <p>{message}</p>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="form-container"
      >

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        {/* Login button */}
        <button type="submit">
          Login
        </button>

      </form>

    </main>
  )
}

export default Login
