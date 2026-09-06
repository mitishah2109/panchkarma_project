const express = require('express');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const {
  create,
  createSession,
  patchSession,
  listMine,
} = require('../controllers/therapyPlan.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', roleCheck('PRACTITIONER'), create);
router.post('/:planId/sessions', roleCheck('PRACTITIONER'), createSession);
router.patch('/sessions/:sessionId', roleCheck('PRACTITIONER'), patchSession);
router.get('/me', listMine);

module.exports = router;
