/**
 * App-wide constants. Keep route strings and role names in one place so the
 * router, guards, and nav menus never drift apart.
 */

/** Product branding — single place to rename the app / swap the logo mark. */
export const APP = {
  name: 'AyurNova',
  tagline: 'Ayurveda Suite',
  blurb: 'Plan, prioritise and accomplish your Panchakarma therapies with ease.',
};

export const ROLES = {
  PATIENT: 'PATIENT',
  PRACTITIONER: 'PRACTITIONER',
  ADMIN: 'ADMIN',
};

/** Roles a visitor is allowed to self-register as. */
export const REGISTERABLE_ROLES = [ROLES.PATIENT, ROLES.PRACTITIONER];

export const ROLE_LABELS = {
  [ROLES.PATIENT]: 'Patient',
  [ROLES.PRACTITIONER]: 'Practitioner',
  [ROLES.ADMIN]: 'Admin',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  THERAPY_PLANS: '/therapy-plans',
  NOTIFICATIONS: '/notifications',
  FEEDBACK: '/feedback',
  VIDEO_CONSULT: '/consult',
  SETTINGS: '/settings',
  HELP: '/help',
  NOT_FOUND: '*',
};

/**
 * Where each role lands after login. All roles currently share /dashboard,
 * which renders a role-specific view; split these later if needed.
 */
export const ROLE_HOME = {
  [ROLES.PATIENT]: ROUTES.DASHBOARD,
  [ROLES.PRACTITIONER]: ROUTES.DASHBOARD,
  [ROLES.ADMIN]: ROUTES.DASHBOARD,
};

/** Query key factory — import these instead of hand-writing key arrays. */
export const QUERY_KEYS = {
  me: ['auth', 'me'],
  appointments: (params) => ['appointments', params ?? {}],
  therapyPlans: (params) => ['therapy-plans', params ?? {}],
  notifications: ['notifications'],
  feedback: (params) => ['feedback', params ?? {}],
  progress: ['progress', 'me'],
};

export const TOKEN_STORAGE_KEY = 'pk.auth';
