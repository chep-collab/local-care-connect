import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, styled } from '@mui/material';
import { Help } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
}));

const Header = () => {
  console.log('Header is rendering');
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
          Local Care Connect
        </Typography>
        <Button color="inherit" sx={{ color: '#ffffff' }}>Dashboard</Button>
        <Button color="inherit" sx={{ color: '#ffffff' }}>Services</Button>
        <Button color="inherit" sx={{ color: '#ffffff' }}>Contact</Button>
        <IconButton color="inherit" onClick={() => alert('Welcome to Local Care Connect! Select a service, book an appointment, or chat with a caregiver.')}>
          <Help sx={{ color: '#ffffff' }} />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
