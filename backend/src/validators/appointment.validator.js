const { z } = require('zod');

const createAppointmentSchema = z.object({
  practitionerId: z.string().uuid('Invalid practitioner ID'),
  scheduledAt: z
    .string()
    .datetime('Invalid date/time format')
    .refine((val) => new Date(val) > new Date(), {
      message: 'Appointment time must be in the future',
    }),
  notes: z.string().optional(),
});

const rescheduleAppointmentSchema = z.object({
  scheduledAt: z
    .string()
    .datetime('Invalid date/time format')
    .refine((val) => new Date(val) > new Date(), {
      message: 'Appointment time must be in the future',
    }),
});

module.exports = { createAppointmentSchema, rescheduleAppointmentSchema };
