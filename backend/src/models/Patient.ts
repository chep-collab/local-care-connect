import mongoose, { Schema, Document } from 'mongoose';
import { Patient as IPatientType } from '../../src/types';

export interface PatientDocument extends IPatientType, Document {
  email: string;
  password: string;
  phoneNumber: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  appointments: Array<{
    caregiverId: Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
  }>;
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      timing: string[];
      instructions: string;
    }>;
    recentHospitalizations: Array<{
      date: Date;
      reason: string;
      hospital: string;
      duration: number;
    }>;
  };
  preferences: {
    preferredLanguages: string[];
    dietaryRestrictions: string[];
    culturalConsiderations: string[];
    carePreferences: {
      gender?: 'male' | 'female' | 'any';
      specializations: string[];
      timePreferences: {
        preferredDays: string[];
        preferredTimes: string[];
      };
    };
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    expiryDate: Date;
  };
  paymentMethods: Array<{
    type: 'card' | 'bank_account';
    lastFour: string;
    isDefault: boolean;
    stripePaymentMethodId: string;
  }>;
}

const PatientSchema = new Schema({
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
  dateOfBirth: {
    type: Date,
    required: true
  },
  careNeeds: [{
    type: {
      type: String,
      enum: [
        'medical_assistance',
        'personal_care',
        'mobility_support',
        'companionship',
        'specialized_care'
      ],
      required: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'as_needed'],
      required: true
    },
    duration: Number,
    description: String,
    specialRequirements: [String]
  }],
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true }
  },
  emergencyContacts: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  }],
  medicalConditions: [String],
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    timing: [String],
    instructions: String
  }],
  appointments: [{
    caregiverId: { type: Schema.Types.ObjectId, ref: 'Caregiver' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    notes: String
  }],
  medicalHistory: {
    conditions: [String],
    allergies: [String],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      timing: [String],
      instructions: String
    }],
    recentHospitalizations: [{
      date: Date,
      reason: String,
      hospital: String,
      duration: Number
    }]
  },
  preferences: {
    preferredLanguages: [String],
    dietaryRestrictions: [String],
    culturalConsiderations: [String],
    carePreferences: {
      gender: {
        type: String,
        enum: ['male', 'female', 'any']
      },
      specializations: [String],
      timePreferences: {
        preferredDays: [String],
        preferredTimes: [String]
      }
    }
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'bank_account'],
      required: true
    },
    lastFour: String,
    isDefault: Boolean,
    stripePaymentMethodId: String
  }]
}, {
  timestamps: true
});

// Indexes
PatientSchema.index({ 'location.coordinates': '2dsphere' });
PatientSchema.index({ email: 1 });
PatientSchema.index({ 'appointments.startTime': 1 });

export const Patient = mongoose.model<PatientDocument>('Patient', PatientSchema);
