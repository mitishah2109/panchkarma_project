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
let appointments = structuredClone(seed.appointments);
let therapyPlans = structuredClone(seed.therapyPlans);
let notifications = structuredClone(seed.notifications);
let preferences = structuredClone(seed.notificationPreferences);

/** Mirrors the backend's ±60-minute window check for a practitioner. */
function hasConflict(practitionerId, scheduledAt, excludeId) {
  const start = new Date(scheduledAt).getTime();
  const WINDOW = 60 * 60 * 1000;
  return appointments.some(
    (a) =>
      a.id !== excludeId &&
      a.practitionerId === practitionerId &&
      a.status !== 'CANCELLED' &&
      Math.abs(new Date(a.scheduledAt).getTime() - start) < WINDOW
  );
}

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

  // ------------- Practitioners -------------
  http.get(url('/practitioners'), () =>
    HttpResponse.json({ practitioners: seed.practitioners })
  ),

  // ------------- Appointments -------------
  http.get(url('/appointments/me'), () => HttpResponse.json({ appointments })),

  http.post(url('/appointments'), async ({ request }) => {
    const body = await request.json();
    if (hasConflict(body.practitionerId, body.scheduledAt)) {
      return HttpResponse.json(
        { message: 'This time slot is not available for the selected practitioner' },
        { status: 409 }
      );
    }
    const appointment = {
      id: `appt-${Date.now()}`,
      patientId: 'u-patient-1',
      status: 'SCHEDULED',
      notes: null,
      createdAt: new Date().toISOString(),
      ...body,
    };
    appointments = [...appointments, appointment];
    return HttpResponse.json({ appointment }, { status: 201 });
  }),

  http.patch(url('/appointments/:id/reschedule'), async ({ params, request }) => {
    const body = await request.json();
    const current = appointments.find((a) => a.id === params.id);
    if (!current) return HttpResponse.json({ message: 'Appointment not found' }, { status: 404 });
    if (hasConflict(current.practitionerId, body.scheduledAt, params.id)) {
      return HttpResponse.json(
        { message: 'This time slot is not available for the selected practitioner' },
        { status: 409 }
      );
    }
    const updated = { ...current, scheduledAt: body.scheduledAt, status: 'RESCHEDULED' };
    appointments = appointments.map((a) => (a.id === params.id ? updated : a));
    return HttpResponse.json({ appointment: updated });
  }),

  http.patch(url('/appointments/:id/cancel'), ({ params }) => {
    const current = appointments.find((a) => a.id === params.id);
    if (!current) return HttpResponse.json({ message: 'Appointment not found' }, { status: 404 });
    const updated = { ...current, status: 'CANCELLED' };
    appointments = appointments.map((a) => (a.id === params.id ? updated : a));
    return HttpResponse.json({ appointment: updated });
  }),

  // ------------- Patients -------------
  http.get(url('/patients'), () => HttpResponse.json({ patients: seed.patients })),

  // ------------- Therapy plans -------------
  http.get(url('/therapy-plans/me'), () => HttpResponse.json({ plans: therapyPlans })),

  http.post(url('/therapy-plans'), async ({ request }) => {
    const body = await request.json();
    const plan = {
      id: `plan-${Date.now()}`,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      description: null,
      sessions: [],
      ...body,
    };
    therapyPlans = [plan, ...therapyPlans];
    return HttpResponse.json({ plan }, { status: 201 });
  }),

  http.post(url('/therapy-plans/:planId/sessions'), async ({ params, request }) => {
    const body = await request.json();
    const plan = therapyPlans.find((p) => p.id === params.planId);
    if (!plan) return HttpResponse.json({ message: 'Therapy plan not found' }, { status: 404 });
    const session = {
      id: `sess-${Date.now()}`,
      therapyPlanId: params.planId,
      status: 'SCHEDULED',
      notes: null,
      ...body,
    };
    plan.sessions = [...plan.sessions, session].sort(
      (a, b) => new Date(a.sessionDate) - new Date(b.sessionDate)
    );
    therapyPlans = [...therapyPlans];
    return HttpResponse.json({ session }, { status: 201 });
  }),

  http.patch(url('/therapy-plans/sessions/:sessionId'), async ({ params, request }) => {
    const body = await request.json();
    let updated = null;
    therapyPlans = therapyPlans.map((p) => ({
      ...p,
      sessions: p.sessions.map((s) => {
        if (s.id !== params.sessionId) return s;
        updated = { ...s, ...body };
        return updated;
      }),
    }));
    if (!updated) return HttpResponse.json({ message: 'Session not found' }, { status: 404 });
    return HttpResponse.json({ session: updated });
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
