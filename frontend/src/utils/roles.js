export const ROLE_DASHBOARD_PATHS = {
  student: "/student-dashboard",
  organizer: "/organizer-dashboard",
  admin: "/admin-dashboard",
}

export function getDashboardPath(role) {
  return ROLE_DASHBOARD_PATHS[role] || "/"
}
