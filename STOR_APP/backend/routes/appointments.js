const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

function isWholeHour(date) {
  const d = new Date(date);
  return d.getMinutes() === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0;
}

function hourInRange(date, startHour = 8, endHour = 18) {
  const d = new Date(date);
  const h = d.getHours();
  return h >= startHour && h <= endHour;
}

// GET /api/appointments?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    if (date) {
      const dayStart = new Date(date + 'T00:00:00');
      const dayEnd = new Date(date + 'T23:59:59');
      const list = await Appointment.find({ start: { $gte: dayStart, $lte: dayEnd } }).sort({ start: 1 });
      return res.json(list);
    }
    const all = await Appointment.find().sort({ start: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, type, start, notes } = req.body;
    if (!firstName || !lastName || !phone || !type || !start) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const startDate = new Date(start);
    if (!isWholeHour(startDate) || !hourInRange(startDate)) {
      return res.status(400).json({ error: 'Start must be whole hour between allowed range' });
    }

    const exists = await Appointment.findOne({ start: startDate });
    if (exists) return res.status(409).json({ error: 'Slot already booked' });

    const newAppt = new Appointment({ firstName, lastName, phone, type, start: startDate, notes });
    await newAppt.save();
    res.status(201).json(newAppt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/appointments/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    // In production protect critical fields via auth (only admin can change status)
    if (updates.start) {
      const startDate = new Date(updates.start);
      if (!isWholeHour(startDate) || !hourInRange(startDate)) {
        return res.status(400).json({ error: 'Start must be whole hour between allowed range' });
      }
      const exists = await Appointment.findOne({ start: startDate, _id: { $ne: req.params.id } });
      if (exists) return res.status(409).json({ error: 'Slot already booked' });
      updates.start = startDate;
    }
    const updated = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Protected: only admin with valid token can delete
    const removed = await Appointment.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
