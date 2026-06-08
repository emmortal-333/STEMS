import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import ProtectedRoute from "../ProtectedRoute"

function renderWithRouter(ui, { route = "/" } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("redirects to /login when no user is logged in", () => {
    renderWithRouter(
      <ProtectedRoute allowedRole="student">
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("redirects to / when user role does not match", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "John", role: "organizer" })
    )
    renderWithRouter(
      <ProtectedRoute allowedRole="student">
        <div>Student Only</div>
      </ProtectedRoute>
    )
    expect(screen.queryByText("Student Only")).not.toBeInTheDocument()
  })

  it("renders children when user role matches", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "John", role: "student" })
    )
    renderWithRouter(
      <ProtectedRoute allowedRole="student">
        <div>Student Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText("Student Content")).toBeInTheDocument()
  })

  it("renders children for admin role", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Admin", role: "admin" })
    )
    renderWithRouter(
      <ProtectedRoute allowedRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    )
    expect(screen.getByText("Admin Content")).toBeInTheDocument()
  })
})
