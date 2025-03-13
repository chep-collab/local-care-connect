import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#0288d1' },
    background: { default: '#1a237e', paper: '#ffffff' },
    text: { primary: '#ffffff', secondary: '#bbbbbb' },
  },
  typography: {
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    h4: { fontSize: '2rem', color: '#ffffff' },
    h5: { fontSize: '1.5rem', color: '#ffffff' },
    body1: { fontSize: '1.2rem', color: '#ffffff' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { background: 'rgba(255, 255, 255, 0.4)', color: '#333' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { fontSize: '1.1rem', padding: '10px', color: '#333' },
      },
    },
  },
});