'use client';

import { Box, Typography, Button, Alert } from '@mui/material';
import { useUser } from '../../components/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const { user, login } = useUser();
  const router = useRouter();
  const [localStorageData, setLocalStorageData] = useState<string>('');

  const handleTestLogin = () => {
    console.log('=== TEST LOGIN ===');
    login('admin');
    console.log('Test login completed, user:', user);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleClearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('valuation_user');
      setLocalStorageData('Storage cleared');
      console.log('localStorage cleared');
    }
  };

  const checkLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('valuation_user');
      setLocalStorageData(stored || 'No data in localStorage');
      console.log('localStorage content:', stored);
    }
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  useEffect(() => {
    console.log('Test page - User state changed:', user);
    checkLocalStorage();
  }, [user]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" mb={4}>
        Test Page - User State Debug
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Current User State:
        </Typography>
        <Alert severity={user ? 'success' : 'info'} sx={{ mb: 2 }}>
          {user ? `Role: ${user.role}` : 'No user logged in'}
        </Alert>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>
          localStorage Content:
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          {localStorageData}
        </Alert>
        <Button onClick={checkLocalStorage} variant="outlined" sx={{ mr: 1 }}>
          Refresh Storage
        </Button>
        <Button onClick={handleClearStorage} variant="outlined" color="warning">
          Clear Storage
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={handleTestLogin}
          size="large"
        >
          Test Login as Admin
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handleGoToDashboard}
          size="large"
        >
          Go to Dashboard
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => router.push('/')}
          size="large"
        >
          Go to Landing Page
        </Button>

        <Button 
          variant="outlined" 
          onClick={() => router.push('/signin')}
          size="large"
        >
          Go to Sign In
        </Button>
      </Box>

      <Box sx={{ mt: 4, p: 3, bgcolor: '#f0f8ff', borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>
          Debug Information:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ textAlign: 'left', overflow: 'auto' }}>
          {JSON.stringify({ 
            user, 
            localStorageData,
            timestamp: new Date().toISOString(),
            windowAvailable: typeof window !== 'undefined'
          }, null, 2)}
        </Typography>
      </Box>
    </Box>
  );
}
