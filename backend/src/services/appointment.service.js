const prisma = require('../config/db');

const APPOINTMENT_DURATION_MINUTES = 60;

async function hasConflict(practitionerId, scheduledAt, excludeAppointmentId) {
  const start = new Date(scheduledAt);
  const windowStart = new Date(start.getTime() - APPOINTMENT_DURATION_MINUTES * 60000);
  const windowEnd = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  const conflict = await prisma.appointment.findFirst({
    where: {
      practitionerId,
      status: { not: 'CANCELLED' },
      scheduledAt: { gt: windowStart, lt: windowEnd },
      ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
    },
  });

  return Boolean(conflict);
}

async function createAppointment(patientId, { practitionerId, scheduledAt, notes }) {
  const practitioner = await prisma.user.findUnique({ where: { id: practitionerId } });
  if (!practitioner || practitioner.role !== 'PRACTITIONER') {
    const error = new Error('Practitioner not found');
    error.statusCode = 404;
    throw error;
  }

  const conflict = await hasConflict(practitionerId, scheduledAt);
  if (conflict) {
    const error = new Error('This time slot is not available for the selected practitioner');
    error.statusCode = 409;
    throw error;
  }

  return prisma.appointment.create({
    data: { patientId, practitionerId, scheduledAt: new Date(scheduledAt), notes },
  });
}

async function rescheduleAppointment(patientId, appointmentId, { scheduledAt }) {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment || appointment.patientId !== patientId) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  const conflict = await hasConflict(appointment.practitionerId, scheduledAt, appointmentId);
  if (conflict) {
    const error = new Error('This time slot is not available for the selected practitioner');
    error.statusCode = 409;
    throw error;
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { scheduledAt: new Date(scheduledAt), status: 'RESCHEDULED' },
  });
}

async function cancelAppointment(patientId, appointmentId) {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment || appointment.patientId !== patientId) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'CANCELLED' },
  });
}

async function listMyAppointments(userId, role) {
  const where = role === 'PRACTITIONER' ? { practitionerId: userId } : { patientId: userId };
  return prisma.appointment.findMany({ where, orderBy: { scheduledAt: 'asc' } });
}

module.exports = {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  listMyAppointments,
};
