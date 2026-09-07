# Panchakarma Management System — Frontend

React + Vite SPA for the Panchakarma clinic platform (patient booking, therapy
scheduling, treatment tracking, notifications, progress, feedback, consultations,
and role-based dashboards for Patient / Practitioner / Admin).

## Tech stack

| Concern | Choice |
|---|---|
| Build / dev server | Vite 6 |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config in `src/index.css`, no `tailwind.config.js`) |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Client/auth state | Zustand (persisted to `localStorage`) |
| HTTP | Axios (`src/api/client.js`) |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| API mocking | Mock Service Worker (MSW) |

## Getting started

```bash
cd frontend
npm install

# one-time: generate the MSW service worker into public/
npm run mock:init

# copy env defaults (already contains working local values)
cp .env.example .env

npm run dev
```

Dev server: http://localhost:5173

### Scripts

| Script | Does |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run mock:init` | Regenerate `public/mockServiceWorker.js` (needed once after install) |

## Environment variables

Set in `.env` (see `.env.example`):

| Var | Meaning |
|---|---|
| `VITE_API_BASE_URL` | Backend REST base, **including** `/api` (e.g. `http://localhost:5000/api`) |
| `VITE_SOCKET_URL` | Realtime server base (notifications, consult signaling) |
| `VITE_USE_MOCKS` | `true` → MSW intercepts all API calls with fixture data. `false` → hit the real backend. This is the only switch. |

## Working with mocks

While `VITE_USE_MOCKS=true`, every request is served by
`src/mocks/handlers.js` from the seed data in `src/mocks/data/fixtures.js`.

Demo logins (any password works in the mock):

| Email | Role |
|---|---|
| `patient@demo.com` | PATIENT |
| `practitioner@demo.com` | PRACTITIONER |
| `admin@demo.com` | ADMIN |

Feature code never references mocks — it calls hooks like `useMyAppointments()`.
Flipping `VITE_USE_MOCKS` to `false` points those same calls at the real API with
no code changes. Keep mock response shapes in sync with `docs/api-contract.md`
(repo root).

## Project structure

```
src/
├── api/            # axios client + one file per domain (raw fns + react-query hooks)
├── components/
│   ├── common/     # Button, Input, Card, Modal, Loader
│   └── layout/     # Navbar, Sidebar, DashboardShell
├── features/       # one folder per feature (auth, appointments, therapy-plans,
│                   #   notifications, feedback, video-consult, dashboard)
├── pages/          # route-level pages composing features
├── routes/         # AppRoutes.jsx, ProtectedRoute.jsx (role-based guard)
├── store/          # zustand slices (authStore, uiStore)
├── hooks/
├── lib/            # constants, formatters, utils
├── mocks/          # MSW worker, handlers, fixture data
├── App.jsx
└── main.jsx        # providers + conditional MSW bootstrap
```

## Auth model

- Login response `{ user, accessToken, refreshToken }` is stored in `authStore`
  (persisted). `user` here is the login-response object — not the `/auth/me`
  payload (which is only `{ id, role, iat, exp }`).
- Axios attaches `Authorization: Bearer <accessToken>` to every request.
- No `/auth/refresh` endpoint yet: a `401` on an authenticated request clears the
  session and redirects to `/login`.
- `ProtectedRoute` gates routes; pass `allowedRoles={['ADMIN']}` to restrict.

## Routes (current)

| Path | Access | Notes |
|---|---|---|
| `/login`, `/register` | public only | redirect to `/dashboard` if already signed in |
| `/dashboard` | authenticated | renders a role-specific view |
| `*` | — | 404 |

Feature routes (`/appointments`, `/therapy-plans`, …) are defined in
`src/lib/constants.js` and get wired into `AppRoutes.jsx` as each feature lands.
