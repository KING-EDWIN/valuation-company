'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Job {
  id: number;
  client_name: string;
  client_info?: {
    email?: string;
  };
  asset_type: string;
  asset_details?: {
    location?: string;
  };
}

interface JobAssignment {
  id: number;
  job_id: number;
  field_worker_id: number | null;
  current_stage: string;
  created_at: string;
}

export default function JobAssignments() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedFieldWorker, setSelectedFieldWorker] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobsResponse = await fetch('/api/jobs', { cache: 'no-store' as RequestCache });
        const jobsData = await jobsResponse.json();
        if (jobsData.success) {
          setJobs(jobsData.data || []);
        }

        // Fetch users
        const usersResponse = await fetch('/api/users', { cache: 'no-store' as RequestCache });
        const usersData = await usersResponse.json();
        if (usersData.success) {
          setUsers(usersData.users || []);
        }

        // Fetch assignments
        const assignmentsResponse = await fetch('/api/job-assignments', { cache: 'no-store' as RequestCache });
        const assignmentsData = await assignmentsResponse.json();
        if (assignmentsData.success) {
          setAssignments(assignmentsData.data || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAssignmentForJob = (jobId: number) => {
    return assignments.find(a => a.job_id === jobId);
  };

  const getUserById = (userId: number) => {
    return users.find(u => u.id === userId);
  };

  const handleAssignJob = (job: Job) => {
    setSelectedJob(job);
    setSelectedFieldWorker('');
    setAssignDialogOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedJob || !selectedFieldWorker) return;

    try {
      const response = await fetch('/api/job-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: selectedJob.id,
          field_worker_id: parseInt(selectedFieldWorker),
          qa_id: null,
          md_id: null
        })
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ 
          open: true, 
          message: 'Job assigned to field worker successfully!', 
          severity: 'success' 
        });
        
        // Optimistically update list so UI moves instantly
        setAssignments(prev => [data.data, ...prev.filter(a => a.job_id !== selectedJob.id)]);

        // Refresh assignments (no-cache) to confirm
        const assignmentsResponse = await fetch('/api/job-assignments', { cache: 'no-store' as RequestCache });
        const assignmentsData = await assignmentsResponse.json();
        if (assignmentsData.success) {
          setAssignments(assignmentsData.data || []);
        }
        
        setAssignDialogOpen(false);
        setSelectedJob(null);
        setSelectedFieldWorker('');
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to assign job', severity: 'error' });
      }
    } catch (error) {
      console.error('Error assigning job:', error);
      setSnackbar({ open: true, message: 'Failed to assign job', severity: 'error' });
    }
  };

  const getFieldWorkers = () => users.filter(u => u.role === 'field_team');

  // Separate jobs into assigned and unassigned
  const unassignedJobs = jobs.filter(job => {
    const assignment = getAssignmentForJob(job.id);
    return !assignment || !assignment.field_worker_id;
  });
  
  const assignedJobs = jobs.filter(job => {
    const assignment = getAssignmentForJob(job.id);
    return assignment && assignment.field_worker_id;
  });

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading job assignments...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssignmentIcon color="primary" />
          Job Assignments & Workflow
        </Typography>
      </Box>

      {/* Unassigned Jobs Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Unassigned Jobs ({unassignedJobs.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These jobs need to be assigned to field workers. Admin can only assign to field supervisors.
        </Typography>
        
        <Grid container spacing={3}>
          {unassignedJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card sx={{ border: '2px solid', borderColor: 'warning.light' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                          {job.client_name?.charAt(0) || 'C'}
                        </Avatar>
                        {job.client_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {job.client_info?.email}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {job.asset_type} - {job.asset_details?.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        icon={<WarningIcon />}
                        label="Unassigned"
                        color="warning"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleAssignJob(job)}
                        size="small"
                      >
                        Assign to Field Worker
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recently Assigned Jobs Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon color="success" />
          Recently Assigned Jobs ({assignedJobs.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These jobs have been assigned to field workers. Field workers can submit their work to QA when ready.
        </Typography>
        
        <Grid container spacing={3}>
          {assignedJobs.map((job) => {
            const assignment = getAssignmentForJob(job.id);
            const fieldWorker = assignment?.field_worker_id ? getUserById(assignment.field_worker_id) : null;

            return (
              <Grid item xs={12} key={job.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {job.client_name?.charAt(0) || 'C'}
                          </Avatar>
                          {job.client_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {job.client_info?.email}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {job.asset_type} - {job.asset_details?.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Assigned to: {fieldWorker?.name || 'Unknown'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label="Assigned"
                          color="success"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Job Workflow</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Job Details:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Client:</strong> {selectedJob.client_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Project:</strong> {selectedJob.asset_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {selectedJob.asset_details?.location}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Admin Assignment:</strong> You can only assign this job to a Field Worker. 
                      The Field Worker will then submit their work to QA, and QA will submit to MD when ready.
                    </Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <InputLabel>Assign to Field Worker</InputLabel>
                    <Select
                      value={selectedFieldWorker}
                      onChange={(e) => setSelectedFieldWorker(e.target.value)}
                      label="Assign to Field Worker"
                    >
                      {getFieldWorkers().map((user) => (
                        <MenuItem key={user.id} value={user.id.toString()}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box>
                              <Typography variant="body2">{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAssignment} 
            variant="contained"
            disabled={!selectedFieldWorker}
          >
            Assign to Field Worker
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}