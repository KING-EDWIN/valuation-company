"use client";
import { useEffect } from "react";
import { Box, Typography, Paper, Button, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import Logo from '../../components/Logo';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function SystemManagerDashboard() {
  const { jobs } = useJobs();
  const { notifications, clearAllNotifications } = useNotifications();
  const router = useRouter();

  useEffect(() => { clearAllNotifications("system_manager"); }, [clearAllNotifications]);

  const totalJobs = jobs?.length || 0;
  const pendingJobs = jobs?.filter(j => j.status !== "complete").length || 0;
  const completedJobs = jobs?.filter(j => j.status === "complete").length || 0;
  const recentJobs = jobs?.slice(-3) || []; // Show last 3 jobs

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 6,
          px: 4,
          borderRadius: 4,
          mb: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push('/dashboard')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            ← Return to Dashboard
          </Button>
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
              {/* Logo and Company Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255,255,255,0.2)'
                }}>
                  <Logo size="medium" showText={true} color="light" />
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    borderRadius: 2,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>
                    SP
                  </Box>
                </Box>
              </Box>
              
              <BusinessIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                System Manager Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Oversee client acquisitions and workflow management
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
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Total Jobs</Typography>
                <Typography variant="h3" fontWeight={700} color="primary">{totalJobs}</Typography>
              </CardContent>
            </Card>
          </Grow>
          <Grow in timeout={1000}>
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
                <TrendingUpIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Active Jobs</Typography>
                <Typography variant="h3" fontWeight={700} color="warning.main">{pendingJobs}</Typography>
              </CardContent>
            </Card>
          </Grow>
          <Grow in timeout={1200}>
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
                <Typography variant="h6" color="text.secondary" gutterBottom>Completed</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">{completedJobs}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Notifications */}
        {notifications.system_manager.length > 0 && (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {notifications.system_manager.map(n => <div key={n.id}>{n.message}</div>)}
            </Alert>
          </Fade>
        )}

        {/* Recent Jobs Overview */}
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
          Recent Client Acquisitions
        </Typography>
        
        <Stack spacing={3}>
          {recentJobs.map((job, index) => (
            <Grow in timeout={1400 + index * 200} key={job.id}>
              <Paper sx={{ 
                p: 4, 
                borderLeft: `6px solid #1976d2`, 
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
                    bgcolor: '#1976d2', 
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
                      label={job.status.toUpperCase().replace('_', ' ')} 
                      size="small" 
                      sx={{ 
                        bgcolor: job.status === 'complete' ? '#43a047' : '#1976d2',
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

        {/* Quick Actions */}
        <Paper sx={{ 
          p: 4, 
          mt: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">
            Quick Actions
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>

            <Button 
              variant="outlined" 
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              View All Jobs
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
} 