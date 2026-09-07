# feature: auth

Login & registration UI, role-based redirect after auth.

**Owns:** `LoginForm`, `RegisterForm`, `RoleBadge`, validation schemas.
**Uses:** `@/api/auth.api` (`useLogin`, `useRegister`), `@/store/authStore`.
**Routes:** `/login`, `/register` (see `@/routes/AppRoutes`).

Backend contract: `docs/api-contract.md` → Auth section. Register returns `{ user }`
only (no token) — redirect to `/login` after success.
