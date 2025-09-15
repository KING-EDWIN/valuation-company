'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Assessment as ReportIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useUser } from '../../../components/UserContext';

interface Report {
  id: number;
  job_id: number;
  report_type: string;
  report_title: string;
  report_reference_number: string;
  status: string;
  client_name: string;
  job_status: string;
  created_by_name: string;
  assigned_to_name: string;
  admin_data: any;
  field_data: any;
  qa_data: any;
  created_at: string;
  progress: any[];
}

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export default function QAReportReview() {
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [qaComments, setQAComments] = useState('');
  const [qaStatus, setQAStatus] = useState('pending');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSnackbar({ open: true, message: 'Failed to fetch reports', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (report: Report) => {
    setSelectedReport(report);
    setQAComments(report.qa_data?.comments || '');
    setQAStatus(report.qa_data?.status || 'pending');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReport) return;

    try {
      const qaData = {
        status: qaStatus,
        comments: qaComments,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      };

      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qa_data: qaData })
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Review submitted successfully', severity: 'success' });
        setReviewDialogOpen(false);
        fetchReports();
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to submit review', severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Failed to submit review', severity: 'error' });
    }
  };

  const handleGeneratePDF = async (reportId: number) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/generate-pdf`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        // Open PDF in new tab
        window.open(data.data.download_url, '_blank');
        setSnackbar({ open: true, message: 'PDF generated successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to generate PDF', severity: 'error' });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({ open: true, message: 'Failed to generate PDF', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getProgressStatus = (report: Report) => {
    const adminProgress = report.progress?.find(p => p.role === 'admin');
    const fieldProgress = report.progress?.find(p => p.role === 'field');
    const qaProgress = report.progress?.find(p => p.role === 'qa');

    const completed = [adminProgress, fieldProgress, qaProgress].filter(p => p?.completed).length;
    const total = 3;

    return `${completed}/${total} completed`;
  };

  const renderReportDetails = (report: Report) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Report Details</Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Admin Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {report.admin_data ? (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(report.admin_data, null, 2)}
            </pre>
          ) : (
            <Typography color="text.secondary">No admin data available</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Field Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {report.field_data ? (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(report.field_data, null, 2)}
            </pre>
          ) : (
            <Typography color="text.secondary">No field data available</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>QA Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {report.qa_data ? (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(report.qa_data, null, 2)}
            </pre>
          ) : (
            <Typography color="text.secondary">No QA data available</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportIcon color="primary" />
          QA Report Review
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchReports}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Pending Review" />
            <Tab label="Approved Reports" />
            <Tab label="Rejected Reports" />
            <Tab label="All Reports" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.filter(r => r.status === 'draft' || r.status === 'in_progress').map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.report_reference_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {report.report_title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.report_type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.client_name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getProgressStatus(report)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleReview(report)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleGeneratePDF(report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Reviewed</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.filter(r => r.qa_data?.status === 'approved').map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.report_reference_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.report_type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.client_name}</TableCell>
                    <TableCell>
                      {report.qa_data?.reviewed_at ? new Date(report.qa_data.reviewed_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleReview(report)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleGeneratePDF(report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Rejection Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.filter(r => r.qa_data?.status === 'rejected').map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.report_reference_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.report_type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.client_name}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        {report.qa_data?.comments || 'No reason provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleReview(report)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.report_reference_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.report_type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.client_name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getProgressStatus(report)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleReview(report)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleGeneratePDF(report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Review Report: {selectedReport?.report_reference_number}</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Report Type:</Typography>
                  <Typography>{selectedReport.report_type}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Client:</Typography>
                  <Typography>{selectedReport.client_name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Created By:</Typography>
                  <Typography>{selectedReport.created_by_name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Created Date:</Typography>
                  <Typography>{new Date(selectedReport.created_at).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Review Status</InputLabel>
                <Select
                  value={qaStatus}
                  onChange={(e) => setQAStatus(e.target.value)}
                  label="Review Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="QA Comments"
                multiline
                rows={4}
                value={qaComments}
                onChange={(e) => setQAComments(e.target.value)}
                placeholder="Enter your review comments..."
              />

              {renderReportDetails(selectedReport)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            color={qaStatus === 'approved' ? 'success' : qaStatus === 'rejected' ? 'error' : 'primary'}
          >
            Submit Review
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


