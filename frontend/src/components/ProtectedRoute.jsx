import { Navigate } from "react-router-dom"

function ProtectedRoute({
  children,
  allowedRole
}) {

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user")
  )

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