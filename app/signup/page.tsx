'use client';

import { 
  Box, Typography, Button, Card, CardContent, 
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, Paper
} from "@mui/material";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from "../../components/Logo";

const roles = [
  { 
    key: "field_team", 
    label: "Field Team", 
    description: "Conduct field inspections and submit detailed reports"
  },
  { 
    key: "qa_officer", 
    label: "QA Officer", 
    description: "Review and quality assure all field reports and documents"
  },
  { 
    key: "md", 
    label: "Managing Director", 
    description: "Final approval and strategic oversight of all valuations"
  },
  { 
    key: "accounts", 
    label: "Accounts", 
    description: "Handle billing, payments, and financial management"
  },
  { 
    key: "admin", 
    label: "Admin", 
    description: "Manage clients, assign jobs, and oversee the entire workflow"
  }
];

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    department: ''
  });

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          department: formData.department
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Your account is pending approval from MD/QA. You will receive an email once approved.');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
          phone: '',
          department: ''
        });
      } else {
        setError(data.error || 'Failed to create account');
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
      <Box sx={{ width: '100%', maxWidth: 500, px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Logo size="large" showText={true} color="light" />
          </Box>
          <Typography variant="h4" fontWeight={700} color="white" mb={1}>
            Create Account
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)">
            Join our professional property valuation team
          </Typography>
        </Box>

        {/* Sign Up Form */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(255,255,255,0.95)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Name */}
                <TextField
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  fullWidth
                  variant="outlined"
                />

                {/* Email */}
                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  fullWidth
                  variant="outlined"
                />

                {/* Phone */}
                <TextField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  fullWidth
                  variant="outlined"
                />

                {/* Department */}
                <TextField
                  label="Department"
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  fullWidth
                  variant="outlined"
                />

                {/* Role Selection */}
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleInputChange('role')}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.key} value={role.key}>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {role.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  fullWidth
                  variant="outlined"
                  helperText="Minimum 6 characters"
                />

                {/* Confirm Password */}
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                  fullWidth
                  variant="outlined"
                />

                {/* Error/Success Messages */}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {success}
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
                    fontSize: '1.1rem',
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
                      Creating Account...
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonAddIcon />
                      Create Account
                    </Box>
                  )}
                </Button>

                {/* Back to Sign In */}
                <Button
                  variant="outlined"
                  onClick={() => router.push('/signin')}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    textTransform: 'none',
                    color: '#1976d2',
                    borderColor: '#1976d2',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: '#1565c0',
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.2)',
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
                      background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                      zIndex: -1,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Already have an account? Sign In
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

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

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
