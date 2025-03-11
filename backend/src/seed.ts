import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Caregiver from './models/Caregiver';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    await Caregiver.deleteMany({});
    await Caregiver.insertMany([
      {
        name: 'John Smith',
        rating: 4.9,
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        specialization: 'Nursing',
        available: true,
        reviews: ['Great caregiver!', 'Very reliable'],
        points: 150,
      },
      {
        name: 'Sarah Johnson',
        rating: 4.7,
        email: 'sarah.j@example.com',
        phone: '+1-555-987-6543',
        specialization: 'Therapy',
        available: false,
        reviews: ['Kind and professional', 'Excellent therapy sessions'],
        points: 80,
      },
      {
        name: 'Michael Brown',
        rating: 4.8,
        email: 'michael.b@example.com',
        phone: '+1-555-456-7890',
        specialization: 'Personal Care',
        available: true,
        reviews: ['Very attentive', 'Highly recommended'],
        points: 120,
      },
    ]);
    console.log('Caregivers seeded');
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error seeding data:', err));