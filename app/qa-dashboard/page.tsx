"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function QADashboard() {
  const { jobs, updateJob } = useJobs();
  const { notifications, clearNotifications, addNotification } = useNotifications();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [revokeReason, setRevokeReason] = useState<Record<string, string>>({});

  useEffect(() => { clearNotifications("qa_officer"); }, [clearNotifications]);

  const pendingJobs = jobs.filter(j => j.status === "pending QA");

  const handleApprove = (id: string) => {
    updateJob(id, {
      status: "pending MD approval",
      qaNotes: notes[id],
      chain: { qa: "QA Officer" },
      revocationReason: undefined
    });
    addNotification("md", "New job ready for MD approval!", id);
    setSubmitted(s => ({ ...s, [id]: true }));
    setNotes(n => ({ ...n, [id]: "" }));
  };

  const handleReject = (id: string) => {
    updateJob(id, {
      status: "pending fieldwork",
      qaNotes: notes[id],
      revocationReason: revokeReason[id] || "No reason provided."
    });
    addNotification("field_team", "Job sent back for more fieldwork.", id);
    setSubmitted(s => ({ ...s, [id]: true }));
    setNotes(n => ({ ...n, [id]: "" }));
    setRevokeReason(r => ({ ...r, [id]: "" }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
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
              <VerifiedIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                QA Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Review and validate field reports for accuracy
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
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Pending Reviews</Typography>
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
                <Typography variant="h6" color="text.secondary" gutterBottom>Approved Reports</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">{jobs.filter(j => j.chain.qa).length}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Notifications */}
        {notifications.qa_officer.length > 0 && (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {notifications.qa_officer.map(n => <div key={n.id}>{n.message}</div>)}
            </Alert>
          </Fade>
        )}

        {/* Jobs List */}
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
          Pending QA Reviews
        </Typography>
        
        {pendingJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs pending QA review.
            </Typography>
          </Paper>
        )}
        
        <Stack spacing={3}>
          {pendingJobs.map((job, index) => (
            <Grow in timeout={1400 + index * 200} key={job.id}>
              <Paper sx={{ 
                p: 4, 
                borderLeft: '6px solid #7c3aed', 
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
                    bgcolor: '#7c3aed', 
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
                      label="PENDING QA REVIEW" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#7c3aed',
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
                {/* QA Notes input and action buttons remain as before */}
                <TextField
                  label="QA Notes"
                  value={notes[job.id] || ""}
                  onChange={e => setNotes(n => ({ ...n, [job.id]: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ mb: 3 }}
                  placeholder="Enter QA validation notes, accuracy checks, and any recommendations..."
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    disabled={submitted[job.id]}
                    onClick={() => handleApprove(job.id)}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
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
                    Approve & Forward to MD
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={submitted[job.id]}
                    onClick={() => handleReject(job.id)}
                    sx={{
                      borderColor: '#7c3aed',
                      color: '#7c3aed',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#6d28d9',
                        backgroundColor: 'rgba(124, 58, 237, 0.04)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Revoke & Return to Field Team
                  </Button>
                  <TextField
                    label="Revocation Reason"
                    value={revokeReason[job.id] || ""}
                    onChange={e => setRevokeReason(r => ({ ...r, [job.id]: e.target.value }))}
                    size="small"
                    sx={{ minWidth: 200 }}
                    disabled={submitted[job.id]}
                  />
                </Stack>
                {submitted[job.id] && (
                  <Fade in timeout={500}>
                    <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                      Action completed successfully!
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