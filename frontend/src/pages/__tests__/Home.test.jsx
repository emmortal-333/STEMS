import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, vi } from "vitest"
import Home from "../Home"

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe("Home", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the page heading", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    })
    renderHome()
    expect(screen.getByText("STEMS Events")).toBeInTheDocument()
  })

  it("fetches and displays events", async () => {
    const mockEvents = [
      { id: 1, title: "Tech Conference", location: "KCA Main Hall" },
      { id: 2, title: "Cybersecurity Workshop", location: "Lab 3" },
    ]

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    })

    renderHome()

    await waitFor(() => {
      expect(screen.getByText("Tech Conference")).toBeInTheDocument()
      expect(screen.getByText("KCA Main Hall")).toBeInTheDocument()
      expect(screen.getByText("Cybersecurity Workshop")).toBeInTheDocument()
      expect(screen.getByText("Lab 3")).toBeInTheDocument()
    })
  })

  it("handles fetch error gracefully", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"))

    renderHome()

    // Should still render the heading without crashing
    expect(screen.getByText("STEMS Events")).toBeInTheDocument()
  })

  it("renders empty events list when no events", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    })

    renderHome()

    await waitFor(() => {
      expect(screen.getByText("STEMS Events")).toBeInTheDocument()
    })

    // No event cards should be rendered
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument()
  })
})
