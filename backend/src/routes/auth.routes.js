const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin-only', authenticate, roleCheck('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome, admin' });
});

module.exports = router;
