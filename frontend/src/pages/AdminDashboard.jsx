function AdminDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <main className="dashboard">

      <h1>Admin Dashboard</h1>

      <p>
        Welcome {user.name}
      </p>

      <p>
        Role: {user.role}
      </p>

    </main>

  )
}

export default AdminDashboard