const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['peluqueria', 'uñas', 'otro'], required: true },
  start: { type: Date, required: true },
  status: { type: String, enum: ['pendiente','confirmado','cancelado'], default: 'pendiente' },
  notes: { type: String }
}, { timestamps: true });

AppointmentSchema.index({ start: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
