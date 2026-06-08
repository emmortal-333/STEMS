import { Link, useNavigate } from "react-router-dom"

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

function Navbar() {
  // Access the browser router navigation controller
  const navigate = useNavigate()

  // Get user from localStorage
  const user = getStoredUser()

  // Logout function
  const handleLogout = () => {
    // 1. Remove user session from browser storage
    localStorage.removeItem("user")

    // 2. Safely redirect the user back to the home page or login screen
    navigate("/login")

    // 3. Force refresh the application window to clear out internal memory state
    window.location.reload()
  }

  return (
    <nav className="navbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#003366", // University deep blue
      color: "#ffffff"
    }}>
      
      {/* System Logo */}
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          STEMS
        </Link>
      </h2>

      {/* Dynamic Navigation Links Area */}
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>

        {/* CONDITION 1: If user is NOT logged in (Guest Links) */}
        {!user && (
          <>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>
              Register
            </Link>
            <Link to="/login" style={{ 
              color: "#003366", 
              backgroundColor: "#fff", 
              padding: "6px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              fontWeight: "6px"
            }}>
              Login
            </Link>
          </>
        )}

        {/* CONDITION 2: If user IS logged in (Role-Specific Links) */}
        {user && (
          <>
            {/* If logged-in user is a student */}
            {user.role === "student" && (
              <Link to="/student-dashboard" style={{ color: "#fff", textDecoration: "none" }}>
                My Dashboard
              </Link>
            )}

            {/* If logged-in user is an organizer */}
            {user.role === "organizer" && (
              <>
                <Link to="/organizer-dashboard" style={{ color: "#fff", textDecoration: "none" }}>
                  Org Dashboard
                </Link>
                <Link to="/create-event" style={{ color: "#fff", textDecoration: "none" }}>
                  ➕ Create Event
                </Link>
              </>
            )}

            {/* If logged-in user is an admin */}
            {user.role === "admin" && (
              <Link to="/admin-dashboard" style={{ color: "#fff", textDecoration: "none" }}>
                Admin Panel
              </Link>
            )}

            {/* Common Profile Display & Logout for all roles */}
            <span style={{ 
              fontSize: "14px", 
              backgroundColor: "rgba(255,255,255,0.15)", 
              padding: "4px 10px", 
              borderRadius: "4px" 
            }}>
              👤 {user.name} ({user.role})
            </span>

            <button onClick={handleLogout} style={{
              backgroundColor: "#cc0000",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar