const { getMyProgress } = require('../services/progress.service');

async function myProgress(req, res, next) {
  try {
    const progress = await getMyProgress(req.user.id);
    res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
}

module.exports = { myProgress };
