const USER_STORAGE_KEY = "user"

export function getUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function removeUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
}
