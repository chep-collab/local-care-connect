import { Box, Container, Grid } from '@mui/material';
import { ActivityTimeline } from './ActivityTimeline';
import { StatisticsCards } from './StatisticsCards';

export default function Dashboard() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StatisticsCards />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActivityTimeline />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
