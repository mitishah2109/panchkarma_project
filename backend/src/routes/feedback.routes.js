const express = require('express');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { create, listMine } = require('../controllers/feedback.controller');

const router = express.Router();

router.use(authenticate);

router.post('/sessions/:sessionId', roleCheck('PATIENT'), create);
router.get('/me', roleCheck('PATIENT'), listMine);

module.exports = router;
