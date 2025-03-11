import express, { Express, Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import caregiverRoutes from './routes/caregiverRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import Message from './models/Message';
import Notification from './models/Notification';

// Define interfaces for Socket.IO data
interface MessageData {
  text: string;
  sender: string;
}

interface NotificationData {
  message: string;
  time: string;
}

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: 'https://local-care-connect.vercel.app', // Update to your deployed frontend URL
    methods: ['GET', 'POST'],
  } as CorsOptions,
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: unknown) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/appointments', appointmentRoutes);

// Socket.IO for real-time chat and notifications
io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  // Send initial messages
  Message.find().then((messages) => {
    socket.emit('initialMessages', messages);
  });

  // Send initial notifications
  Notification.find().then((notifications) => {
    socket.emit('initialNotifications', notifications);
  });

  // Handle new messages
  socket.on('sendMessage', async (data: MessageData) => {
    const message = new Message(data);
    await message.save();
    io.emit('newMessage', message);
  });

  // Handle new notifications
  socket.on('sendNotification', async (data: NotificationData) => {
    const notification = new Notification(data);
    await notification.save();
    io.emit('newNotification', notification);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});