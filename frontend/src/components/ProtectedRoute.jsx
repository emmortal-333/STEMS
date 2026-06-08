import { Navigate } from "react-router-dom"

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

function ProtectedRoute({
  children,
  allowedRole
}) {

  // Get logged-in user
  const user = getStoredUser()

  // User not logged in
  if (!user) {

    return <Navigate to="/login" />

  }

  // Wrong role
  if (user.role !== allowedRole) {

    return <Navigate to="/" />

  }

  // Access granted
  return children
}

export default ProtectedRoute