'use client';

import { 
  Box, Typography, Button, Card, CardContent, 
  TextField, Alert, CircularProgress, Paper, Divider
} from "@mui/material";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "../../components/UserContext";
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from "../../components/Logo";

// Demo users for easy testing
const demoUsers = [
  { 
    name: "Admin User 1", 
    email: "admin1@stanfield.com", 
    password: "admin123", 
    role: "admin",
    color: "#1976d2"
  },
  { 
    name: "Admin User 2", 
    email: "admin2@stanfield.com", 
    password: "admin123", 
    role: "admin",
    color: "#1976d2"
  },
  { 
    name: "Field Worker 1", 
    email: "field1@stanfield.com", 
    password: "field123", 
    role: "field_team",
    color: "#388e3c"
  },
  { 
    name: "Field Worker 2", 
    email: "field2@stanfield.com", 
    password: "field123", 
    role: "field_team",
    color: "#388e3c"
  },
  { 
    name: "QA Officer", 
    email: "qa@stanfield.com", 
    password: "qa123", 
    role: "qa_officer",
    color: "#7c3aed"
  },
  { 
    name: "Managing Director", 
    email: "md@stanfield.com", 
    password: "md123", 
    role: "md",
    color: "#e53935"
  },
  { 
    name: "Accountant", 
    email: "accounts@stanfield.com", 
    password: "accounts123", 
    role: "accounts",
    color: "#f57c00"
  }
];

export default function SignInPage() {
  const router = useRouter();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('stanfield_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role) {
          router.push('/dashboard');
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleDemoLogin = (demoUser: any) => {
    setLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        login(demoUser.role);
        router.push('/dashboard');
      } catch (err) {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user.role);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Box sx={{ width: '100%', maxWidth: 600, px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Logo size="large" showText={true} color="light" />
          </Box>
          <Typography variant="h4" fontWeight={700} color="white" mb={1}>
            Sign In
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)">
            Access your professional property valuation dashboard
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Demo Users Section */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255,255,255,0.95)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
                Demo Users
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Click any demo user to sign in instantly
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {demoUsers.map((user) => (
                  <Button
                    key={user.email}
                    variant="outlined"
                    onClick={() => handleDemoLogin(user)}
                    disabled={loading}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      p: 2,
                      borderRadius: 2,
                      borderColor: user.color,
                      color: user.color,
                      '&:hover': {
                        bgcolor: `${user.color}10`,
                        borderColor: user.color,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${user.color}30`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: user.color 
                      }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Manual Login Form */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255,255,255,0.95)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
                Manual Login
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your credentials to sign in
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Email */}
                  <TextField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />

                  {/* Password */}
                  <TextField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />

                  {/* Error Message */}
                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      bgcolor: '#1976d2',
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#1565c0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Signing In...
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon />
                        Sign In
                      </Box>
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>

        {/* Sign Up Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="text"
            onClick={() => router.push('/signup')}
            sx={{
              textTransform: 'none',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>

        {/* Back to Home */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/')}
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: 'none',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 600,
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255,255,255,0.2)',
                '&::before': {
                  transform: 'scaleX(1)',
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
                zIndex: -1,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}