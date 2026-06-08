import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import Login from "../Login"

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("renders the login form", () => {
    renderLogin()
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument()
  })

  it("allows typing in email and password fields", async () => {
    const user = userEvent.setup()
    renderLogin()

    const emailInput = screen.getByPlaceholderText("Enter email")
    const passwordInput = screen.getByPlaceholderText("Enter password")

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("password123")
  })

  it("shows error message on failed login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "User not found" }),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText("Enter email"), "bad@example.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "wrong")
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument()
    })
  })

  it("shows error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"))

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText("Enter email"), "test@example.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "pass")
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    })
  })

  it("stores user in localStorage on successful login", async () => {
    const mockUser = { id: 1, name: "John", email: "john@test.com", role: "student" }

    // Mock window.location.href setter
    delete window.location
    window.location = { href: "" }

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Login successful", user: mockUser }),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText("Enter email"), "john@test.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "password123")
    await user.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("user"))
      expect(stored).toEqual(mockUser)
    })
  })
})
