'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Storage as DatabaseIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

export default function InitDatabase() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const initializeDatabase = async () => {
    setLoading(true);
    setError('');
    setMessage('Initializing database tables...');
    
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Database initialized successfully!');
        setSuccess(true);
      } else {
        throw new Error(data.error || 'Failed to initialize database');
      }
    } catch (err) {
      console.error('Database initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  const migrateData = async () => {
    setLoading(true);
    setError('');
    setMessage('Migrating sample data to database...');
    
    try {
      const response = await fetch('/api/migrate-data', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`Successfully migrated ${data.count} jobs to database!`);
        setSuccess(true);
      } else {
        throw new Error(data.error || 'Failed to migrate data');
      }
    } catch (err) {
      console.error('Data migration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to migrate data');
    } finally {
      setLoading(false);
    }
  };

  const handleFullSetup = async () => {
    setLoading(true);
    setError('');
    setMessage('Setting up complete database system...');
    
    try {
      // Initialize database
      setMessage('Step 1: Initializing database tables...');
      const initResponse = await fetch('/api/init-db', {
        method: 'POST',
      });
      
      const initData = await initResponse.json();
      
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize database');
      }
      
      // Migrate data
      setMessage('Step 2: Migrating sample data...');
      const migrateResponse = await fetch('/api/migrate-data', {
        method: 'POST',
      });
      
      const migrateData = await migrateResponse.json();
      
      if (!migrateData.success) {
        throw new Error(migrateData.error || 'Failed to migrate data');
      }
      
      setMessage(`Database setup complete! Migrated ${migrateData.count} jobs.`);
      setSuccess(true);
    } catch (err) {
      console.error('Setup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to setup database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <DatabaseIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Database Initialization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set up your Vercel database and migrate sample data
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This will initialize the database tables and migrate all sample data in one step.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleFullSetup}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{ mb: 2 }}
            fullWidth
          >
            {loading ? 'Setting up...' : 'Complete Database Setup'}
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Initialize Database
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create all necessary database tables
            </Typography>
            
            <Button
              variant="outlined"
              onClick={initializeDatabase}
              disabled={loading}
              startIcon={<DatabaseIcon />}
              fullWidth
            >
              Initialize Tables
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Migrate Sample Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Load sample jobs and client data
            </Typography>
            
            <Button
              variant="outlined"
              onClick={migrateData}
              disabled={loading}
              startIcon={<UploadIcon />}
              fullWidth
            >
              Migrate Data
            </Button>
          </CardContent>
        </Card>
      </Box>

      {message && (
        <Alert 
          severity={success ? "success" : "info"} 
          sx={{ mb: 2 }}
          icon={success ? <CheckIcon /> : undefined}
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎉 Database Setup Complete!
            </Typography>
            <Typography variant="body2">
              Your database is now ready. You can start using the application with real data from Vercel Postgres.
              All static data has been migrated and the frontend will now fetch data from the API.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
