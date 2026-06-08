import { Navigate } from "react-router-dom"

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

function OrganizerDashboard() {

  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (

    <main className="dashboard">

      <h1>Organizer Dashboard</h1>

      <p>
        Welcome {user.name}
      </p>

      <p>
        Role: {user.role}
      </p>

    </main>

  )
}

export default OrganizerDashboard