// src/mock/data.ts
import { Caregiver } from '../types';

export const caregivers: Caregiver[] = [
  {
    id: "1",
    name: "Caregiver 1",
    specializations: ["General Care"],
    experience: 5,
    rating: 4.5,
    availability: {
      regularHours: {
        monday: [{ start: "09:00", end: "17:00" }],
        // ... other days
      },
      exceptions: [],
    },
    verificationStatus: "verified",
    credentials: {},
    profileImage: "https://example.com/profile1.jpg",
  },
  // ... other caregivers
];