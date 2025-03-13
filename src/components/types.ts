// src/types.ts
export interface Appointment {
    _id: string;
    client: string;
    time: string;
    caregiverId?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
  }
  
  export interface Message {
    id: number;
    sender: "me" | "them";
    text: string;
    file?: string;
    read: boolean;
  }
  
  export interface GeoLocation {
    city: string;
    distance?: number;
  }
  
  export interface AvailabilitySchedule {
    regularHours: {
      [day: string]: { start: string; end: string }[];
    };
    exceptions: { date: string; hours: { start: string; end: string }[] }[];
  }
  
  export interface Caregiver {
    id: string;
    name: string;
    specializations: string[];
    experience: number;
    rating: number;
    availability: AvailabilitySchedule;
    verificationStatus: string;
    credentials: any; // Define more precisely if needed
    profileImage: string;
  }