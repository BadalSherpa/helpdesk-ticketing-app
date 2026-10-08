const tickets = [
  {
    id: "TKT-1001",
    subject: "Login fails with SSO redirect loop",
    description:
      "Users on the Okta SSO flow get bounced between the IdP and the app and never land on the dashboard.",
    priority: "urgent",
    status: "open",
    assignee: "Priya",
    createdAt: "2026-06-01T09:12:00.000Z",
  },
  {
    id: "TKT-1002",
    subject: "Invoice PDF shows wrong tax total",
    description:
      "Generated invoices apply 18% GST instead of the customer's regional 5% rate.",
    priority: "high",
    status: "in_progress",
    assignee: "Marcus",
    createdAt: "2026-06-01T14:40:00.000Z",
  },
  {
    id: "TKT-1003",
    subject: "Dashboard charts not loading on Safari",
    description:
      "Charts render blank on Safari 17; console shows a ResizeObserver error.",
    priority: "medium",
    status: "open",
    assignee: "Lena",
    createdAt: "2026-06-02T08:05:00.000Z",
  },
  {
    id: "TKT-1004",
    subject: "API returns 500 on bulk export",
    description:
      "POST /export with more than 1000 rows times out and returns a 500.",
    priority: "high",
    status: "open",
    assignee: "Diego",
    createdAt: "2026-06-02T11:30:00.000Z",
  },
  {
    id: "TKT-1005",
    subject: "Mobile app crashes on cold start",
    description:
      "Android release build crashes on first launch after install; works after a restart.",
    priority: "urgent",
    status: "in_progress",
    assignee: "Aisha",
    createdAt: "2026-06-02T17:55:00.000Z",
  },
  {
    id: "TKT-1006",
    subject: "Password reset email never arrives",
    description:
      "Reset emails are not delivered to Outlook addresses; suspected SPF/DKIM issue.",
    priority: "high",
    status: "resolved",
    assignee: "Priya",
    createdAt: "2026-06-03T07:20:00.000Z",
  },
  {
    id: "TKT-1007",
    subject: "Webhook retries duplicate events",
    description:
      "Failed webhook deliveries are retried but downstream receives duplicate event IDs.",
    priority: "medium",
    status: "open",
    assignee: null,
    createdAt: "2026-06-03T13:10:00.000Z",
  },
  {
    id: "TKT-1008",
    subject: "Search ignores special characters",
    description:
      "Searching for terms with '+' or '#' returns no results even when matches exist.",
    priority: "low",
    status: "open",
    assignee: "Marcus",
    createdAt: "2026-06-03T16:45:00.000Z",
  },
  {
    id: "TKT-1009",
    subject: "Slow query on reports page",
    description:
      "The monthly report page takes 12+ seconds to load for large accounts.",
    priority: "high",
    status: "in_progress",
    assignee: "Lena",
    createdAt: "2026-06-04T09:35:00.000Z",
  },
  {
    id: "TKT-1010",
    subject: "User cannot upload avatar over 2MB",
    description:
      "Avatar upload silently fails for files larger than 2MB with no error shown.",
    priority: "low",
    status: "closed",
    assignee: "Diego",
    createdAt: "2026-06-04T12:00:00.000Z",
  },
  {
    id: "TKT-1011",
    subject: "Dark mode toggle resets on reload",
    description:
      "Theme preference is not persisted; the app reverts to light mode after refresh.",
    priority: "low",
    status: "resolved",
    assignee: "Aisha",
    createdAt: "2026-06-05T10:15:00.000Z",
  },
  {
    id: "TKT-1012",
    subject: "Rate limit too aggressive for partners",
    description:
      "Partner API keys hit the 60 req/min limit during normal sync operations.",
    priority: "medium",
    status: "open",
    assignee: "Priya",
    createdAt: "2026-06-05T15:25:00.000Z",
  },
  {
    id: "TKT-1013",
    subject: "CSV import drops trailing rows",
    description:
      "Importing a CSV without a trailing newline skips the final data row.",
    priority: "medium",
    status: "in_progress",
    assignee: null,
    createdAt: "2026-06-06T08:50:00.000Z",
  },
  {
    id: "TKT-1014",
    subject: "Notifications delayed by ~10 minutes",
    description:
      "In-app notifications arrive roughly 10 minutes late during peak hours.",
    priority: "high",
    status: "open",
    assignee: "Marcus",
    createdAt: "2026-06-06T18:05:00.000Z",
  },
  {
    id: "TKT-1015",
    subject: "Two-factor codes rejected intermittently",
    description:
      "Valid TOTP codes are occasionally rejected; likely server clock drift.",
    priority: "urgent",
    status: "closed",
    assignee: "Lena",
    createdAt: "2026-06-07T11:40:00.000Z",
  },
];

module.exports = tickets;