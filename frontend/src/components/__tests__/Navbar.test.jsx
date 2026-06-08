import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import Navbar from "../Navbar"

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("renders the STEMS logo link", () => {
    renderNavbar()
    expect(screen.getByText("STEMS")).toBeInTheDocument()
  })

  it("shows Home link always", () => {
    renderNavbar()
    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  it("shows Register and Login links when no user is logged in", () => {
    renderNavbar()
    expect(screen.getByText("Register")).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("hides Register and Login when user is logged in", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Jane", role: "student" })
    )
    renderNavbar()
    expect(screen.queryByText("Register")).not.toBeInTheDocument()
    expect(screen.queryByText("Login")).not.toBeInTheDocument()
  })

  it("shows student dashboard link for student role", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Jane", role: "student" })
    )
    renderNavbar()
    expect(screen.getByText("My Dashboard")).toBeInTheDocument()
  })

  it("shows organizer dashboard and create event links for organizer role", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Org", role: "organizer" })
    )
    renderNavbar()
    expect(screen.getByText("Org Dashboard")).toBeInTheDocument()
  })

  it("shows admin panel link for admin role", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Admin", role: "admin" })
    )
    renderNavbar()
    expect(screen.getByText("Admin Panel")).toBeInTheDocument()
  })

  it("shows user name and role when logged in", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Jane Doe", role: "student" })
    )
    renderNavbar()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/student/)).toBeInTheDocument()
  })

  it("shows logout button when user is logged in", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Jane", role: "student" })
    )
    renderNavbar()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })
})
