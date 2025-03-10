import React from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const navItems = ['Dashboard', 'Services', 'Contact'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ background: 'transparent', backdropFilter: 'blur(10px)' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'primary.main', textDecoration: 'none' }}>
            Local Care Connect
          </Typography>
          {isMobile ? (
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  component={RouterLink}
                  to={`/${item.toLowerCase()}`}
                  color="inherit"
                  aria-label={`Navigate to ${item}`}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {navItems.map((item) => (
              <MenuItem key={item} onClick={() => handleMenuClick(`/${item.toLowerCase()}`)}>
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
// In src/components/Header.tsx
const Header = () => {
  console.log('Header is rendering');
  // ... rest of the code
};

// In src/components/AppointmentManager.tsx
const AppointmentManager = () => {
  console.log('AppointmentManager is rendering');
  // ... rest of the code
};

// Repeat for Chat, ServiceSelector, ProfileCard, BadgeComponent
export default Header;

