import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock database
let appointments = [
  {
    id: '1',
    startTime: new Date('2025-03-04T10:00:00'),
    endTime: new Date('2025-03-04T12:00:00'),
    status: 'confirmed',
    patient: {
      id: 'p1',
      name: 'John Smith'
    },
    caregiver: {
      id: 'c1',
      name: 'Sarah Thompson'
    },
    location: {
      address: '123 Care Street, London',
      city: 'London',
      postcode: 'SW1A 1AA'
    },
    careServices: [
      {
        type: 'Personal Care',
        duration: 120
      }
    ],
    payment: {
      amount: 6000,
      status: 'pending'
    }
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const userType = searchParams.get('userType');

  let filteredAppointments = appointments;
  if (userId && userType) {
    filteredAppointments = appointments.filter(apt => 
      userType === 'patient' ? apt.patient.id === userId : apt.caregiver.id === userId
    );
  }

  return NextResponse.json(filteredAppointments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate appointment data
  if (!body.startTime || !body.endTime || !body.patient || !body.caregiver) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Create new appointment
  const newAppointment = {
    id: Date.now().toString(),
    ...body,
    status: 'pending',
    payment: {
      amount: calculateAmount(body.careServices),
      status: 'pending'
    }
  };

  appointments.push(newAppointment);

  return NextResponse.json(newAppointment);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  const index = appointments.findIndex(apt => apt.id === body.id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Appointment not found' },
      { status: 404 }
    );
  }

  appointments[index] = { ...appointments[index], ...body };

  return NextResponse.json(appointments[index]);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing appointment ID' },
      { status: 400 }
    );
  }

  const index = appointments.findIndex(apt => apt.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Appointment not found' },
      { status: 404 }
    );
  }

  appointments.splice(index, 1);

  return NextResponse.json({ success: true });
}

function calculateAmount(services: Array<{ type: string; duration: number }>) {
  const ratePerHour = {
    'Personal Care': 50,
    'Medical Assistance': 75,
    'Companionship': 40,
    'Mobility Support': 60
  };

  return services.reduce((total, service) => {
    const hourlyRate = ratePerHour[service.type as keyof typeof ratePerHour] || 50;
    return total + (hourlyRate * service.duration / 60);
  }, 0) * 100; // Convert to cents
}
