import { Caregiver, Patient } from '@/types';

export const caregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    specializations: ['personal_care', 'medical_assistance', 'mobility_support'],
    experience: 8,
    rating: 4.9,
    availability: {
      regularHours: {
        monday: [{ start: '09:00', end: '17:00' }],
        tuesday: [{ start: '09:00', end: '17:00' }],
        wednesday: [{ start: '09:00', end: '17:00' }],
        thursday: [{ start: '09:00', end: '17:00' }],
        friday: [{ start: '09:00', end: '17:00' }],
        saturday: [],
        sunday: []
      },
      exceptions: []
    },
    verificationStatus: 'verified',
    credentials: [
      {
        type: 'Registered Nurse',
        issuer: 'NHS England',
        dateIssued: new Date('2020-01-15'),
        expiryDate: new Date('2025-01-15'),
        verificationHash: '0x123...abc',
        status: 'valid'
      }
    ],
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      address: '123 Care Street',
      city: 'London',
      postcode: 'SW1A 1AA'
    }
  },
  {
    id: '2',
    name: 'James Wilson',
    specializations: ['specialized_care', 'medical_assistance', 'companionship'],
    experience: 12,
    rating: 4.8,
    availability: {
      regularHours: {
        monday: [{ start: '08:00', end: '16:00' }],
        tuesday: [{ start: '08:00', end: '16:00' }],
        wednesday: [{ start: '08:00', end: '16:00' }],
        thursday: [{ start: '08:00', end: '16:00' }],
        friday: [{ start: '08:00', end: '16:00' }],
        saturday: [{ start: '09:00', end: '15:00' }],
        sunday: []
      },
      exceptions: []
    },
    verificationStatus: 'verified',
    credentials: [
      {
        type: 'Specialist Care Certificate',
        issuer: 'Royal College of Nursing',
        dateIssued: new Date('2019-06-20'),
        expiryDate: new Date('2024-06-20'),
        verificationHash: '0x456...def',
        status: 'valid'
      }
    ],
    location: {
      latitude: 51.5144,
      longitude: -0.1337,
      address: '456 Health Road',
      city: 'London',
      postcode: 'SW1A 2BB'
    }
  }
];

export const currentPatient: Patient = {
  id: 'p1',
  name: 'Elizabeth Brown',
  careNeeds: [
    {
      type: 'medical_assistance',
      frequency: 'daily',
      duration: 2,
      description: 'Medication management and blood pressure monitoring',
      specialRequirements: ['blood_pressure_certified']
    },
    {
      type: 'mobility_support',
      frequency: 'daily',
      duration: 1,
      description: 'Assistance with walking and physical therapy exercises'
    }
  ],
  location: {
    latitude: 51.5074,
    longitude: -0.1278,
    address: '789 Patient Lane',
    city: 'London',
    postcode: 'SW1A 3CC'
  },
  emergencyContacts: [
    {
      name: 'Robert Brown',
      relationship: 'Son',
      phone: '+44 20 1234 5678',
      email: 'robert.brown@email.com'
    }
  ],
  medicalConditions: [
    'Hypertension',
    'Mild Mobility Impairment',
    'Type 2 Diabetes'
  ],
  medications: [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      timing: ['08:00'],
      instructions: 'Take with water before breakfast'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'twice daily',
      timing: ['08:00', '20:00'],
      instructions: 'Take with meals'
    }
  ]
};
