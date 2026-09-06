const {
  createTherapyPlanSchema,
  createSessionSchema,
  updateSessionSchema,
} = require('../validators/therapyPlan.validator');
const {
  createTherapyPlan,
  addSession,
  updateSession,
  listMyTherapyPlans,
} = require('../services/therapyPlan.service');

async function create(req, res, next) {
  try {
    const data = createTherapyPlanSchema.parse(req.body);
    const plan = await createTherapyPlan(data);
    res.status(201).json({ plan });
  } catch (error) {
    next(error);
  }
}

async function createSession(req, res, next) {
  try {
    const data = createSessionSchema.parse(req.body);
    const session = await addSession(req.params.planId, data);
    res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
}

async function patchSession(req, res, next) {
  try {
    const data = updateSessionSchema.parse(req.body);
    const session = await updateSession(req.params.sessionId, data);
    res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const plans = await listMyTherapyPlans(req.user.id, req.user.role);
    res.status(200).json({ plans });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, createSession, patchSession, listMine };
