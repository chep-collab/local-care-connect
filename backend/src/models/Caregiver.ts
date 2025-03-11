import mongoose, { Schema } from 'mongoose';

const CaregiverSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  available: { type: Boolean, required: true },
  reviews: { type: [String], default: [] },
  points: { type: Number, default: 0 },
});

export default mongoose.model('Caregiver', CaregiverSchema);