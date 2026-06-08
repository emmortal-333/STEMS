import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import AdminDashboard from "../AdminDashboard"

describe("AdminDashboard", () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Admin User", role: "admin" })
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("renders the admin dashboard heading", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument()
  })

  it("displays the admin user name", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText(/Admin User/)).toBeInTheDocument()
  })

  it("displays the admin role", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText(/admin/)).toBeInTheDocument()
  })
})
