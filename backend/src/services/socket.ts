import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Chat } from '../models/Chat';
import { redisClient } from './redis';

interface UserSocket extends Socket {
  userId?: string;
  userType?: 'patient' | 'caregiver';
}

export const configureSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket: UserSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.id;
      socket.userType = decoded.role;

      // Store socket ID in Redis for user
      await redisClient.set(`user:${decoded.id}:socket`, socket.id);
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: UserSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join personal room
    socket.join(`user:${socket.userId}`);

    // Handle chat messages
    socket.on('send_message', async (data: {
      chatId: string;
      content: string;
      type: 'text' | 'image' | 'document' | 'emergency';
      metadata?: any;
    }) => {
      try {
        const chat = await Chat.findById(data.chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Create new message
        const message = {
          sender: socket.userId,
          content: data.content,
          type: data.type,
          timestamp: new Date(),
          readBy: [socket.userId],
          metadata: data.metadata
        };

        // Update chat
        chat.messages.push(message);
        chat.lastMessage = {
          content: data.content,
          timestamp: new Date(),
          sender: socket.userId!
        };

        // Update unread count for recipient
        const recipientType = socket.userType === 'patient' ? 'caregiver' : 'patient';
        chat.unreadCount[recipientType]++;

        await chat.save();

        // Get recipient's socket ID from Redis
        const recipientId = socket.userType === 'patient' 
          ? chat.participants.caregiver.toString()
          : chat.participants.patient.toString();
        
        const recipientSocketId = await redisClient.get(`user:${recipientId}:socket`);

        // Emit message to recipient
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_message', {
            chatId: chat._id,
            message
          });
        }

        // Emit success to sender
        socket.emit('message_sent', {
          chatId: chat._id,
          message
        });

        // Handle emergency messages
        if (data.type === 'emergency') {
          handleEmergencyMessage(chat, message, io);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message read status
    socket.on('mark_read', async (data: { chatId: string, messageIds: string[] }) => {
      try {
        const chat = await Chat.findById(data.chatId);
        if (!chat) return;

        // Update read status for messages
        chat.messages.forEach(msg => {
          if (data.messageIds.includes(msg._id.toString()) && !msg.readBy.includes(socket.userId!)) {
            msg.readBy.push(socket.userId!);
          }
        });

        // Reset unread count for user
        chat.unreadCount[socket.userType!] = 0;
        await chat.save();

        // Notify other participant
        const otherParticipant = socket.userType === 'patient'
          ? chat.participants.caregiver.toString()
          : chat.participants.patient.toString();
        
        const otherSocketId = await redisClient.get(`user:${otherParticipant}:socket`);
        if (otherSocketId) {
          io.to(otherSocketId).emit('messages_read', {
            chatId: chat._id,
            messageIds: data.messageIds,
            readBy: socket.userId
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', async (data: { chatId: string }) => {
      try {
        const chat = await Chat.findById(data.chatId);
        if (!chat) return;

        const otherParticipant = socket.userType === 'patient'
          ? chat.participants.caregiver.toString()
          : chat.participants.patient.toString();
        
        const otherSocketId = await redisClient.get(`user:${otherParticipant}:socket`);
        if (otherSocketId) {
          io.to(otherSocketId).emit('user_typing', {
            chatId: data.chatId,
            userId: socket.userId
          });
        }
      } catch (error) {
        console.error('Error handling typing indicator:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      if (socket.userId) {
        await redisClient.del(`user:${socket.userId}:socket`);
      }
    });
  });

  return io;
};

async function handleEmergencyMessage(chat: any, message: any, io: Server) {
  try {
    // Notify emergency contacts
    const patient = await Patient.findById(chat.participants.patient)
      .populate('emergencyContacts');
    
    if (patient?.emergencyContacts) {
      // Send emergency notifications (SMS, email, etc.)
      for (const contact of patient.emergencyContacts) {
        await sendEmergencyNotification(contact, patient, message);
      }
    }

    // Notify nearby caregivers
    const nearbyCaregiversSockets = await findNearbyCaregivers(patient!.location);
    for (const socketId of nearbyCaregiversSockets) {
      io.to(socketId).emit('emergency_alert', {
        patientId: patient!._id,
        location: patient!.location,
        message: message.content
      });
    }
  } catch (error) {
    console.error('Error handling emergency message:', error);
  }
}
