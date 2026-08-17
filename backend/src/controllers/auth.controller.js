const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { registerUser, loginUser } = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
