import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach, vi } from "vitest"
import Register from "../Register"

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe("Register", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the registration form", () => {
    renderRegister()
    expect(screen.getByText("Create Account")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter full name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument()
  })

  it("allows typing in form fields", async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText("Enter full name"), "Jane Doe")
    await user.type(screen.getByPlaceholderText("Enter email"), "jane@test.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "password123")

    expect(screen.getByPlaceholderText("Enter full name")).toHaveValue("Jane Doe")
    expect(screen.getByPlaceholderText("Enter email")).toHaveValue("jane@test.com")
    expect(screen.getByPlaceholderText("Enter password")).toHaveValue("password123")
  })

  it("defaults role to student", () => {
    renderRegister()
    expect(screen.getByRole("combobox")).toHaveValue("student")
  })

  it("allows changing role", async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.selectOptions(screen.getByRole("combobox"), "organizer")
    expect(screen.getByRole("combobox")).toHaveValue("organizer")

    await user.selectOptions(screen.getByRole("combobox"), "admin")
    expect(screen.getByRole("combobox")).toHaveValue("admin")
  })

  it("shows success message after successful registration", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    })

    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText("Enter full name"), "Jane")
    await user.type(screen.getByPlaceholderText("Enter email"), "jane@test.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "pass123")
    await user.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText("User registered successfully")).toBeInTheDocument()
    })
  })

  it("shows error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"))

    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText("Enter full name"), "Jane")
    await user.type(screen.getByPlaceholderText("Enter email"), "jane@test.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "pass123")
    await user.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    })
  })

  it("sends correct data to the backend", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    })

    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByPlaceholderText("Enter full name"), "Jane Doe")
    await user.type(screen.getByPlaceholderText("Enter email"), "jane@test.com")
    await user.type(screen.getByPlaceholderText("Enter password"), "pass123")
    await user.selectOptions(screen.getByRole("combobox"), "organizer")
    await user.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://localhost:5000/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Jane Doe",
            email: "jane@test.com",
            password: "pass123",
            role: "organizer",
          }),
        })
      )
    })
  })
})
