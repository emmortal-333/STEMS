import { useState } from "react"

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
      const response = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      )

      // Convert response
      const data = await response.json()

      console.log(data)

      // If login successful
      if (response.ok) {

        // Save user in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        )

        setMessage("Login successful")

        // Redirect based on role
if (data.user.role === "student") {

  window.location.href =
    "/student-dashboard"

}

else if (
  data.user.role === "organizer"
) {

  window.location.href =
    "/organizer-dashboard"

}

else if (
  data.user.role === "admin"
) {

  window.location.href =
    "/admin-dashboard"

}

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