import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Collapse,
  Alert,
  Tooltip,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Info,
  AccessTime,
  Euro,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

// TODO: Add proper form validation
// TODO: Add accessibility improvements
// FIXME: Duration calculation sometimes off by 30min
// NOTE: Rates need to be confirmed with business team

interface Service {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  minDuration: number;
  maxDuration: number;
  requiresAssessment: boolean;
}

interface Props {
  services: Service[];
  onServiceSelect: (selections: {
    serviceId: string;
    duration: number;
    notes: string;
  }[]) => void;
}

// Hardcoded services for now - should come from API
const SERVICES: Service[] = [
  {
    id: 'personal_care',
    name: 'Personal Care',
    description: 'Assistance with daily activities like bathing, dressing, and grooming',
    baseRate: 25,
    minDuration: 60,
    maxDuration: 180,
    requiresAssessment: true
  },
  {
    id: 'medication',
    name: 'Medication Management',
    description: 'Monitoring and assistance with medication schedules',
    baseRate: 30,
    minDuration: 30,
    maxDuration: 60,
    requiresAssessment: true
  },
  {
    id: 'companionship',
    name: 'Companionship',
    description: 'Social interaction, conversation, and recreational activities',
    baseRate: 20,
    minDuration: 60,
    maxDuration: 240,
    requiresAssessment: false
  },
  {
    id: 'mobility',
    name: 'Mobility Support',
    description: 'Assistance with walking, transfers, and exercises',
    baseRate: 28,
    minDuration: 45,
    maxDuration: 120,
    requiresAssessment: true
  }
];

export const ServiceSelector: React.FC<Props> = ({ onServiceSelect }) => {
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: {
      duration: number;
      notes: string;
    };
  }>({});

  const [showAssessmentAlert, setShowAssessmentAlert] = useState(true);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev => {
      const newState = { ...prev };
      
      if (newState[service.id]) {
        delete newState[service.id];
      } else {
        newState[service.id] = {
          duration: service.minDuration,
          notes: ''
        };
      }
      
      return newState;
    });
  };

  const handleDurationChange = (serviceId: string, change: number) => {
    setSelectedServices(prev => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return prev;

      const currentDuration = prev[serviceId]?.duration || service.minDuration;
      const newDuration = Math.min(
        Math.max(currentDuration + change, service.minDuration),
        service.maxDuration
      );

      return {
        ...prev,
        [serviceId]: {
          ...prev[serviceId],
          duration: newDuration
        }
      };
    });
  };

  const calculateTotalCost = () => {
    return Object.entries(selectedServices).reduce((total, [serviceId, details]) => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return total;
      
      const hours = details.duration / 60;
      return total + (service.baseRate * hours);
    }, 0);
  };

  const calculateTotalDuration = () => {
    return Object.values(selectedServices).reduce((total, details) => {
      return total + details.duration;
    }, 0);
  };

  // Check if any selected service requires assessment
  const requiresAssessment = Object.keys(selectedServices).some(serviceId => {
    const service = SERVICES.find(s => s.id === serviceId);
    return service?.requiresAssessment;
  });

  return (
    <Box>
      {/* Assessment Alert */}
      {requiresAssessment && showAssessmentAlert && (
        <Alert 
          severity="info" 
          onClose={() => setShowAssessmentAlert(false)}
          sx={{ mb: 2 }}
        >
          Some selected services require an initial assessment. Our care coordinator
          will contact you to schedule this before the first visit.
        </Alert>
      )}

      {/* Service Cards */}
      {SERVICES.map(service => {
        const isSelected = Boolean(selectedServices[service.id]);
        
        return (
          <Card 
            key={service.id}
            sx={{
              mb: 2,
              border: theme => isSelected 
                ? `2px solid ${theme.palette.primary.main}`
                : '2px solid transparent'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="flex-start">
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleServiceToggle(service)}
                />
                
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">
                      {service.name}
                    </Typography>
                    
                    {service.requiresAssessment && (
                      <Tooltip title="Requires initial assessment">
                        <Info color="action" fontSize="small" />
                      </Tooltip>
                    )}
                  </Box>

                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {service.description}
                  </Typography>

                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2}
                    mt={1}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2">
                        {service.minDuration}-{service.maxDuration} min
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Euro fontSize="small" color="action" />
                      <Typography variant="body2">
                        £{service.baseRate}/hour
                      </Typography>
                    </Box>
                  </Box>

                  {/* Duration and Notes (when selected) */}
                  <Collapse in={isSelected}>
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Duration
                      </Typography>
                      
                      <Box 
                        display="flex" 
                        alignItems="center"
                        gap={1}
                        mb={2}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleDurationChange(service.id, -30)}
                          disabled={
                            selectedServices[service.id]?.duration <= service.minDuration
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography>
                          {selectedServices[service.id]?.duration} min
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() => handleDurationChange(service.id, 30)}
                          disabled={
                            selectedServices[service.id]?.duration >= service.maxDuration
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Special requirements or notes"
                        value={selectedServices[service.id]?.notes || ''}
                        onChange={(e) => {
                          setSelectedServices(prev => ({
                            ...prev,
                            [service.id]: {
                              ...prev[service.id],
                              notes: e.target.value
                            }
                          }));
                        }}
                        InputProps={{
                          // Limit note length
                          inputProps: { maxLength: 500 }
                        }}
                      />
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      {Object.keys(selectedServices).length > 0 && (
        <Box 
          mt={3}
          p={2}
          bgcolor="primary.light"
          borderRadius={1}
        >
          <Typography variant="subtitle1" gutterBottom>
            Summary
          </Typography>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Total Duration:</Typography>
            <Typography>{calculateTotalDuration()} minutes</Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between">
            <Typography>Estimated Cost:</Typography>
            <Typography>£{calculateTotalCost().toFixed(2)}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
