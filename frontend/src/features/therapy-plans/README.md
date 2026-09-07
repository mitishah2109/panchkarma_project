# feature: therapy-plans

Personalised therapy plans, session tracking, treatment notes, history.

**Owns:** `PlanList`, `PlanDetail`, `SessionTimeline`, `AddSessionForm`,
`SessionStatusSelect` (SCHEDULED / COMPLETED / MISSED / CANCELLED).
**Uses:** `@/api/therapyPlans.api`.
**Backend:** `GET/POST /therapy-plans`, `POST /therapy-plans/:planId/sessions`,
`PATCH /therapy-plans/sessions/:sessionId`, `GET /therapy-plans/me`.
Practitioner-only for create/edit; patients get read-only.
