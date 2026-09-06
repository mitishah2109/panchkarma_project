const { z } = require('zod');

const createTherapyPlanSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
});

const createSessionSchema = z.object({
  sessionDate: z.string().datetime('Invalid date/time format'),
  notes: z.string().optional(),
});

const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

module.exports = { createTherapyPlanSchema, createSessionSchema, updateSessionSchema };
