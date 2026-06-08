import { Navigate } from "react-router-dom"
import { getUser } from "../utils/auth"

function ProtectedRoute({
  children,
  allowedRole
}) {

  // Get logged-in user
  const user = getUser()

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
