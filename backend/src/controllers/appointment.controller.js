const {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} = require('../validators/appointment.validator');
const {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  listMyAppointments,
} = require('../services/appointment.service');

async function create(req, res, next) {
  try {
    const data = createAppointmentSchema.parse(req.body);
    const appointment = await createAppointment(req.user.id, data);
    res.status(201).json({ appointment });
  } catch (error) {
    next(error);
  }
}

async function reschedule(req, res, next) {
  try {
    const data = rescheduleAppointmentSchema.parse(req.body);
    const appointment = await rescheduleAppointment(req.user.id, req.params.id, data);
    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await cancelAppointment(req.user.id, req.params.id);
    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const appointments = await listMyAppointments(req.user.id, req.user.role);
    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, reschedule, cancel, listMine };
