import Stripe from 'stripe';
import { Patient } from '../models/Patient';
import { Appointment } from '../models/Appointment';
import { sendPaymentConfirmation } from './email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export class PaymentService {
  static async createPaymentIntent(appointmentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient')
        .populate('caregiver');

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Calculate amount based on duration and caregiver rate
      const amount = this.calculateAppointmentCost(appointment);

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'gbp',
        customer: (appointment.patient as any).stripeCustomerId,
        metadata: {
          appointmentId: appointment._id.toString(),
          patientId: appointment.patient._id.toString(),
          caregiverId: appointment.caregiver._id.toString()
        }
      });

      // Update appointment with payment intent
      appointment.payment = {
        amount,
        currency: 'GBP',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id
      };
      await appointment.save();

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const appointment = await Appointment.findOne({
        'payment.stripePaymentIntentId': paymentIntent.id
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Update appointment payment status
      appointment.payment.status = 'paid';
      await appointment.save();

      // Send confirmation emails
      await sendPaymentConfirmation(appointment);

      // Update caregiver earnings (implement payout system)
      await this.updateCaregiverEarnings(appointment);
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  static async processRefund(appointmentId: string, reason: string): Promise<Stripe.Refund> {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      if (!appointment.payment.stripePaymentIntentId) {
        throw new Error('No payment found for this appointment');
      }

      // Calculate refund amount based on cancellation policy
      const refundAmount = this.calculateRefundAmount(appointment);

      // Process refund through Stripe
      const refund = await stripe.refunds.create({
        payment_intent: appointment.payment.stripePaymentIntentId,
        amount: refundAmount,
        metadata: {
          appointmentId: appointment._id.toString(),
          reason
        }
      });

      // Update appointment status
      appointment.payment.status = 'refunded';
      appointment.cancellation = {
        ...appointment.cancellation,
        refundStatus: 'processed'
      };
      await appointment.save();

      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  static async addPaymentMethod(
    patientId: string,
    paymentMethodId: string
  ): Promise<void> {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Get payment method details from Stripe
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Add payment method to patient
      patient.paymentMethods.push({
        type: paymentMethod.type as 'card' | 'bank_account',
        lastFour: paymentMethod.card?.last4 || '',
        isDefault: patient.paymentMethods.length === 0, // Make default if first
        stripePaymentMethodId: paymentMethodId
      });

      await patient.save();
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  private static calculateAppointmentCost(appointment: any): number {
    const hourlyRate = appointment.caregiver.hourlyRate || 25; // Default rate
    const durationHours = (
      appointment.endTime.getTime() - appointment.startTime.getTime()
    ) / (1000 * 60 * 60);
    
    // Calculate base cost
    let cost = hourlyRate * durationHours;

    // Add service-specific charges
    appointment.careServices.forEach((service: any) => {
      if (service.type === 'specialized_care') {
        cost += 10; // Additional charge for specialized care
      }
    });

    // Convert to pence for Stripe
    return Math.round(cost * 100);
  }

  private static calculateRefundAmount(appointment: any): number {
    const now = new Date();
    const appointmentStart = new Date(appointment.startTime);
    const hoursUntilAppointment = 
      (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Refund policy:
    // > 48 hours: 100% refund
    // 24-48 hours: 75% refund
    // 12-24 hours: 50% refund
    // < 12 hours: no refund
    let refundPercentage = 0;
    if (hoursUntilAppointment > 48) {
      refundPercentage = 1;
    } else if (hoursUntilAppointment > 24) {
      refundPercentage = 0.75;
    } else if (hoursUntilAppointment > 12) {
      refundPercentage = 0.5;
    }

    return Math.round(appointment.payment.amount * refundPercentage);
  }

  private static async updateCaregiverEarnings(appointment: any): Promise<void> {
    // Calculate caregiver's share (e.g., 80% of payment)
    const caregiverShare = Math.round(appointment.payment.amount * 0.8);

    // Add to caregiver's pending earnings
    // This would connect to your payout system
    // Implementation depends on your payout schedule and system
  }
}
