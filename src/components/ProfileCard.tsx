import { Card, CardContent, Typography, styled } from '@mui/material';

const ProfileCardStyled = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { margin: theme.spacing(0.5) },
}));

const ProfileCard = ({ name, rating }: { name: string; rating: number }) => (
  <ProfileCardStyled>
    <CardContent>
      <Typography variant="h6">{name}</Typography>
      <Typography>Rating: {rating}/5</Typography>
    </CardContent>
  </ProfileCardStyled>
);

export default ProfileCard;