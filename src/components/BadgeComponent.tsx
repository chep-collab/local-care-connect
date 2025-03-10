import { Chip, styled } from '@mui/material';

const BadgeContainer = styled('div')(({ theme }) => ({
  display: 'flex', gap: theme.spacing(1), flexWrap: 'wrap',
  background: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '10px',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.5) },
}));

const BadgeComponent = ({ points }: { points: number }) => {
  const badges = points > 100 ? ['Gold'] : points > 50 ? ['Silver'] : [];
  return (
    <BadgeContainer>
      <h3>Achievements</h3>
      {badges.map((badge) => <Chip key={badge} label={badge} color="primary" />)}
    </BadgeContainer>
  );
};

export default BadgeComponent;