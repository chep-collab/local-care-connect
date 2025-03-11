import express from 'express';
import Appointment from '../models/Appointment';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  const appointment = new Appointment({
    client: req.body.client,
    time: req.body.time,
    caregiverId: req.body.caregiverId,
  });

  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update an appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.time = req.body.time || appointment.time;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;