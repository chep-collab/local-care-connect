import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Box, Typography, styled } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AppointmentManager from './components/AppointmentManager';
import Caregivers from './components/Caregivers';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Notifications from './components/Notifications';
import Dashboard from './components/Dashboard';
import Services from './components/Services';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2a5298', // Primary blue for buttons, accents
    },
    secondary: {
      main: '#26c6da', // Teal for secondary actions (e.g., edit, cancel)
    },
    background: {
      default: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      paper: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.5px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body1: { fontSize: '1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: '#26c6da' },
            '&.Mui-focused fieldset': { borderColor: '#2a5298' },
          },
          '& .MuiInputLabel-root': { color: '#bbbbbb' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#2a5298' },
        },
      },
    },
  },
});

const GradientBox = styled(Box)({
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  minHeight: '100vh',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: '0 15px',
  fontSize: '1.1rem',
  textDecoration: 'none',
  position: 'relative',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
  '&.active': {
    color: theme.palette.secondary.main,
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '50%',
      height: '2px',
      backgroundColor: theme.palette.secondary.main,
      bottom: '-4px',
      left: '25%',
    },
  },
  '@media (max-width: 600px)': {
    margin: '10px 0',
  },
}));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation(); // For active link styling

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GradientBox>
        <Typography variant="h4" sx={{ mb: 4, color: '#ffffff' }}>
          Local Care Connect
        </Typography>
        <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>Home</NavLink>
          <NavLink to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</NavLink>
          <NavLink to="/caregivers" className={location.pathname === '/caregivers' ? 'active' : ''}>Caregivers</NavLink>
          <NavLink to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</NavLink>
          <NavLink to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>Chat</NavLink>
          <NavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/caregivers" element={<Caregivers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </GradientBox>
    </ThemeProvider>
  );
};

const Home = () => (
  <Box>
    <AppointmentManager />
    <Notifications />
  </Box>
);

export default () => (
  <Router basename="/">
    <ScrollToTop />
    <App />
  </Router>
);