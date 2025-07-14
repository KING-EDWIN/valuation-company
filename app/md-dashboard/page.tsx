"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GavelIcon from '@mui/icons-material/Gavel';

export default function MDDashboard() {
  const { jobs, updateJob } = useJobs();
  const { notifications, clearNotifications, addNotification } = useNotifications();
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => { clearNotifications("md"); }, [clearNotifications]);

  const pendingJobs = jobs.filter(j => j.status === "pending MD approval");

  const handleApprove = (id: string) => {
    updateJob(id, {
      status: "pending payment",
      chain: { md: "Managing Director" },
    });
    addNotification("accounts", "New job ready for payment!", id);
    setSubmitted(s => ({ ...s, [id]: true }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)',
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
              <GavelIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Managing Director Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Final approval and oversight of valuation reports
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Stats Cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} justifyContent="center">
          <Grow in timeout={800}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#e53935', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Pending Approvals</Typography>
                <Typography variant="h3" fontWeight={700} color="error.main">{pendingJobs.length}</Typography>
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
                <Typography variant="h6" color="text.secondary" gutterBottom>Approved Reports</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">{jobs.filter(j => j.chain.md).length}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Notifications */}
        {notifications.md.length > 0 && (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {notifications.md.map(n => <div key={n.id}>{n.message}</div>)}
            </Alert>
          </Fade>
        )}

        {/* Jobs List */}
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
          Pending MD Approvals
        </Typography>
        
        {pendingJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs pending MD approval.
            </Typography>
          </Paper>
        )}
        
        <Stack spacing={3}>
          {pendingJobs.map((job, index) => (
            <Grow in timeout={1400 + index * 200} key={job.id}>
              <Paper sx={{ 
                p: 4, 
                borderLeft: '6px solid #e53935', 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={3} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: '#e53935', 
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
                    <Chip 
                      label="PENDING MD APPROVAL" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e53935',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </Stack>
                
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                    QA Notes:
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {job.qaNotes}
                  </Typography>
                </Paper>
                
                <Button
                  variant="contained"
                  disabled={submitted[job.id]}
                  onClick={() => handleApprove(job.id)}
                  sx={{
                    background: 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)',
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
                  Approve for Payment
                </Button>
                
                {submitted[job.id] && (
                  <Fade in timeout={500}>
                    <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                      Approved and sent to Accounts for payment processing!
                    </Alert>
                  </Fade>
                )}
              </Paper>
            </Grow>
          ))}
        </Stack>
      </Box>
    </Box>
  );
} 