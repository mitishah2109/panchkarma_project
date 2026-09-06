const prisma = require('../config/db');

async function getMyProgress(patientId) {
  const sessions = await prisma.therapySession.findMany({
    where: { therapyPlan: { patientId } },
  });

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED').length;
  const missedSessions = sessions.filter((s) => s.status === 'MISSED').length;
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'SCHEDULED' && s.sessionDate > new Date()
  ).length;
  const completionRate =
    totalSessions === 0 ? 0 : Math.round((completedSessions / totalSessions) * 100);

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      patientId,
      status: { in: ['SCHEDULED', 'RESCHEDULED'] },
      scheduledAt: { gt: new Date() },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  return {
    totalSessions,
    completedSessions,
    missedSessions,
    upcomingSessions,
    completionRate,
    upcomingAppointments,
  };
}

module.exports = { getMyProgress };
