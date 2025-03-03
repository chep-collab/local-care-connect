import { Request, Response } from 'express';
import { Caregiver, CaregiverDocument } from '../models/Caregiver';
import { CredentialVerifier } from '../services/blockchain';
import { CareMatchingAI } from '../services/ai';
import { uploadToS3, generatePresignedUrl } from '../services/storage';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/email';
import { validateCaregiverData } from '../validators/caregiver';
import { createJWT } from '../utils/auth';

const credentialVerifier = new CredentialVerifier();
const careMatchingAI = new CareMatchingAI();

export const registerCaregiver = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validatedData = validateCaregiverData(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Invalid data', 
        details: validatedData.error.issues 
      });
    }

    // Check if caregiver already exists
    const existingCaregiver = await Caregiver.findOne({ email: req.body.email });
    if (existingCaregiver) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Handle profile image upload
    const profileImageUrl = await uploadToS3(req.files.profileImage);

    // Create new caregiver
    const caregiver = new Caregiver({
      ...req.body,
      profileImage: profileImageUrl,
      verificationStatus: 'pending',
      onboardingStatus: {
        personalInfo: true,
        identification: false,
        credentials: false,
        backgroundCheck: false,
        training: false,
        agreement: false
      }
    });

    await caregiver.save();

    // Generate JWT
    const token = createJWT(caregiver._id);

    // Send welcome email
    await sendWelcomeEmail(caregiver.email, caregiver.name);

    res.status(201).json({
      message: 'Caregiver registered successfully',
      token,
      caregiver: {
        id: caregiver._id,
        name: caregiver.name,
        email: caregiver.email,
        onboardingStatus: caregiver.onboardingStatus
      }
    });
  } catch (error) {
    console.error('Error registering caregiver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadCredentials = async (req: Request, res: Response) => {
  try {
    const caregiverId = req.params.id;
    const { credentials } = req.body;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Verify each credential on the blockchain
    const verifiedCredentials = await Promise.all(
      credentials.map(async (credential: any) => {
        const verificationHash = await credentialVerifier.storeCredential(credential);
        return {
          ...credential,
          verificationHash,
          status: 'valid'
        };
      })
    );

    // Update caregiver credentials
    caregiver.credentials = verifiedCredentials;
    caregiver.onboardingStatus.credentials = true;
    await caregiver.save();

    // Send verification email
    await sendVerificationEmail(caregiver.email);

    res.json({
      message: 'Credentials uploaded and verified successfully',
      credentials: verifiedCredentials
    });
  } catch (error) {
    console.error('Error uploading credentials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const caregiverId = req.params.id;
    const { availability } = req.body;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    caregiver.availability = availability;
    caregiver.availabilityUpdates.push({
      date: new Date(),
      available: true
    });

    await caregiver.save();

    res.json({
      message: 'Availability updated successfully',
      availability: caregiver.availability
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchCaregivers = async (req: Request, res: Response) => {
  try {
    const { 
      location, 
      specializations, 
      availability,
      minRating,
      maxDistance // in kilometers
    } = req.body;

    // Build base query
    const query: any = {
      verificationStatus: 'verified',
      'backgroundCheck.status': 'approved'
    };

    // Add specializations filter
    if (specializations?.length) {
      query.specializations = { $in: specializations };
    }

    // Add rating filter
    if (minRating) {
      query.rating = { $gte: minRating };
    }

    // Add location filter using MongoDB geospatial query
    if (location) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      };
    }

    // Find matching caregivers
    const caregivers = await Caregiver.find(query)
      .select('-password')
      .limit(20);

    // Use AI to rank caregivers if patient data is provided
    if (req.body.patientNeeds) {
      const rankedCaregivers = await careMatchingAI.findBestMatches(
        req.body.patientNeeds,
        caregivers
      );
      return res.json(rankedCaregivers);
    }

    res.json(caregivers);
  } catch (error) {
    console.error('Error searching caregivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCaregiverProfile = async (req: Request, res: Response) => {
  try {
    const caregiverId = req.params.id;

    const caregiver = await Caregiver.findById(caregiverId)
      .select('-password')
      .populate('reviews.patientId', 'name');

    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Generate presigned URL for profile image
    const profileImageUrl = await generatePresignedUrl(caregiver.profileImage);

    res.json({
      ...caregiver.toJSON(),
      profileImage: profileImageUrl
    });
  } catch (error) {
    console.error('Error getting caregiver profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
