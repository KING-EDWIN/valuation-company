"use client";
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Alert } from '@mui/material';

export default function DebugJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setJobs(data.data);
      } else {
        setError('Failed to fetch jobs: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Debug Jobs API
      </Typography>
      
      <Button onClick={fetchJobs} variant="contained" sx={{ mb: 2 }}>
        Refresh Jobs
      </Button>

      {loading && <Typography>Loading...</Typography>}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Jobs Count: {jobs?.length || 0}
      </Typography>

      {jobs.map((job: any) => (
        <Card key={job.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{job.client_name}</Typography>
            <Typography variant="body2">Status: {job.status}</Typography>
            <Typography variant="body2">Asset Type: {job.asset_type}</Typography>
            <Typography variant="body2">ID: {job.id}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}


