const { z } = require('zod');

const createFeedbackSchema = z.object({
  symptoms: z.string().optional(),
  sideEffects: z.string().optional(),
  painLevel: z.number().int().min(0).max(10).optional(),
  wellnessRating: z.number().int().min(1).max(10).optional(),
});

module.exports = { createFeedbackSchema };
