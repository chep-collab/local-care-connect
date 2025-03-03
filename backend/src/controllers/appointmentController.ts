import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';
import { Caregiver } from '../models/Caregiver';
import { PaymentService } from '../services/payment';
import { sendAppointmentConfirmation, sendAppointmentReminder } from '../services/email';
import { validateAppointmentData } from '../validators/appointment';
import { scheduleReminder } from '../services/scheduler';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validatedData = validateAppointmentData(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Invalid appointment data',
        details: validatedData.error.issues
      });
    }

    // Check caregiver availability
    const caregiver = await Caregiver.findById(req.body.caregiverId);
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    const isAvailable = await checkCaregiverAvailability(
      caregiver,
      req.body.startTime,
      req.body.endTime
    );
    if (!isAvailable) {
      return res.status(409).json({ error: 'Caregiver not available for selected time' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.userId,
      caregiver: req.body.caregiverId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      type: req.body.type,
      location: req.body.location,
      careServices: req.body.careServices
    });

    if (req.body.type === 'recurring') {
      appointment.recurringPattern = req.body.recurringPattern;
    }

    await appointment.save();

    // Create payment intent
    const paymentIntent = await PaymentService.createPaymentIntent(appointment._id);

    // Schedule appointment reminders
    await scheduleAppointmentReminders(appointment);

    // Send confirmation emails
    await sendAppointmentConfirmation(appointment);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const updates = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    if (
      appointment.patient.toString() !== req.userId &&
      appointment.caregiver.toString() !== req.userId
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // If time is being updated, check availability
    if (updates.startTime || updates.endTime) {
      const isAvailable = await checkCaregiverAvailability(
        appointment.caregiver,
        updates.startTime || appointment.startTime,
        updates.endTime || appointment.endTime,
        appointmentId
      );
      if (!isAvailable) {
        return res.status(409).json({ error: 'Caregiver not available for selected time' });
      }
    }

    // Update appointment
    Object.assign(appointment, updates);
    await appointment.save();

    // Reschedule reminders if time changed
    if (updates.startTime) {
      await scheduleAppointmentReminders(appointment);
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const { reason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    if (
      appointment.patient.toString() !== req.userId &&
      appointment.caregiver.toString() !== req.userId
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Process cancellation
    appointment.status = 'cancelled';
    appointment.cancellation = {
      reason,
      cancelledBy: req.userId,
      cancelledAt: new Date(),
      refundStatus: 'pending'
    };

    await appointment.save();

    // Process refund if applicable
    if (appointment.payment.status === 'paid') {
      try {
        await PaymentService.processRefund(appointmentId, reason);
      } catch (error) {
        console.error('Error processing refund:', error);
        // Continue with cancellation even if refund fails
      }
    }

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { 
      status,
      startDate,
      endDate,
      limit = 10,
      page = 1
    } = req.query;

    // Build query
    const query: any = {
      $or: [
        { patient: req.userId },
        { caregiver: req.userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate as string);
      if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    // Execute query with pagination
    const appointments = await Appointment.find(query)
      .sort({ startTime: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('patient', 'name')
      .populate('caregiver', 'name');

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page)
      }
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function checkCaregiverAvailability(
  caregiverId: string,
  startTime: Date,
  endTime: Date,
  excludeAppointmentId?: string
): Promise<boolean> {
  const query: any = {
    caregiver: caregiverId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const conflictingAppointment = await Appointment.findOne(query);
  return !conflictingAppointment;
}

async function scheduleAppointmentReminders(appointment: any) {
  const reminderTimes = [
    24 * 60 * 60 * 1000, // 24 hours before
    2 * 60 * 60 * 1000   // 2 hours before
  ];

  for (const timeOffset of reminderTimes) {
    const reminderTime = new Date(
      appointment.startTime.getTime() - timeOffset
    );
    
    if (reminderTime > new Date()) {
      await scheduleReminder(
        reminderTime,
        'appointment_reminder',
        {
          appointmentId: appointment._id,
          patientId: appointment.patient,
          caregiverId: appointment.caregiver
        }
      );
    }
  }
}
