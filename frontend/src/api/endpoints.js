/**
 * Every backend path in one place. Paths are relative to VITE_API_BASE_URL
 * (which already includes the `/api` prefix).
 *
 * Legend:
 *   [live]   backend route exists today
 *   [mock]   no backend yet — shape is our best guess, served by MSW
 */
export const ENDPOINTS = {
  // ---- Auth [live] ----
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
  },

  // ---- Appointments [live] ----
  appointments: {
    root: '/appointments',
    mine: '/appointments/me',
    reschedule: (id) => `/appointments/${id}/reschedule`,
    cancel: (id) => `/appointments/${id}/cancel`,
  },

  // ---- Therapy plans [live] ----
  therapyPlans: {
    root: '/therapy-plans',
    mine: '/therapy-plans/me',
    sessions: (planId) => `/therapy-plans/${planId}/sessions`,
    session: (sessionId) => `/therapy-plans/sessions/${sessionId}`,
  },

  // ---- Feedback [live] ----
  feedback: {
    mine: '/feedback/me',
    forSession: (sessionId) => `/feedback/sessions/${sessionId}`,
  },

  // ---- Progress [live] ----
  progress: {
    mine: '/progress/me',
  },

  // ---- Notifications [mock] ----
  notifications: {
    root: '/notifications',
    read: (id) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },

  // ---- Video / voice consult [mock] ----
  consult: {
    sessions: '/consult/sessions',
    session: (id) => `/consult/sessions/${id}`,
    token: (id) => `/consult/sessions/${id}/token`,
  },
};
