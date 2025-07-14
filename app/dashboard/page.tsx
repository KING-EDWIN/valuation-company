"use client";
import { Box, Typography, Button, Paper, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useJobs } from "../../components/JobsContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

const rolePages: Record<string, { label: string; path: string }[]> = {
  system_manager: [
    { label: "System Manager Dashboard", path: "/system-manager-dashboard" },
    { label: "Client Acquisition", path: "/client-acquisition" },
  ],
  field_team: [
    { label: "Field Team Dashboard", path: "/field-dashboard" },
  ],
  qa_officer: [
    { label: "QA Dashboard", path: "/qa-dashboard" },
  ],
  md: [
    { label: "MD Dashboard", path: "/md-dashboard" },
  ],
  accounts: [
    { label: "Accounts Dashboard", path: "/accounts-dashboard" },
  ],
};

const roleColors: Record<string, string> = {
  system_manager: '#1976d2',
  field_team: '#00897b',
  qa_officer: '#7c3aed',
  md: '#e53935',
  accounts: '#6d4c41',
};

const roleGradients: Record<string, string> = {
  system_manager: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  field_team: 'linear-gradient(135deg, #00897b 0%, #4db6ac 100%)',
  qa_officer: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  md: 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)',
  accounts: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
};

export default function Dashboard() {
  const { user } = useUser();
  const { jobs } = useJobs();
  const router = useRouter();
  if (!user) return null;
  const pages = rolePages[user.role] || [];

  // Job stats for summary cards
  const total = jobs.length;
  const pending = jobs.filter(j => j.status !== "complete").length;
  const completed = jobs.filter(j => j.status === "complete").length;

  // Jobs relevant to this role
  let relevantJobs = jobs;
  if (user.role === "field_team") relevantJobs = jobs.filter(j => j.status === "pending fieldwork");
  if (user.role === "qa_officer") relevantJobs = jobs.filter(j => j.status === "pending QA");
  if (user.role === "md") relevantJobs = jobs.filter(j => j.status === "pending MD approval");
  if (user.role === "accounts") relevantJobs = jobs.filter(j => j.status === "pending payment");

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: roleGradients[user.role],
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
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Welcome, {user.role.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage your valuation workflow efficiently
            </Typography>
          </Box>
        </Fade>
      </Box>

      <Box sx={{ px: 4 }}>
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
                <Typography variant="h3" fontWeight={700} color="primary">{total}</Typography>
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
                <ScheduleIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Pending</Typography>
                <Typography variant="h3" fontWeight={700} color="warning.main">{pending}</Typography>
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
                <Typography variant="h3" fontWeight={700} color="success.main">{completed}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Quick Actions */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">
            Quick Actions
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            {pages.map((page: { label: string; path: string }, index: number) => (
              <Grow in timeout={1400 + index * 200} key={page.path}>
                <Button 
                  variant="contained" 
                  onClick={() => router.push(page.path)}
                  sx={{
                    background: roleGradients[user.role],
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
                  {page.label}
                </Button>
              </Grow>
            ))}
          </Stack>
        </Paper>

        {/* Relevant Jobs */}
        <Box>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Relevant Jobs
          </Typography>
          <Stack spacing={3}>
            {relevantJobs.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No jobs for this stage.
                </Typography>
              </Paper>
            )}
            {relevantJobs.map((job, index) => (
              <Grow in timeout={1600 + index * 200} key={job.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderLeft: `6px solid ${roleColors[user.role]}`, 
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
                      bgcolor: roleColors[user.role], 
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
                        label={job.status.replace('_', ' ').toUpperCase()} 
                        size="small" 
                        sx={{ 
                          bgcolor: roleColors[user.role],
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
    </Box>
  );
} 