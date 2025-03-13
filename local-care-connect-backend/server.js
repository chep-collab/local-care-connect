const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 5001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3023', 'http://localhost:3002'], // Allow multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

let appointments = []; // In-memory store

app.use(cors({
  origin: ['http://localhost:3023', 'http://localhost:3002'], // Allow multiple origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// GET: Fetch all appointments
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// POST: Create a new appointment
app.post('/api/appointments', (req, res) => {
  const { client, time } = req.body;
  if (!client || !time) {
    return res.status(400).json({ error: 'Client and time are required' });
  }
  const appointment = { _id: String(appointments.length + 1), client, time };
  appointments.push(appointment);
  io.emit('appointmentUpdate', appointments);
  res.status(201).json(appointment);
});

// PUT: Update an appointment
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { time } = req.body;
  const appointment = appointments.find((apt) => apt._id === id);
  if (appointment) {
    appointment.time = time;
    io.emit('appointmentUpdate', appointments);
    res.json(appointment);
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// DELETE: Cancel an appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = appointments.length;
  appointments = appointments.filter((apt) => apt._id !== id);
  if (appointments.length < initialLength) {
    io.emit('appointmentUpdate', appointments);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Sample caregivers data (for App.tsx)
const caregivers = [
  {
    _id: '1',
    name: 'Caregiver 1',
    rating: 4.5,
    email: 'caregiver1@example.com',
    phone: '123-456-7890',
    specialization: 'General Care',
    available: true,
    reviews: ['Great service!', 'Very professional'],
    points: 100,
  },
  {
    _id: '2',
    name: 'Caregiver 2',
    rating: 4.0,
    email: 'caregiver2@example.com',
    phone: '987-654-3210',
    specialization: 'Elderly Care',
    available: false,
    reviews: ['Good experience', 'Punctual'],
    points: 80,
  },
];

// GET: Fetch all caregivers
app.get('/api/caregivers', (req, res) => {
  res.json(caregivers);
});

// Socket.IO: Handle real-time connections
let activeConnections = 0;
io.on('connection', (socket) => {
  activeConnections++;
  console.log(`User connected. Active connections: ${activeConnections}`);
  io.emit('activeConnections', activeConnections);

  socket.on('disconnect', () => {
    activeConnections--;
    console.log(`User disconnected. Active connections: ${activeConnections}`);
    io.emit('activeConnections', activeConnections);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});