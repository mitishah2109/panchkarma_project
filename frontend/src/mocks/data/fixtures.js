/**
 * Seed data for MSW. Kept deliberately small and readable. IDs are stable so
 * you can hard-code them while building screens.
 *
 * Demo logins (any password works in the mock):
 *   patient@demo.com       / PATIENT
 *   practitioner@demo.com  / PRACTITIONER
 *   admin@demo.com         / ADMIN
 */

export const users = [
  {
    id: 'u-patient-1',
    name: 'Aarav Sharma',
    email: 'patient@demo.com',
    role: 'PATIENT',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'u-practitioner-1',
    name: 'Dr. Meera Nair',
    email: 'practitioner@demo.com',
    role: 'PRACTITIONER',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'u-admin-1',
    name: 'Clinic Admin',
    email: 'admin@demo.com',
    role: 'ADMIN',
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'u-practitioner-2',
    name: 'Dr. Vikram Sethi',
    email: 'vikram@demo.com',
    role: 'PRACTITIONER',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'u-practitioner-3',
    name: 'Dr. Anand Rao',
    email: 'anand@demo.com',
    role: 'PRACTITIONER',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'u-practitioner-4',
    name: 'Dr. Priya Menon',
    email: 'priya@demo.com',
    role: 'PRACTITIONER',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: 'u-patient-2',
    name: 'Riya Sharma',
    email: 'riya@demo.com',
    role: 'PATIENT',
    createdAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 'u-patient-3',
    name: 'Kavya Iyer',
    email: 'kavya@demo.com',
    role: 'PATIENT',
    createdAt: '2026-07-18T09:00:00.000Z',
  },
];

/** Convenience view — practitioners only, in the shape the picker expects. */
export const practitioners = users
  .filter((u) => u.role === 'PRACTITIONER')
  .map(({ id, name, email }) => ({ id, name, email, speciality: 'Panchakarma' }));

/** Convenience view — patients only, for the "assign plan" picker. */
export const patients = users
  .filter((u) => u.role === 'PATIENT')
  .map(({ id, name, email }) => ({ id, name, email }));

export const appointments = [
  {
    id: 'appt-1',
    patientId: 'u-patient-1',
    practitionerId: 'u-practitioner-1',
    scheduledAt: '2026-09-12T04:30:00.000Z',
    status: 'SCHEDULED',
    notes: 'Initial Abhyanga consultation',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'appt-2',
    patientId: 'u-patient-1',
    practitionerId: 'u-practitioner-1',
    scheduledAt: '2026-09-19T04:30:00.000Z',
    status: 'SCHEDULED',
    notes: null,
    createdAt: '2026-09-01T10:05:00.000Z',
  },
];

export const therapyPlans = [
  {
    id: 'plan-1',
    patientId: 'u-patient-1',
    title: 'Vamana + Basti — 14 day Shodhana',
    description: 'Full Panchakarma course targeting chronic digestive imbalance.',
    startDate: '2026-09-05T00:00:00.000Z',
    createdAt: '2026-09-01T10:00:00.000Z',
    sessions: [
      { id: 'sess-1', therapyPlanId: 'plan-1', sessionDate: '2026-09-05T04:30:00.000Z', status: 'COMPLETED', notes: 'Snehapana day 1' },
      { id: 'sess-2', therapyPlanId: 'plan-1', sessionDate: '2026-09-07T04:30:00.000Z', status: 'COMPLETED', notes: 'Snehapana day 3' },
      { id: 'sess-3', therapyPlanId: 'plan-1', sessionDate: '2026-09-10T04:30:00.000Z', status: 'MISSED', notes: null },
      { id: 'sess-4', therapyPlanId: 'plan-1', sessionDate: '2026-09-14T04:30:00.000Z', status: 'SCHEDULED', notes: null },
      { id: 'sess-5', therapyPlanId: 'plan-1', sessionDate: '2026-09-17T04:30:00.000Z', status: 'SCHEDULED', notes: null },
    ],
  },
];

export const feedback = [
  {
    id: 'fb-1',
    sessionId: 'sess-1',
    symptoms: 'Mild fatigue, improved appetite',
    sideEffects: 'None',
    painLevel: 2,
    wellnessRating: 7,
    createdAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'fb-2',
    sessionId: 'sess-2',
    symptoms: 'Lighter feeling, better sleep',
    sideEffects: 'Slight headache in morning',
    painLevel: 1,
    wellnessRating: 8,
    createdAt: '2026-09-07T12:00:00.000Z',
  },
];

export const progress = {
  totalSessions: 5,
  completedSessions: 2,
  missedSessions: 1,
  upcomingSessions: 2,
  completionRate: 40,
  upcomingAppointments: appointments.filter((a) => a.status === 'SCHEDULED'),
};

export const notifications = [
  {
    id: 'ntf-1',
    message: 'Your Abhyanga session is scheduled for Sep 14, 10:00 AM.',
    type: 'APPOINTMENT_REMINDER',
    isRead: false,
    createdAt: '2026-09-08T06:00:00.000Z',
  },
  {
    id: 'ntf-2',
    message: 'Pre-procedure: light diet and no cold water 24h before your next session.',
    type: 'PRECAUTION',
    isRead: false,
    createdAt: '2026-09-08T06:01:00.000Z',
  },
  {
    id: 'ntf-3',
    message: 'Feedback recorded for your Sep 7 session. Thank you!',
    type: 'SYSTEM',
    isRead: true,
    createdAt: '2026-09-07T12:05:00.000Z',
  },
];

export const notificationPreferences = { email: true, sms: false, inApp: true };

export const consultSessions = [
  {
    id: 'consult-1',
    appointmentId: 'appt-1',
    patientId: 'u-patient-1',
    practitionerId: 'u-practitioner-1',
    status: 'SCHEDULED',
    startedAt: null,
    roomName: 'pk-room-appt-1',
  },
];
