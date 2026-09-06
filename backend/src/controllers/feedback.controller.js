const { createFeedbackSchema } = require('../validators/feedback.validator');
const { submitFeedback, listMyFeedback } = require('../services/feedback.service');

async function create(req, res, next) {
  try {
    const data = createFeedbackSchema.parse(req.body);
    const feedback = await submitFeedback(req.user.id, req.params.sessionId, data);
    res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const feedback = await listMyFeedback(req.user.id);
    res.status(200).json({ feedback });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, listMine };
