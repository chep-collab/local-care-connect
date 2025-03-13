import React from 'react';
import { Chip, styled } from '@mui/material';

const BadgeContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
}));

const BadgeComponent = ({ points }: { points: number }) => {
  console.log('BadgeComponent is rendering');
  const badge = points > 100 ? 'Gold' : points > 50 ? 'Silver' : 'Bronze';

  return (
    <BadgeContainer>
      <Chip
        label={`Local Care Award: ${badge} Badge (${points} points)`}
        color={points > 100 ? 'warning' : points > 50 ? 'secondary' : 'default'}
        sx={{ fontSize: '1.1rem', padding: '8px 16px', color: '#333' }}
      />
    </BadgeContainer>
  );
};

export default BadgeComponent;