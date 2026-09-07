import { http, HttpResponse } from 'msw';
import * as seed from './data/fixtures';

/**
 * MSW request handlers.
 *
 * Base URL is derived from VITE_API_BASE_URL so these match whatever the axios
 * client sends. State is in-memory (module scope) and resets on page reload.
 * This is a stand-in for the real API — mirror any shape changes into
 * docs/api-contract.md.
 */
const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';
const url = (path) => `${API}${path}`;

// Mock users persist to localStorage so accounts registered in the mock survive
// a page reload. Clear with: localStorage.removeItem('pk.mock.users')
const USERS_KEY = 'pk.mock.users';

function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {
    /* ignore malformed storage */
  }
  return structuredClone(seed.users);
}

function saveUsers() {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable — fall back to in-memory only */
  }
}

let users = loadUsers();

// these reset on reload — fine for a mock
let notifications = structuredClone(seed.notifications);
let preferences = structuredClone(seed.notificationPreferences);

const fakeJwt = (sub) =>
  `mock.${btoa(JSON.stringify({ id: sub, iat: Date.now() }))}.sig`;

export const handlers = [
  // ---------------- Auth ----------------
  http.post(url('/auth/register'), async ({ request }) => {
    const body = await request.json();
    const exists = users.some((u) => u.email === body.email);
    if (exists) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    const user = {
      id: `u-${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers();
    return HttpResponse.json({ user }, { status: 201 });
  }),

  http.post(url('/auth/login'), async ({ request }) => {
    // NOTE: the mock does not verify passwords — any password logs you in as
    // long as the email exists (seeded or registered this session).
    const { email } = await request.json();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    return HttpResponse.json({
      user,
      accessToken: fakeJwt(user.id),
      refreshToken: fakeJwt(user.id),
    });
  }),

  http.get(url('/auth/me'), ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'No token provided' }, { status: 401 });
    // In the mock we can't decode the real user; return the first user by default.
    const user = users[0];
    return HttpResponse.json({
      user: { id: user.id, role: user.role, iat: 0, exp: 0 },
    });
  }),

  // ------------- Appointments -------------
  http.get(url('/appointments/me'), () =>
    HttpResponse.json({ appointments: seed.appointments })
  ),
  http.post(url('/appointments'), async ({ request }) => {
    const body = await request.json();
    const appointment = {
      id: `appt-${Date.now()}`,
      patientId: 'u-patient-1',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      ...body,
    };
    return HttpResponse.json({ appointment }, { status: 201 });
  }),
  http.patch(url('/appointments/:id/reschedule'), async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      appointment: { id: params.id, status: 'RESCHEDULED', ...body },
    });
  }),
  http.patch(url('/appointments/:id/cancel'), ({ params }) =>
    HttpResponse.json({ appointment: { id: params.id, status: 'CANCELLED' } })
  ),

  // ------------- Therapy plans -------------
  http.get(url('/therapy-plans/me'), () =>
    HttpResponse.json({ plans: seed.therapyPlans })
  ),
  http.post(url('/therapy-plans'), async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        plan: {
          id: `plan-${Date.now()}`,
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          sessions: [],
          ...body,
        },
      },
      { status: 201 }
    );
  }),
  http.post(url('/therapy-plans/:planId/sessions'), async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        session: {
          id: `sess-${Date.now()}`,
          therapyPlanId: params.planId,
          status: 'SCHEDULED',
          ...body,
        },
      },
      { status: 201 }
    );
  }),
  http.patch(url('/therapy-plans/sessions/:sessionId'), async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ session: { id: params.sessionId, ...body } });
  }),

  // --------------- Feedback ---------------
  http.get(url('/feedback/me'), () => HttpResponse.json({ feedback: seed.feedback })),
  http.post(url('/feedback/sessions/:sessionId'), async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        feedback: {
          id: `fb-${Date.now()}`,
          sessionId: params.sessionId,
          createdAt: new Date().toISOString(),
          ...body,
        },
      },
      { status: 201 }
    );
  }),

  // --------------- Progress ---------------
  http.get(url('/progress/me'), () => HttpResponse.json({ progress: seed.progress })),

  // ------------- Notifications -------------
  http.get(url('/notifications'), () => HttpResponse.json({ notifications })),
  http.patch(url('/notifications/read-all'), () => {
    notifications = notifications.map((n) => ({ ...n, isRead: true }));
    return HttpResponse.json({ notifications });
  }),
  http.patch(url('/notifications/:id/read'), ({ params }) => {
    notifications = notifications.map((n) =>
      n.id === params.id ? { ...n, isRead: true } : n
    );
    return HttpResponse.json({ notification: notifications.find((n) => n.id === params.id) });
  }),
  http.get(url('/notifications/preferences'), () => HttpResponse.json({ preferences })),
  http.put(url('/notifications/preferences'), async ({ request }) => {
    preferences = { ...preferences, ...(await request.json()) };
    return HttpResponse.json({ preferences });
  }),

  // ------------- Video consult -------------
  http.get(url('/consult/sessions'), () =>
    HttpResponse.json({ sessions: seed.consultSessions })
  ),
  http.post(url('/consult/sessions'), async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { session: { id: `consult-${Date.now()}`, status: 'SCHEDULED', ...body } },
      { status: 201 }
    );
  }),
  http.get(url('/consult/sessions/:id/token'), ({ params }) =>
    HttpResponse.json({ token: `mock-consult-token-${params.id}`, roomName: `pk-room-${params.id}` })
  ),
];
