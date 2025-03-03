export interface Caregiver {
  id: string;
  name: string;
  profileImage: string;
  specializations: string[];
  experience: number;
  rating: number;
  availability: AvailabilitySchedule;
  verificationStatus: VerificationStatus;
  credentials: Credential[];
  location: GeoLocation;
}

export interface Patient {
  id: string;
  name: string;
  careNeeds: CareNeed[];
  location: GeoLocation;
  emergencyContacts: EmergencyContact[];
  medicalConditions: string[];
  medications: Medication[];
}

export interface CareNeed {
  type: CareType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  duration: number; // in hours
  description: string;
  specialRequirements?: string[];
}

export interface Credential {
  type: string;
  issuer: string;
  dateIssued: Date;
  expiryDate: Date;
  verificationHash: string; // Blockchain verification hash
  status: 'valid' | 'expired' | 'revoked';
}

export interface AvailabilitySchedule {
  regularHours: {
    [key in DayOfWeek]: TimeSlot[];
  };
  exceptions: {
    date: Date;
    available: boolean;
    slots?: TimeSlot[];
  }[];
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postcode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  instructions: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'me' | 'them';
  timestamp: Date;
  type: 'text' | 'image';
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ChatParticipant {
  id: string;
  name: string;
  profileImage: string;
  lastSeen?: Date;
}

export interface Appointment {
  id: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  patient: {
    id: string;
    name: string;
  };
  caregiver: {
    id: string;
    name: string;
  };
  location: {
    address: string;
    city: string;
    postcode: string;
  };
  careServices: {
    type: string;
    duration: number;
  }[];
  payment?: {
    amount: number; // in cents
    status: 'pending' | 'paid' | 'refunded';
  };
  notes?: string;
  cancellationReason?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  baseRate: number; // hourly rate in currency
  minDuration: number; // in minutes
  maxDuration: number; // in minutes
  requiresAssessment: boolean;
}

export type CareType = 
  | 'personal_care'
  | 'medical_assistance'
  | 'mobility_support'
  | 'companionship'
  | 'household_help'
  | 'specialized_care';

export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type VerificationStatus = 
  | 'verified'
  | 'pending'
  | 'rejected';
