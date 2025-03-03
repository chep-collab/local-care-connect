'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <Paper 
      elevation={3}
      className="animate-slide-up"
      sx={{ 
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        borderRadius: 3
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center" className="gradient-text">
        Welcome Back
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ 
            mt: 3,
            mb: 2,
            background: 'var(--gradient-primary)',
            height: 48
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Button
        fullWidth
        variant="outlined"
        size="large"
        onClick={handleGoogleSignIn}
        startIcon={<GoogleIcon />}
        sx={{ height: 48 }}
      >
        Continue with Google
      </Button>

      <Box mt={3} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Button
            color="primary"
            onClick={() => router.push('/auth/signup')}
            sx={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
}
