import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, vi } from "vitest"
import CreateEvent from "../CreateEvent"

// Mock axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}))

import axios from "axios"

function renderCreateEvent() {
  return render(
    <MemoryRouter>
      <CreateEvent />
    </MemoryRouter>
  )
}

describe("CreateEvent", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(window, "alert").mockImplementation(() => {})
  })

  it("renders the create event form", () => {
    renderCreateEvent()
    expect(screen.getByRole("heading", { name: /create event/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Event Title")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create event/i })).toBeInTheDocument()
  })

  it("allows typing in form fields", async () => {
    const user = userEvent.setup()
    renderCreateEvent()

    await user.type(screen.getByPlaceholderText("Event Title"), "Tech Talk")
    await user.type(screen.getByPlaceholderText("Location"), "Room 101")

    expect(screen.getByPlaceholderText("Event Title")).toHaveValue("Tech Talk")
    expect(screen.getByPlaceholderText("Location")).toHaveValue("Room 101")
  })

  it("submits form data and clears fields on success", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Event created successfully" },
    })

    const user = userEvent.setup()
    renderCreateEvent()

    await user.type(screen.getByPlaceholderText("Event Title"), "Tech Talk")
    await user.type(screen.getByPlaceholderText("Location"), "Room 101")

    // Fill date field
    const dateInput = document.querySelector('input[type="date"]')
    await user.type(dateInput, "2026-07-01")

    await user.click(screen.getByRole("button", { name: /create event/i }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/events",
        expect.objectContaining({
          title: "Tech Talk",
          location: "Room 101",
          organizer_id: 1,
        })
      )
    })

    // Fields should be cleared after success
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Event Title")).toHaveValue("")
      expect(screen.getByPlaceholderText("Location")).toHaveValue("")
    })
  })

  it("shows alert on submission failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Server error"))

    const user = userEvent.setup()
    renderCreateEvent()

    await user.type(screen.getByPlaceholderText("Event Title"), "Tech Talk")
    await user.type(screen.getByPlaceholderText("Location"), "Room 101")

    const dateInput = document.querySelector('input[type="date"]')
    await user.type(dateInput, "2026-07-01")

    await user.click(screen.getByRole("button", { name: /create event/i }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to create event")
    })
  })
})
