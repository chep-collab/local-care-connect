import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  AccessTime,
  LocationOn,
  Person,
  Edit,
  Cancel,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { format, isAfter, isBefore, addHours } from 'date-fns';
import { Appointment } from '@/types';

// TODO: Add proper date formatting for different locales
// TODO: Handle timezone differences
// FIXME: Cancel button sometimes requires double click
// NOTE: Payment status check needs proper implementation

interface Props {
  appointment: Appointment;
  userType: 'patient' | 'caregiver';
  onCancel?: (reason: string) => void;
  onReschedule?: () => void;
  onComplete?: () => void;
}

export const AppointmentCard: React.FC<Props> = ({
  appointment,
  userType,
  onCancel,
  onReschedule,
  onComplete
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Quick check if appointment can be cancelled (24h notice)
  const canCancel = isAfter(
    new Date(appointment.startTime),
    addHours(new Date(), 24)
  );

  // Check if appointment is upcoming
  const isUpcoming = isAfter(new Date(appointment.startTime), new Date());
  
  // Check if appointment is in progress
  const isInProgress = isBefore(new Date(appointment.startTime), new Date()) &&
    isAfter(new Date(appointment.endTime), new Date());

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      setCancelError('Please provide a reason for cancellation');
      return;
    }

    onCancel?.(cancelReason);
    setShowCancelDialog(false);
    setCancelReason('');
    setCancelError('');
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTime = (date: Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy - h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        position: 'relative',
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <CardContent>
        {/* Status Badge */}
        <Box position="absolute" top={16} right={16}>
          <Chip
            label={appointment.status}
            color={getStatusColor()}
            size="small"
          />
        </Box>

        {/* Main Content */}
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            {appointment.careServices.map(service => service.type).join(', ')}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Person color="action" />
            <Typography>
              {userType === 'patient' 
                ? appointment.caregiver.name 
                : appointment.patient.name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AccessTime color="action" />
            <Typography>
              {formatTime(appointment.startTime)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn color="action" />
            <Typography>
              {appointment.location.address}
            </Typography>
          </Box>
        </Box>

        {/* Payment Status - if applicable */}
        {appointment.payment && (
          <Box mb={2}>
            <Alert 
              severity={appointment.payment.status === 'paid' ? 'success' : 'warning'}
              sx={{ '& .MuiAlert-message': { width: '100%' } }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                  Payment Status: {appointment.payment.status}
                </Typography>
                <Typography variant="body2">
                  £{(appointment.payment.amount / 100).toFixed(2)}
                </Typography>
              </Box>
            </Alert>
          </Box>
        )}

        {/* Action Buttons */}
        <Box 
          display="flex" 
          justifyContent="flex-end"
          gap={1}
          mt={2}
        >
          {isUpcoming && !appointment.payment?.status && (
            <Button
              variant="contained"
              color="primary"
              size="small"
            >
              Complete Payment
            </Button>
          )}

          {isUpcoming && canCancel && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Cancel />}
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel
            </Button>
          )}

          {isInProgress && userType === 'caregiver' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              onClick={onComplete}
            >
              Complete
            </Button>
          )}

          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* More Options Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={onReschedule}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Reschedule
          </MenuItem>
          <MenuItem onClick={() => {/* TODO: Add to calendar */}}>
            Add to Calendar
          </MenuItem>
          <MenuItem onClick={() => {/* TODO: View details */}}>
            View Details
          </MenuItem>
        </Menu>

        {/* Cancel Dialog */}
        <Dialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Cancel Appointment
          </DialogTitle>
          <DialogContent>
            {!canCancel && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Less than 24 hours notice - cancellation fee may apply
              </Alert>
            )}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for cancellation"
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                setCancelError('');
              }}
              error={Boolean(cancelError)}
              helperText={cancelError}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Appointment
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
            >
              Cancel Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
