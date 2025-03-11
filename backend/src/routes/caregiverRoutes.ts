import express, { Router } from 'express';
import Caregiver from '../models/Caregiver';

const router: Router = express.Router();

// Get all caregivers
router.get('/', async (req, res) => {
  try {
    const caregivers = await Caregiver.find();
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching caregivers', error });
  }
});

// Add a new caregiver
router.post('/', async (req, res) => {
  try {
    const caregiver = new Caregiver(req.body);
    await caregiver.save();
    res.status(201).json(caregiver);
  } catch (error) {
    res.status(500).json({ message: 'Error adding caregiver', error });
  }
});

// Update caregiver points (for achievements)
router.put('/:id/points', async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { points: req.body.points },
      { new: true }
    );
    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ message: 'Error updating points', error });
  }
});

export default router;