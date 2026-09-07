# feature: appointments

Book / reschedule / cancel appointments, calendar + list views, conflict handling.

**Owns:** `AppointmentCalendar`, `AppointmentList`, `BookAppointmentForm`,
`RescheduleModal`, `StatusPill`.
**Uses:** `@/api/appointments.api`.
**Backend:** `GET/POST /appointments`, `PATCH /appointments/:id/reschedule|cancel`,
`GET /appointments/me`. Backend rejects slots within 60 min of an existing
booking for that practitioner (409) — surface that message inline.
