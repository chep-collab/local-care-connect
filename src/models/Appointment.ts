import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema({
  client: { type: String, required: true },
  time: { type: String, required: true },
  caregiverId: { type: Schema.Types.ObjectId, ref: 'Caregiver' },
});

export default mongoose.model('Appointment', AppointmentSchema);