function OrganizerDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

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