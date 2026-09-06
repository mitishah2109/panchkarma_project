const prisma = require('../config/db');

async function submitFeedback(patientId, sessionId, data) {
  const session = await prisma.therapySession.findUnique({
    where: { id: sessionId },
    include: { therapyPlan: true },
  });

  if (!session || session.therapyPlan.patientId !== patientId) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.feedback.findUnique({ where: { sessionId } });
  if (existing) {
    const error = new Error('Feedback already submitted for this session');
    error.statusCode = 409;
    throw error;
  }

  return prisma.feedback.create({
    data: { sessionId, ...data },
  });
}

async function listMyFeedback(patientId) {
  return prisma.feedback.findMany({
    where: { session: { therapyPlan: { patientId } } },
    include: { session: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { submitFeedback, listMyFeedback };
