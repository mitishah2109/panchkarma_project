const express = require('express');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const {
  create,
  reschedule,
  cancel,
  listMine,
} = require('../controllers/appointment.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', roleCheck('PATIENT'), create);
router.patch('/:id/reschedule', roleCheck('PATIENT'), reschedule);
router.patch('/:id/cancel', roleCheck('PATIENT'), cancel);
router.get('/me', listMine);

module.exports = router;
