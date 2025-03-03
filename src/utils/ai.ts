import * as tf from '@tensorflow/tfjs';
import { Caregiver, Patient, CareNeed } from '@/types';

export class CareMatchingAI {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Initialize TensorFlow.js model
    this.model = await tf.loadLayersModel('/models/care-matching-model.json');
  }

  async findBestMatches(patient: Patient, caregivers: Caregiver[]): Promise<Caregiver[]> {
    const patientFeatures = this.extractPatientFeatures(patient);
    const scores = await Promise.all(
      caregivers.map(async (caregiver) => {
        const score = await this.calculateMatchScore(patientFeatures, caregiver);
        return { caregiver, score };
      })
    );

    return scores
      .sort((a, b) => b.score - a.score)
      .map(({ caregiver }) => caregiver);
  }

  private extractPatientFeatures(patient: Patient) {
    // Convert patient needs into numerical features
    return {
      careTypes: this.encodeCareNeeds(patient.careNeeds),
      location: [patient.location.latitude, patient.location.longitude],
      medicalComplexity: this.calculateMedicalComplexity(patient),
    };
  }

  private async calculateMatchScore(
    patientFeatures: any,
    caregiver: Caregiver
  ): Promise<number> {
    const caregiverFeatures = this.extractCaregiverFeatures(caregiver);
    
    // Combine features for model input
    const input = tf.tensor2d([
      ...patientFeatures.careTypes,
      ...patientFeatures.location,
      patientFeatures.medicalComplexity,
      ...caregiverFeatures
    ], [1, -1]);

    // Get prediction from model
    const prediction = this.model?.predict(input) as tf.Tensor;
    const score = (await prediction.data())[0];
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();

    return score;
  }

  private encodeCareNeeds(careNeeds: CareNeed[]): number[] {
    const careTypes = [
      'personal_care',
      'medical_assistance',
      'mobility_support',
      'companionship',
      'household_help',
      'specialized_care'
    ];

    return careTypes.map(type => 
      careNeeds.some(need => need.type === type) ? 1 : 0
    );
  }

  private calculateMedicalComplexity(patient: Patient): number {
    // Calculate complexity score based on medical conditions and medications
    const conditionWeight = 0.6;
    const medicationWeight = 0.4;

    const conditionScore = Math.min(patient.medicalConditions.length / 5, 1);
    const medicationScore = Math.min(patient.medications.length / 8, 1);

    return (conditionScore * conditionWeight) + (medicationScore * medicationWeight);
  }

  private extractCaregiverFeatures(caregiver: Caregiver): number[] {
    return [
      caregiver.experience / 10, // Normalize experience to 0-1
      caregiver.rating / 5, // Normalize rating to 0-1
      caregiver.verificationStatus === 'verified' ? 1 : 0,
      caregiver.credentials.filter(c => c.status === 'valid').length / 5, // Normalize credentials
    ];
  }
}
