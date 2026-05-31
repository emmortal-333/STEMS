// React Router imports
import { BrowserRouter, Routes, Route } from "react-router-dom"


// Pages
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import StudentDashboard from "./pages/StudentDashboard"
import OrganizerDashboard from "./pages/OrganizerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import CreateEvent from "./pages/CreateEvent"


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        <Route
  path="/student-dashboard"
  element={
    <ProtectedRoute
      allowedRole="student"
    >
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

        <Route
  path="/organizer-dashboard"
  element={
    <ProtectedRoute
      allowedRole="organizer"
    >
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>
       <Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute
      allowedRole="admin"
    >
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
      <Route
  path="/create-event"
  element={<CreateEvent />}
/>
      </Routes>

    </BrowserRouter>
  )
}

export default App