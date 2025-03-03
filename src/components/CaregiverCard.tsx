import { FC } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Rating, Button } from '@mui/material';
import { Caregiver } from '@/types';

interface CaregiverCardProps {
  caregiver: Caregiver;
  onSelect: (caregiver: Caregiver) => void;
  matchScore?: number;
}

const CaregiverCard: FC<CaregiverCardProps> = ({ caregiver, onSelect, matchScore }) => {
  return (
    <Card sx={{ 
      maxWidth: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
        transition: 'all 0.3s ease-in-out'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={caregiver.profileImage}
        alt={caregiver.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {caregiver.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={caregiver.rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({caregiver.rating})
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {caregiver.experience} years experience
        </Typography>

        <Box sx={{ mb: 2 }}>
          {caregiver.specializations.map((spec, index) => (
            <Chip
              key={index}
              label={spec}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        {matchScore && (
          <Typography 
            variant="body2" 
            color="primary"
            sx={{ mb: 2 }}
          >
            Match Score: {Math.round(matchScore * 100)}%
          </Typography>
        )}

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2
        }}>
          <Chip
            label={caregiver.verificationStatus}
            color={caregiver.verificationStatus === 'verified' ? 'success' : 'warning'}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {caregiver.credentials.length} verified credentials
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          fullWidth
          onClick={() => onSelect(caregiver)}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CaregiverCard;
