'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grow,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  FilePresent as FileIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useJobs, Job } from '../../../components/JobsContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ReportReview() {
  const router = useRouter();
  const { jobs, updateJob } = useJobs();
  const [tabValue, setTabValue] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'revoke'>('approve');

  // Filter jobs by status
  const pendingReviewJobs = jobs.filter(job => job.status === 'pending fieldwork');
  const qaJobs = jobs.filter(job => job.status === 'pending QA');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReviewJob = (job: Job) => {
    setSelectedJob(job);
    setReviewNotes('');
    setReviewDecision('approve');
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (selectedJob && reviewNotes) {
      // Update job status based on decision
      const newStatus = reviewDecision === 'approve' ? 'pending QA' : 'pending fieldwork';
      const updates: Partial<Job> = {
        status: newStatus,
        adminReviewed: true,
        adminReviewDate: new Date().toISOString(),
        adminReviewNotes: reviewNotes
      };

      if (reviewDecision === 'revoke') {
        updates.revocationReason = reviewNotes;
      }

      updateJob(selectedJob.id, updates);
      
      setReviewDialogOpen(false);
      setSelectedJob(null);
      setReviewNotes('');
    }
  };

  const renderJobCard = (job: Job, showActions: boolean = true) => (
    <Card key={job.id} sx={{ mb: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {job.clientName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {job.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.assetType} - {job.assetDetails?.location || 'N/A'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={job.status.replace(/_/g, ' ')} 
              color={
                job.status === 'pending fieldwork' ? 'warning' : 
                job.status === 'pending QA' ? 'info' : 
                job.status === 'complete' ? 'success' : 'default'
              }
              size="small"
            />
            {showActions && (
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => handleReviewJob(job)}
                variant="outlined"
              >
                Review
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon color="primary" fontSize="small" />
            <Typography variant="body2">
              <strong>Asset:</strong> {job.assetType}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon color="primary" fontSize="small" />
            <Typography variant="body2">
              <strong>Location:</strong> {job.assetDetails?.location || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" fontSize="small" />
            <Typography variant="body2">
              <strong>Created:</strong> {new Date(job.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {job.fieldReportData && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Field Report Summary
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2">
                {job.fieldReportData.notes || 'Field inspection completed'}
              </Typography>
            </Paper>
          </Box>
        )}

        {job.fieldReportData?.documents && Object.keys(job.fieldReportData.documents).length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Documents Uploaded
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(job.fieldReportData.documents).map(([docType]) => (
                <Chip
                  key={docType}
                  label={docType}
                  icon={<FileIcon />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {job.adminReviewNotes && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Previous Review Notes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.adminReviewNotes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

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
              Report Review
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Review and approve field reports and documentation
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grow in timeout={800}>
          <Box>
            {/* Tabs */}
            <Paper sx={{ mb: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="report review tabs">
                <Tab label={`Pending Review (${pendingReviewJobs.length})`} />
                <Tab label={`QA Review (${qaJobs.length})`} />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon color="primary" />
                Pending Review
              </Typography>
              
              {pendingReviewJobs.length === 0 ? (
                <Alert severity="info">No jobs pending review at this time.</Alert>
              ) : (
                <Box>
                  {pendingReviewJobs.map(job => renderJobCard(job, true))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="primary" />
                QA Review
              </Typography>
              
              {qaJobs.length === 0 ? (
                <Alert severity="info">No jobs pending QA review at this time.</Alert>
              ) : (
                <Box>
                  {qaJobs.map(job => renderJobCard(job, true))}
                </Box>
              )}
            </TabPanel>
          </Box>
        </Grow>
      </Box>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedJob.clientName} - {selectedJob.assetType}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Location: {selectedJob.assetDetails?.location || 'N/A'}
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Review Notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter your review notes..."
                sx={{ mb: 3 }}
                required
              />
              
              <Alert severity="info">
                Review the field report and documentation before making a decision.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setReviewDecision('revoke')}
            sx={{ mr: 1 }}
          >
            Revoke
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleReviewSubmit}
            disabled={!reviewNotes.trim()}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
