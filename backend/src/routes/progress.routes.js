const express = require('express');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { myProgress } = require('../controllers/progress.controller');

const router = express.Router();

router.use(authenticate);
router.get('/me', roleCheck('PATIENT'), myProgress);

module.exports = router;
