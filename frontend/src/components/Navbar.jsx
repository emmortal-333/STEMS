// Import Link from React Router
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <h1>STEMS</h1>

      {/* Navigation Links */}
      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>

      </div>

    </nav>
  )
}

export default Navbar