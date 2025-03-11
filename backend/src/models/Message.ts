import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', MessageSchema);