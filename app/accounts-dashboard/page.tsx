"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function AccountsDashboard() {
  const { jobs, updateJob, addJob } = useJobs();
  const { notifications, clearNotifications } = useNotifications();
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => { clearNotifications("accounts"); }, [clearNotifications]);

  // Add more dummy jobs for demo
  const handleLoadDemo = () => {
    addJob({
      clientName: "Demo Bank",
      assetType: "land",
      assetDetails: { location: "Jinja", landTitle: "LT9999", plotNo: "99C", size: "3", make: "", model: "", regNo: "", year: "" },
    });
    addJob({
      clientName: "Demo Motors",
      assetType: "car",
      assetDetails: { location: "", landTitle: "", plotNo: "", size: "", make: "Honda", model: "Civic", regNo: "UBB456Y", year: "2020" },
    });
  };

  const pendingJobs = jobs.filter(j => j.status === "pending payment");
  const completedJobs = jobs.filter(j => j.status === "complete");

  const handlePayment = (id: string) => {
    updateJob(id, {
      status: "complete",
      paymentReceived: true,
      chain: { accounts: "Accounts" },
    });
    setSubmitted(s => ({ ...s, [id]: true }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
          color: 'white',
          py: 6,
          px: 4,
          borderRadius: 4,
          mb: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          <Fade in timeout={1000}>
            <Box>
              <AccountBalanceIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Accounts Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage payments and financial processing
              </Typography>
            </Box>
          </Fade>
        </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} justifyContent="center">
        <Grow in timeout={800}>
          <Card sx={{ 
            minHeight: 140,
            minWidth: 200,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <PaidIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>Pending Payments</Typography>
              <Typography variant="h3" fontWeight={700} color="warning.main">{pendingJobs.length}</Typography>
            </CardContent>
          </Card>
        </Grow>
        <Grow in timeout={1000}>
          <Card sx={{ 
            minHeight: 140,
            minWidth: 200,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>Completed Payments</Typography>
              <Typography variant="h3" fontWeight={700} color="success.main">{completedJobs.length}</Typography>
            </CardContent>
          </Card>
        </Grow>
        <Grow in timeout={1200}>
          <Button 
            variant="outlined" 
            onClick={handleLoadDemo} 
            sx={{ 
              minHeight: 140,
              minWidth: 200,
              borderColor: '#6d4c41',
              color: '#6d4c41',
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#5d4037',
                backgroundColor: 'rgba(109, 76, 65, 0.04)',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
          >
            Add Demo Jobs
          </Button>
        </Grow>
      </Stack>
      {notifications.accounts.length > 0 && (
        <Fade in timeout={1200}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            {notifications.accounts.map(n => <div key={n.id}>{n.message}</div>)}
          </Alert>
        </Fade>
      )}
      <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">Jobs Needing Payment</Typography>
      <Stack spacing={3}>
        {pendingJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs pending payment.
            </Typography>
          </Paper>
        )}
        {pendingJobs.map((job, index) => (
          <Grow in timeout={1400 + index * 200} key={job.id}>
            <Paper sx={{ 
              p: 4, 
              borderLeft: '6px solid #6d4c41', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
              }
            }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{ 
                  bgcolor: '#6d4c41', 
                  color: '#fff',
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  {job.clientName[0]}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    {job.clientName} ({job.assetType.toUpperCase()})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Asset: {Object.values(job.assetDetails).filter(Boolean).join(", ")}
                  </Typography>
                  <Chip 
                    label="PENDING PAYMENT" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#6d4c41',
                      color: 'white',
                      fontWeight: 600,
                      mb: 1
                    }} 
                  />
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Chain of Custody:
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                      {job.chain.surveyor && (
                        <Chip 
                          label={`Surveyor: ${job.chain.surveyor}`} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.qa && (
                        <Chip 
                          label={`QA: ${job.chain.qa}`} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.md && (
                        <Chip 
                          label={`MD: ${job.chain.md}`} 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.accounts && (
                        <Chip 
                          label={`Accounts: ${job.chain.accounts}`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  disabled={submitted[job.id]}
                  onClick={() => handlePayment(job.id)}
                  sx={{
                    background: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Mark Payment Received
                </Button>
              </Stack>
              {submitted[job.id] && (
                <Fade in timeout={500}>
                  <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                    Payment marked as received successfully!
                  </Alert>
                </Fade>
              )}
            </Paper>
          </Grow>
        ))}
      </Stack>
      <Typography variant="h5" mt={5} mb={3} fontWeight={600} color="text.primary">Completed Payments</Typography>
      <Stack spacing={3}>
        {completedJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No completed payments yet.
            </Typography>
          </Paper>
        )}
        {completedJobs.map((job, index) => (
          <Grow in timeout={1600 + index * 200} key={job.id}>
            <Paper sx={{ 
              p: 4, 
              borderLeft: '6px solid #43a047', 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
              }
            }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{ 
                  bgcolor: '#43a047', 
                  color: '#fff',
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  {job.clientName[0]}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    {job.clientName} ({job.assetType.toUpperCase()})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Asset: {Object.values(job.assetDetails).filter(Boolean).join(", ")}
                  </Typography>
                  <Chip 
                    label="PAYMENT COMPLETED" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#43a047',
                      color: 'white',
                      fontWeight: 600,
                      mb: 1
                    }} 
                  />
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Chain of Custody:
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                      {job.chain.surveyor && (
                        <Chip 
                          label={`Surveyor: ${job.chain.surveyor}`} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.qa && (
                        <Chip 
                          label={`QA: ${job.chain.qa}`} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.md && (
                        <Chip 
                          label={`MD: ${job.chain.md}`} 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                      {job.chain.accounts && (
                        <Chip 
                          label={`Accounts: ${job.chain.accounts}`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grow>
        ))}
      </Stack>
      </Box>
    </Box>
  );
} 