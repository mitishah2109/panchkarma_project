# feature: feedback

Post-session feedback forms: symptoms, side effects, pain level (0–10),
wellness rating (1–10). History view for patients & practitioners.

**Owns:** `FeedbackForm`, `FeedbackHistory`, `PainScale`, `WellnessSlider`.
**Uses:** `@/api/feedback.api`.
**Backend:** `POST /feedback/sessions/:sessionId` (one per session, 409 if
duplicate), `GET /feedback/me`. Patient-only.
