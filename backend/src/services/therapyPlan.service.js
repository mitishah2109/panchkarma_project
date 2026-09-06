const prisma = require('../config/db');

async function createTherapyPlan({ patientId, title, description }) {
  const patient = await prisma.user.findUnique({ where: { id: patientId } });
  if (!patient || patient.role !== 'PATIENT') {
    const error = new Error('Patient not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.therapyPlan.create({
    data: { patientId, title, description },
  });
}

async function addSession(planId, { sessionDate, notes }) {
  const plan = await prisma.therapyPlan.findUnique({ where: { id: planId } });
  if (!plan) {
    const error = new Error('Therapy plan not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.therapySession.create({
    data: { therapyPlanId: planId, sessionDate: new Date(sessionDate), notes },
  });
}

async function updateSession(sessionId, data) {
  const session = await prisma.therapySession.findUnique({ where: { id: sessionId } });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.therapySession.update({
    where: { id: sessionId },
    data,
  });
}

async function listMyTherapyPlans(userId, role) {
  if (role === 'PATIENT') {
    return prisma.therapyPlan.findMany({
      where: { patientId: userId },
      include: { sessions: true },
      orderBy: { startDate: 'desc' },
    });
  }

  return prisma.therapyPlan.findMany({
    include: { sessions: true },
    orderBy: { startDate: 'desc' },
  });
}

module.exports = { createTherapyPlan, addSession, updateSession, listMyTherapyPlans };
