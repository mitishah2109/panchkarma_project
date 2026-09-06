const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const therapyPlanRoutes = require('./routes/therapyPlan.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/therapy-plans', therapyPlanRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(errorHandler);

module.exports = app;
