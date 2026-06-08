import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import OrganizerDashboard from "../OrganizerDashboard"

describe("OrganizerDashboard", () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Org User", role: "organizer" })
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("renders the organizer dashboard heading", () => {
    render(
      <MemoryRouter>
        <OrganizerDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText("Organizer Dashboard")).toBeInTheDocument()
  })

  it("displays the organizer user name", () => {
    render(
      <MemoryRouter>
        <OrganizerDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText(/Org User/)).toBeInTheDocument()
  })

  it("displays the organizer role", () => {
    render(
      <MemoryRouter>
        <OrganizerDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText(/organizer/)).toBeInTheDocument()
  })
})
