export const API_BASE_URL = "http://localhost:5000"

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  return response.json()
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return { response, data }
}
