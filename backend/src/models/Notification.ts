import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  time: { type: String, required: true },
});

export default mongoose.model('Notification', NotificationSchema);