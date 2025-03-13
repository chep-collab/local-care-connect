import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, styled, TextField, Button, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const ProfileCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

const ProfileImage = styled('img')({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #26c6da',
  marginBottom: '16px',
});

const AchievementItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.05)',
  marginBottom: theme.spacing(1),
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Profile = () => {
  const [email, setEmail] = useState('john@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [appointments] = useState<string[]>([]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (isEditing) {
      if (password && password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      alert('Profile updated!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Box>
      <ProfileCard>
        <CardContent sx={{ textAlign: 'center' }}>
          {profilePicture ? (
            <ProfileImage src={profilePicture} alt="Profile" />
          ) : (
            <Box sx={{ mb: 2 }}>
              <IconButton component="label">
                <PhotoCamera sx={{ fontSize: 40 }} />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </IconButton>
            </Box>
          )}
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isEditing}
          />
          {isEditing && (
            <>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </>
          )}
          <Button
            variant="contained"
            color={isEditing ? 'primary' : 'secondary'}
            onClick={isEditing ? handleSave : handleEditToggle}
            sx={{ mt: 2 }}
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button>
        </CardContent>
      </ProfileCard>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Appointment History
      </Typography>
      <ProfileCard>
        <CardContent>
          {appointments.length === 0 ? (
            <Typography>No appointments yet.</Typography>
          ) : (
            appointments.map((apt, index) => (
              <Typography key={index}>{apt}</Typography>
            ))
          )}
        </CardContent>
      </ProfileCard>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Achievements
      </Typography>
      <ProfileCard>
        <CardContent>
          <AchievementItem>
            <Typography>First Appointment</Typography>
            <Typography sx={{ color: '#bbbbbb' }}>Completed your first appointment</Typography>
          </AchievementItem>
          <AchievementItem>
            <Typography>Top Caregiver</Typography>
            <Typography sx={{ color: '#bbbbbb' }}>Achieved 100 points</Typography>
          </AchievementItem>
        </CardContent>
      </ProfileCard>
    </Box>
  );
};

export default Profile;