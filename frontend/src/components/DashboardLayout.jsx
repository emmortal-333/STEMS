import { getUser } from "../utils/auth"

function DashboardLayout({ title, children }) {
  const user = getUser()

  return (
    <main className="dashboard">

      <h1>{title}</h1>

      <p>
        Welcome {user.name}
      </p>

      <p>
        Role: {user.role}
      </p>

      {children}

    </main>
  )
}

export default DashboardLayout
