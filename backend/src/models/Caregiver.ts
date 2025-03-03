import mongoose, { Schema, Document } from 'mongoose';
import { Caregiver as ICaregiverType } from '../../src/types';

export interface CaregiverDocument extends ICaregiverType, Document {
  password: string;
  email: string;
  phoneNumber: string;
  backgroundCheck: {
    status: 'pending' | 'approved' | 'rejected';
    completedAt?: Date;
    expiresAt?: Date;
  };
  reviews: Array<{
    patientId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  availabilityUpdates: Array<{
    date: Date;
    available: boolean;
    reason?: string;
  }>;
  onboardingStatus: {
    personalInfo: boolean;
    identification: boolean;
    credentials: boolean;
    backgroundCheck: boolean;
    training: boolean;
    agreement: boolean;
  };
}

const CredentialSchema = new Schema({
  type: { type: String, required: true },
  issuer: { type: String, required: true },
  dateIssued: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  verificationHash: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['valid', 'expired', 'revoked'],
    required: true 
  }
});

const TimeSlotSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
});

const AvailabilityScheduleSchema = new Schema({
  regularHours: {
    monday: [TimeSlotSchema],
    tuesday: [TimeSlotSchema],
    wednesday: [TimeSlotSchema],
    thursday: [TimeSlotSchema],
    friday: [TimeSlotSchema],
    saturday: [TimeSlotSchema],
    sunday: [TimeSlotSchema]
  },
  exceptions: [{
    date: { type: Date, required: true },
    available: { type: Boolean, required: true },
    slots: [TimeSlotSchema]
  }]
});

const CaregiverSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phoneNumber: {
    type: String,
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  profileImage: { 
    type: String,
    required: true
  },
  specializations: [{
    type: String,
    enum: [
      'personal_care',
      'medical_assistance',
      'mobility_support',
      'companionship',
      'household_help',
      'specialized_care'
    ]
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  availability: {
    type: AvailabilityScheduleSchema,
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'pending', 'rejected'],
    required: true
  },
  credentials: [CredentialSchema],
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true }
  },
  backgroundCheck: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      required: true
    },
    completedAt: Date,
    expiresAt: Date
  },
  reviews: [{
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  availabilityUpdates: [{
    date: { type: Date, required: true },
    available: { type: Boolean, required: true },
    reason: String
  }],
  onboardingStatus: {
    personalInfo: { type: Boolean, default: false },
    identification: { type: Boolean, default: false },
    credentials: { type: Boolean, default: false },
    backgroundCheck: { type: Boolean, default: false },
    training: { type: Boolean, default: false },
    agreement: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
CaregiverSchema.index({ 'location.coordinates': '2dsphere' });

// Index for availability searches
CaregiverSchema.index({ 'availability.regularHours': 1 });

// Index for verification status
CaregiverSchema.index({ verificationStatus: 1 });

export const Caregiver = mongoose.model<CaregiverDocument>('Caregiver', CaregiverSchema);
