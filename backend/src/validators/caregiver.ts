import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  name: z.string().min(2),
  phoneNumber: z.string().regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number format'
  ),
  specializations: z.array(
    z.enum([
      'personal_care',
      'medical_assistance',
      'mobility_support',
      'companionship',
      'household_help',
      'specialized_care'
    ])
  ),
  experience: z.number().min(0),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
    city: z.string(),
    postcode: z.string()
  })
});

export const credentialsSchema = z.object({
  credentials: z.array(
    z.object({
      type: z.string(),
      issuer: z.string(),
      dateIssued: z.string().transform((str) => new Date(str)),
      expiryDate: z.string().transform((str) => new Date(str)),
      documentUrl: z.string().url()
    })
  )
});

export const availabilitySchema = z.object({
  availability: z.object({
    regularHours: z.object({
      monday: z.array(timeSlotSchema),
      tuesday: z.array(timeSlotSchema),
      wednesday: z.array(timeSlotSchema),
      thursday: z.array(timeSlotSchema),
      friday: z.array(timeSlotSchema),
      saturday: z.array(timeSlotSchema),
      sunday: z.array(timeSlotSchema)
    }),
    exceptions: z.array(
      z.object({
        date: z.string().transform((str) => new Date(str)),
        available: z.boolean(),
        slots: z.array(timeSlotSchema).optional()
      })
    )
  })
});

const timeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
}).refine(
  (data) => {
    const start = new Date(`1970-01-01T${data.start}`);
    const end = new Date(`1970-01-01T${data.end}`);
    return end > start;
  },
  {
    message: 'End time must be after start time'
  }
);

export const searchSchema = z.object({
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  specializations: z.array(
    z.enum([
      'personal_care',
      'medical_assistance',
      'mobility_support',
      'companionship',
      'household_help',
      'specialized_care'
    ])
  ).optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxDistance: z.number().positive().optional(),
  availability: z.object({
    dayOfWeek: z.enum([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]),
    timeSlot: timeSlotSchema
  }).optional(),
  patientNeeds: z.array(
    z.object({
      type: z.enum([
        'personal_care',
        'medical_assistance',
        'mobility_support',
        'companionship',
        'household_help',
        'specialized_care'
      ]),
      priority: z.number().min(1).max(5)
    })
  ).optional()
});
