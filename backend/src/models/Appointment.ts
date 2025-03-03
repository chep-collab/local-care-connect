import mongoose, { Schema, Document } from 'mongoose';

export interface AppointmentDocument extends Document {
  patient: Schema.Types.ObjectId;
  caregiver: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  type: 'one_time' | 'recurring';
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: Date;
  };
  location: {
    address: string;
    city: string;
    postcode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  careServices: Array<{
    type: string;
    duration: number;
    notes?: string;
  }>;
  payment: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'refunded';
    stripePaymentIntentId?: string;
  };
  notes: {
    patientNotes?: string;
    caregiverNotes?: string;
    medicalNotes?: string;
  };
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: Date;
  };
  cancellation?: {
    reason: string;
    cancelledBy: Schema.Types.ObjectId;
    cancelledAt: Date;
    refundStatus?: 'pending' | 'processed' | 'denied';
  };
}

const AppointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  caregiver: {
    type: Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['one_time', 'recurring'],
    required: true
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: Number,
    endDate: Date
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  careServices: [{
    type: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    notes: String
  }],
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'GBP'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    stripePaymentIntentId: String
  },
  notes: {
    patientNotes: String,
    caregiverNotes: String,
    medicalNotes: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: Schema.Types.ObjectId,
      refPath: 'cancellation.cancelledByModel'
    },
    cancelledByModel: {
      type: String,
      enum: ['Patient', 'Caregiver']
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'denied']
    }
  }
}, {
  timestamps: true
});

// Indexes
AppointmentSchema.index({ patient: 1, startTime: 1 });
AppointmentSchema.index({ caregiver: 1, startTime: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ 'payment.status': 1 });

// Middleware to handle recurring appointments
AppointmentSchema.pre('save', async function(next) {
  if (this.isNew && this.type === 'recurring') {
    try {
      await generateRecurringAppointments(this);
    } catch (error) {
      next(error);
    }
  }
  next();
});

async function generateRecurringAppointments(appointment: AppointmentDocument) {
  if (!appointment.recurringPattern) return;

  const { frequency, interval, endDate } = appointment.recurringPattern;
  let currentDate = new Date(appointment.startTime);
  const appointments = [];

  while (currentDate <= endDate) {
    const newAppointment = new Appointment({
      ...appointment.toObject(),
      type: 'one_time',
      startTime: currentDate,
      endTime: new Date(currentDate.getTime() + (appointment.endTime.getTime() - appointment.startTime.getTime()))
    });
    appointments.push(newAppointment);

    // Calculate next date based on frequency
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
    }
  }

  await Appointment.insertMany(appointments);
}

export const Appointment = mongoose.model<AppointmentDocument>('Appointment', AppointmentSchema);
