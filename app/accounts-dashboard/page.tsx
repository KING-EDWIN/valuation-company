'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Grow
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Paid as PaidIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function AccountsDashboard() {
  const router = useRouter();
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string; clientName: string; assetType: string; location: string; amount: number } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Mock data for demonstration
  const mockJobs = [
    {
      id: '1',
      clientName: 'John Doe',
      assetType: 'Land',
      status: 'pending payment',
      amount: 5000000,
      location: 'Kampala'
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      assetType: 'Building',
      status: 'completed',
      amount: 8000000,
      location: 'Entebbe'
    },
    {
      id: '3',
      clientName: 'Mike Johnson',
      assetType: 'Vehicle',
      status: 'pending payment',
      amount: 3000000,
      location: 'Jinja'
    }
  ];

  const pendingJobs = mockJobs.filter(job => job.status === 'pending payment');
  const completedJobs = mockJobs.filter(job => job.status === 'completed');

  const handlePayment = (job: { id: string; clientName: string; assetType: string; location: string; amount: number }) => {
    setSelectedJob(job);
    setPaymentAmount(job.amount.toString());
    setOpenPaymentDialog(true);
  };

  const processPayment = () => {
    if (selectedJob && paymentAmount) {
      // Here you would typically update the job status
      console.log(`Processing payment of ${paymentAmount} for job ${selectedJob.id}`);
      setOpenPaymentDialog(false);
      setSelectedJob(null);
      setPaymentAmount('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button 
            onClick={() => router.back()}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Accounts Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage payments and financial processing
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grow in timeout={800}>
          <Box>
            {/* Summary Cards */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
              <Card sx={{ flex: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PaidIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
                    {pendingJobs.length}
                  </Typography>
                  <Typography variant="h6">Pending Payments</Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
                    {completedJobs.length}
                  </Typography>
                  <Typography variant="h6">Completed Jobs</Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccountBalanceIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
                    UGX {mockJobs.reduce((sum, job) => sum + job.amount, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="h6">Total Value</Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Pending Payments */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                Pending Payments
              </Typography>
              
              {pendingJobs.length === 0 ? (
                <Alert severity="info">No pending payments at this time.</Alert>
              ) : (
                <List>
                  {pendingJobs.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <ListItem>
                        <ListItemIcon>
                          <PaymentIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${job.clientName} - ${job.assetType}`}
                          secondary={`Location: ${job.location} | Amount: UGX ${job.amount.toLocaleString()}`}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePayment(job)}
                        >
                          Process Payment
                        </Button>
                      </ListItem>
                      {index < pendingJobs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>

            {/* Completed Jobs */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" />
                Completed Jobs
              </Typography>
              
              {completedJobs.length === 0 ? (
                <Alert severity="info">No completed jobs at this time.</Alert>
              ) : (
                <List>
                  {completedJobs.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${job.clientName} - ${job.assetType}`}
                          secondary={`Location: ${job.location} | Amount: UGX ${job.amount.toLocaleString()}`}
                        />
                        <Chip label="Paid" color="success" variant="outlined" />
                      </ListItem>
                      {index < completedJobs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Grow>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedJob.clientName} - {selectedJob.assetType}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Location: {selectedJob.location}
              </Typography>
              
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <Alert severity="info">
                This will mark the job as completed and payment received.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={processPayment}>
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
