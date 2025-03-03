import { FC, useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { Phone, Email, LocalHospital, Warning } from '@mui/icons-material';
import { Patient, EmergencyContact } from '@/types';

interface EmergencyAlertProps {
  patient: Patient;
  currentLocation?: GeolocationCoordinates;
  onClose: () => void;
}

const EmergencyAlert: FC<EmergencyAlertProps> = ({ 
  patient, 
  currentLocation,
  onClose 
}) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearestHospital, setNearestHospital] = useState<string | null>(null);

  useEffect(() => {
    // Simulate finding nearest hospital
    const findNearestHospital = async () => {
      try {
        // In reality, this would use a mapping service API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNearestHospital('St. Mary\'s Hospital - 1.2 miles away');
      } catch (err) {
        console.error('Error finding nearest hospital:', err);
      }
    };

    findNearestHospital();
  }, [currentLocation]);

  const handleSendAlerts = async () => {
    setSending(true);
    setError(null);

    try {
      // Simulate sending emergency alerts
      await Promise.all([
        sendEmergencyContacts(patient.emergencyContacts),
        notifyEmergencyServices(),
        notifyNearestHospital()
      ]);

      setSent(true);
    } catch (err) {
      setError('Failed to send some alerts. Please try again or call emergency services directly.');
    } finally {
      setSending(false);
    }
  };

  const sendEmergencyContacts = async (contacts: EmergencyContact[]) => {
    // Simulate sending messages to emergency contacts
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const notifyEmergencyServices = async () => {
    // Simulate notifying emergency services
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const notifyNearestHospital = async () => {
    // Simulate notifying nearest hospital
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  return (
    <Dialog 
      open={true} 
      onClose={sent ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning />
          Emergency Alert System
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box my={2}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Typography variant="body1">
            Name: {patient.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Location: {patient.location.address}, {patient.location.city}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
            Medical Conditions
          </Typography>
          <List dense>
            {patient.medicalConditions.map((condition, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <LocalHospital color="error" />
                </ListItemIcon>
                <ListItemText primary={condition} />
              </ListItem>
            ))}
          </List>

          {nearestHospital && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nearest Hospital: {nearestHospital}
            </Alert>
          )}

          <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
            Emergency Contacts
          </Typography>
          <List dense>
            {patient.emergencyContacts.map((contact, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${contact.name} (${contact.relationship})`}
                  secondary={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone fontSize="small" />
                        {contact.phone}
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Email fontSize="small" />
                        {contact.email}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {sent && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Emergency alerts sent successfully. Help is on the way.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!sent && (
          <Button
            variant="contained"
            color="error"
            onClick={handleSendAlerts}
            disabled={sending}
            startIcon={sending ? <CircularProgress size={20} /> : null}
          >
            {sending ? 'Sending Alerts...' : 'Send Emergency Alerts'}
          </Button>
        )}
        <Button 
          onClick={onClose}
          disabled={sending}
        >
          {sent ? 'Close' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmergencyAlert;
