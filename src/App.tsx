import { Box, Container, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { StatisticsCards } from './components/Dashboard/StatisticsCards';
import { ActivityTimeline } from './components/Dashboard/ActivityTimeline';
import Chat from './components/Chat'; // New
import AppointmentManager from './components/AppointmentManager'; // New
import ServiceSelector from './components/ServiceSelector'; // New
import ProfileCard from './components/ProfileCard'; // New
import BadgeComponent from './components/BadgeComponent'; // New
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
          py: 4
        }}
      >
        <Container>
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
    </ThemeProvider>
  );
}

export default App;