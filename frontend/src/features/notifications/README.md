# feature: notifications

In-app notification centre + channel preferences (email / SMS / in-app).

**Owns:** `NotificationBell`, `NotificationList`, `NotificationItem`,
`PreferencesForm`.
**Uses:** `@/api/notifications.api`.
**Backend:** none yet — served by MSW. Proposed contract:
`GET /notifications`, `PATCH /notifications/:id/read`,
`PATCH /notifications/read-all`, `GET/PUT /notifications/preferences`.
Email/SMS delivery is backend-driven; the UI only shows status + lets the user
set preferences. Swap 60s polling for a socket when `VITE_SOCKET_URL` is live.
