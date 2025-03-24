const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 5001; // Use Render's PORT, fallback to 5001 locally
const server = http.createServer(app);

// Updated CORS origins for local dev and Render
const allowedOrigins = [
  'http://localhost:3023', // Local frontend dev
  'http://localhost:3002', // Local frontend dev
  'https://local-care-connect.onrender.com', // Backend Render URL
  'https://your-frontend-name.onrender.com' // Replace with your actual frontend Render URL
];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

let appointments = []; // In-memory store

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Root route to avoid 404 when visiting the base URL
app.get('/', (req, res) => {
  res.send('Welcome to Local Care Connect Backend!');
});

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
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.time = time;
    io.emit('appointmentUpdate', appointments);
    res.json(appointment);
  });