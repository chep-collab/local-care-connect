import express from 'express';
import {
  registerCaregiver,
  uploadCredentials,
  updateAvailability,
  searchCaregivers,
  getCaregiverProfile
} from '../controllers/caregiverController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../middleware/upload';
import {
  registerSchema,
  credentialsSchema,
  availabilitySchema,
  searchSchema
} from '../validators/caregiver';

const router = express.Router();

// Public routes
router.post(
  '/register',
  upload.single('profileImage'),
  validateRequest(registerSchema),
  registerCaregiver
);

router.get('/search', validateRequest(searchSchema), searchCaregivers);
router.get('/:id/profile', getCaregiverProfile);

// Protected routes
router.use(authenticate);

router.post(
  '/:id/credentials',
  validateRequest(credentialsSchema),
  uploadCredentials
);

router.put(
  '/:id/availability',
  validateRequest(availabilitySchema),
  updateAvailability
);

export default router;
