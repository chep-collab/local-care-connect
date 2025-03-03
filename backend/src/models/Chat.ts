import mongoose, { Schema, Document } from 'mongoose';

export interface ChatDocument extends Document {
  participants: {
    patient: Schema.Types.ObjectId;
    caregiver: Schema.Types.ObjectId;
  };
  messages: Array<{
    sender: Schema.Types.ObjectId;
    content: string;
    type: 'text' | 'image' | 'document' | 'emergency';
    timestamp: Date;
    readBy: Schema.Types.ObjectId[];
    metadata?: {
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
      imageUrl?: string;
      thumbnailUrl?: string;
    };
  }>;
  status: 'active' | 'archived';
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: Schema.Types.ObjectId;
  };
  unreadCount: {
    patient: number;
    caregiver: number;
  };
}

const ChatSchema = new Schema({
  participants: {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver', required: true }
  },
  messages: [{
    sender: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'document', 'emergency'],
      default: 'text'
    },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId }],
    metadata: {
      fileName: String,
      fileSize: Number,
      mimeType: String,
      imageUrl: String,
      thumbnailUrl: String
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: Schema.Types.ObjectId
  },
  unreadCount: {
    patient: { type: Number, default: 0 },
    caregiver: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
ChatSchema.index({ 'participants.patient': 1, 'participants.caregiver': 1 });
ChatSchema.index({ 'messages.timestamp': -1 });
ChatSchema.index({ status: 1 });

export const Chat = mongoose.model<ChatDocument>('Chat', ChatSchema);
