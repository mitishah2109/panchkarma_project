# feature: dashboard

Role-specific dashboards with stats, charts, and quick actions.

**Owns:** `PatientDashboard`, `PractitionerDashboard`, `AdminDashboard`,
`StatCard`, `ProgressChart` (Recharts), `UpcomingList`, `RecoveryMilestones`.
**Uses:** `@/api/progress.api`, plus appointment / therapy-plan / feedback hooks.
**Rendered by:** `@/pages/DashboardPage` (switches on `user.role`).

Progress data: `GET /progress/me` →
`{ totalSessions, completedSessions, missedSessions, upcomingSessions,
completionRate, upcomingAppointments }`.
