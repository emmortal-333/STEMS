import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import StudentDashboard from "../StudentDashboard"

const originalLocation = window.location

function renderStudentDashboard() {
  return render(
    <MemoryRouter>
      <StudentDashboard />
    </MemoryRouter>
  )
}

describe("StudentDashboard", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Jane", email: "jane@test.com", role: "student" })
    )
    // Mock window.location to prevent real reload
    delete window.location
    window.location = { ...originalLocation, reload: vi.fn() }
  })

  afterEach(() => {
    localStorage.clear()
    window.location = originalLocation
  })

  it("renders the dashboard heading", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ([]),
    })
    renderStudentDashboard()
    expect(screen.getByText("Student Dashboard")).toBeInTheDocument()
  })

  it("shows loading state initially", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}))
    renderStudentDashboard()
    expect(screen.getByText("Loading events...")).toBeInTheDocument()
  })

  it("fetches and displays events with RSVP buttons", async () => {
    const mockEvents = [
      { id: 1, title: "Tech Talk", location: "Room A", is_attending: 0 },
      { id: 2, title: "Workshop", location: "Room B", is_attending: 1 },
    ]

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    })

    renderStudentDashboard()

    await waitFor(() => {
      expect(screen.getByText("Tech Talk")).toBeInTheDocument()
      expect(screen.getByText("Workshop")).toBeInTheDocument()
    })

    expect(screen.getByText("Confirm RSVP")).toBeInTheDocument()
    expect(screen.getByText("Already Attending")).toBeInTheDocument()
  })

  it("disables 'Already Attending' button", async () => {
    const mockEvents = [
      { id: 1, title: "Workshop", location: "Room B", is_attending: 1 },
    ]

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    })

    renderStudentDashboard()

    await waitFor(() => {
      expect(screen.getByText("Already Attending")).toBeInTheDocument()
    })

    expect(screen.getByText("Already Attending")).toBeDisabled()
  })

  it("sends RSVP request when clicking Confirm RSVP", async () => {
    const mockEvents = [
      { id: 5, title: "Seminar", location: "Hall", is_attending: 0 },
    ]

    const fetchSpy = vi.spyOn(globalThis, "fetch")

    // First call: fetch events
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    })
    // Second call (from useEffect re-run): fetch events again
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    })
    // Third call: RSVP POST
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "RSVP confirmed successfully!" }),
    })

    vi.spyOn(window, "alert").mockImplementation(() => {})

    const user = userEvent.setup()
    renderStudentDashboard()

    await waitFor(() => {
      expect(screen.getByText("Confirm RSVP")).toBeInTheDocument()
    })

    await user.click(screen.getByText("Confirm RSVP"))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("RSVP confirmed successfully!")
    })

    expect(window.location.reload).toHaveBeenCalled()
  })
})
