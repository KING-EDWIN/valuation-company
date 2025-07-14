"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExploreIcon from '@mui/icons-material/Explore';

export default function FieldDashboard() {
  const { jobs, updateJob } = useJobs();
  const { notifications, clearNotifications, addNotification } = useNotifications();
  const [report, setReport] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [openFormJobId, setOpenFormJobId] = useState<string | null>(null);
  const [formViewed, setFormViewed] = useState<Record<string, boolean>>({});

  // Clear notifications for field team on mount
  useEffect(() => { clearNotifications("field_team"); }, [clearNotifications]);

  const pendingJobs = jobs.filter(j => j.status === "pending fieldwork");

  const handleSubmit = (id: string) => {
    updateJob(id, {
      status: "pending QA",
      fieldReport: report[id],
      chain: { surveyor: "Field Team" },
    });
    addNotification("qa_officer", "New job ready for QA review!", id);
    setSubmitted(s => ({ ...s, [id]: true }));
    setReport(r => ({ ...r, [id]: "" }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #00897b 0%, #4db6ac 100%)',
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
              <ExploreIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Field Team Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Conduct field inspections and submit detailed reports
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
              background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#00897b', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Pending Jobs</Typography>
                <Typography variant="h3" fontWeight={700} color="primary">{pendingJobs.length}</Typography>
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
                <Typography variant="h6" color="text.secondary" gutterBottom>Completed Reports</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">{jobs.filter(j => j.chain.surveyor).length}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Notifications */}
        {notifications.field_team.length > 0 && (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {notifications.field_team.map(n => <div key={n.id}>{n.message}</div>)}
            </Alert>
          </Fade>
        )}

        {/* Jobs List */}
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
          Pending Fieldwork
        </Typography>
        
        {pendingJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs pending fieldwork.
            </Typography>
          </Paper>
        )}
        
        <Stack spacing={3}>
          {pendingJobs.map((job, index) => (
            <Grow in timeout={1400 + index * 200} key={job.id}>
              <Paper sx={{ 
                p: 4, 
                borderLeft: '6px solid #00897b', 
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
                    bgcolor: '#00897b', 
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
                      Asset Details: {Object.values(job.assetDetails).filter(Boolean).join(", ")}
                    </Typography>
                    <Chip 
                      label="PENDING FIELDWORK" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#00897b',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </Stack>
                {/* Always show all job details inline */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Client Form</Typography>
                  <Typography variant="body2">Client Name: {job.clientName}</Typography>
                  <Typography variant="body2">Asset Type: {job.assetType.toUpperCase()}</Typography>
                  {Object.entries(job.assetDetails).map(([k, v]) => v && (
                    <Typography key={k} variant="body2">{k.charAt(0).toUpperCase() + k.slice(1)}: {v}</Typography>
                  ))}
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.clientForm?.createdBy || 'Admin'}</Typography>
                </Box>
                {job.fieldReport && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>Field Report</Typography>
                    <Typography variant="body2">{job.fieldReport}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.fieldReportBy || job.chain.surveyor || 'Field Team'}</Typography>
                  </Box>
                )}
                {job.qaNotes && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#ede7f6', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>QA Notes</Typography>
                    <Typography variant="body2">{job.qaNotes}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.chain.qa || 'QA Officer'}</Typography>
                  </Box>
                )}
                {job.mdApproval && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>MD Approval</Typography>
                    <Typography variant="body2">{job.mdApproval}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.chain.md || 'Managing Director'}</Typography>
                  </Box>
                )}
                {/* Field Report input and submit button remain as before */}
                <TextField
                  label="Field Report"
                  value={report[job.id] || ""}
                  onChange={e => setReport(r => ({ ...r, [job.id]: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={4}
                  sx={{ mb: 3 }}
                  placeholder="Enter detailed field inspection findings, measurements, photos taken, and any observations..."
                />
                <Button
                  variant="contained"
                  disabled={submitted[job.id] || !report[job.id]}
                  onClick={() => handleSubmit(job.id)}
                  sx={{
                    background: 'linear-gradient(135deg, #00897b 0%, #4db6ac 100%)',
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
                  Submit Report
                </Button>
                {submitted[job.id] && (
                  <Fade in timeout={500}>
                    <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                      Report submitted successfully! Sent to QA for review.
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