import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Skeleton
} from '@mui/material';
import { AccessTime, LocationOn, Verified } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Caregiver } from '@/types';

// TODO: Add proper image loading state handling
// TODO: Add error boundary for failed profile loads
// FIXME: Rating component sometimes flickers on hover

interface Props {
  caregiver: Caregiver;
  distance?: number;
  matchScore?: number;
  onBookClick?: () => void;
  isLoading?: boolean;
}

export const CaregiverCard: React.FC<Props> = ({
  caregiver,
  distance,
  matchScore,
  onBookClick,
  isLoading = false
}) => {
  // Quick fix for undefined images
  const profileImage = caregiver.profileImage || '/images/default-avatar.png';

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={profileImage}
        alt={caregiver.name}
        sx={{ 
          objectFit: 'cover',
          // Temporary fix for image loading jank
          backgroundColor: '#f5f5f5'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {isLoading ? <Skeleton width={150} /> : caregiver.name}
          </Typography>
          {caregiver.verificationStatus === 'verified' && (
            <Verified color="primary" titleAccess="Verified Caregiver" />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating 
            value={caregiver.rating} 
            readOnly 
            precision={0.5}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            ({caregiver.rating})
          </Typography>
        </Box>

        {/* Specializations */}
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
          {caregiver.specializations.map((spec) => (
            <Chip
              key={spec}
              label={spec.replace('_', ' ')}
              size="small"
              // Ran out of time to add proper color coding
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {/* Location & Experience */}
        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">
              {isLoading ? (
                <Skeleton width={100} />
              ) : (
                `${caregiver.location.city} ${distance ? `(${distance.toFixed(1)} miles)` : ''}`
              )}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              {`${caregiver.experience} years experience`}
            </Typography>
          </Box>
        </Box>

        {/* Match Score - if provided */}
        {matchScore && (
          <Box 
            mb={2} 
            p={1} 
            bgcolor="primary.light" 
            borderRadius={1}
            display="flex"
            justifyContent="center"
          >
            <Typography variant="body2" color="primary.contrastText">
              {`${Math.round(matchScore * 100)}% Match`}
            </Typography>
          </Box>
        )}

        {/* Book Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={onBookClick}
          disabled={isLoading}
        >
          Book Consultation
        </Button>
      </CardContent>
    </Card>
  );
};
