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
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as FileDownloadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useJobs, Job } from '../../../components/JobsContext';
import { useUser } from '../../../components/UserContext';
import { useRouter } from 'next/navigation';

interface Report {
  id: number;
  job_id: number;
  report_type: string;
  report_title: string;
  report_reference_number: string;
  status: string;
  admin_data: any;
  field_data: any;
  qa_data: any;
  final_data: any;
  generated_pdf_path: string;
  created_by: number;
  assigned_to: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  job_status?: string;
  created_by_name?: string;
  assigned_to_name?: string;
}

interface ReportTemplate {
  id: number;
  report_type: string;
  template_name: string;
  admin_mandatory: any;
  admin_optional: any;
  field_mandatory: any;
  field_optional: any;
  static_data: any;
  is_active: boolean;
}

interface FieldWorker {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ReportManagement() {
  const { jobs, updateJob } = useJobs();
  const { user } = useUser();
  const router = useRouter();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [fieldWorkers, setFieldWorkers] = useState<FieldWorker[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Dialog states
  const [editReportDialog, setEditReportDialog] = useState(false);
  const [viewReportDialog, setViewReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
    fetchTemplates();
    fetchFieldWorkers();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchReports();
    }, 30000);
    
    return () => clearInterval(interval);
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

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/report-templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchFieldWorkers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setFieldWorkers((data.users || data.data || []).filter((user: FieldWorker) => user.role === 'field_team'));
      }
    } catch (error) {
      console.error('Error fetching field workers:', error);
    }
  };

  const handleCreateReport = (job: Job) => {
    // Redirect to template data entry page with job context
    router.push(`/admin/template-data-entry?jobId=${job.id}&clientName=${encodeURIComponent(job.client_name)}`);
  };


  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditReportDialog(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewReportDialog(true);
  };

  const handleDownloadReport = async (reportId: number) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/generate-pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSnackbar({ open: true, message: 'Report downloaded successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to generate PDF', severity: 'error' });
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setSnackbar({ open: true, message: 'Failed to download report', severity: 'error' });
    }
  };


  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedReport)
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Report updated successfully!', severity: 'success' });
        setEditReportDialog(false);
        fetchReports();
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to update report', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating report:', error);
      setSnackbar({ open: true, message: 'Failed to update report', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'in_progress': return 'warning';
      case 'pending_qa': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'pending fieldwork': return 'warning';
      case 'pending QA': return 'info';
      case 'pending MD approval': return 'secondary';
      case 'complete': return 'success';
      default: return 'default';
    }
  };

  // Jobs without reports
  const jobsWithoutReports = jobs.filter(job => 
    !reports.some(report => report.job_id === job.id)
  );

  // All Reports Tab Component
  const AllReportsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">All Reports</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchReports}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Details</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.report_title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ref: {report.report_reference_number}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {report.client_name?.charAt(0) || 'C'}
                      </Avatar>
                      <Typography variant="body2">
                        {report.client_name || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={report.report_type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status} 
                      color={getStatusColor(report.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.assigned_to_name || 'Unassigned'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleViewReport(report)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditReport(report)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDownloadReport(report.id)}>
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  // Create Reports Tab Component
  const CreateReportsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create New Reports from Client Onboarding
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a client to create a detailed report based on their onboarding data
      </Typography>

      <Grid container spacing={3}>
        {jobsWithoutReports.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {job.client_name?.charAt(0) || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {job.client_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job.client_info?.clientType || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.asset_details?.location || 'N/A'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.asset_type || 'N/A'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip 
                    label={job.status} 
                    color={getJobStatusColor(job.status)} 
                    size="small" 
                  />
                  <Typography variant="caption">
                    {new Date(job.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleCreateReport(job)}
                >
                  Create Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Templates Tab Component
  const TemplatesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Report Templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View and manage available report templates
      </Typography>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <ReportIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {template.template_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {template.report_type}
                    </Typography>
                  </Box>
                </Box>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">Admin Fields</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" color="text.secondary">
                      Mandatory: {Object.keys(template.admin_mandatory || {}).length} fields
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Optional: {Object.keys(template.admin_optional || {}).length} fields
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">Field Worker Fields</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" color="text.secondary">
                      Mandatory: {Object.keys(template.field_mandatory || {}).length} fields
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Optional: {Object.keys(template.field_optional || {}).length} fields
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Box sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <ReportIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Report Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, manage, and track reports from client onboarding data
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Main Content with Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab label="All Reports" icon={<DescriptionIcon />} />
              <Tab label="Create Reports" icon={<AddIcon />} />
              <Tab label="Templates" icon={<AssignmentIcon />} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && <AllReportsTab />}
            {selectedTab === 1 && <CreateReportsTab />}
            {selectedTab === 2 && <TemplatesTab />}
          </Box>
        </Card>
      </Box>


      {/* View Report Dialog */}
      <Dialog open={viewReportDialog} onClose={() => setViewReportDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Report Details - {selectedReport?.report_title}</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Report Information</Typography>
                      <Typography variant="body2"><strong>Title:</strong> {selectedReport.report_title}</Typography>
                      <Typography variant="body2"><strong>Type:</strong> {selectedReport.report_type}</Typography>
                      <Typography variant="body2"><strong>Reference:</strong> {selectedReport.report_reference_number}</Typography>
                      <Typography variant="body2"><strong>Status:</strong> {selectedReport.status}</Typography>
                      <Typography variant="body2"><strong>Created:</strong> {new Date(selectedReport.created_at).toLocaleDateString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Assignment</Typography>
                      <Typography variant="body2"><strong>Client:</strong> {selectedReport.client_name}</Typography>
                      <Typography variant="body2"><strong>Assigned To:</strong> {selectedReport.assigned_to_name || 'Unassigned'}</Typography>
                      <Typography variant="body2"><strong>Created By:</strong> {selectedReport.created_by_name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Admin Data</Typography>
                      <Typography variant="body2">
                        {selectedReport.admin_data?.notes || 'No admin data available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewReportDialog(false)}>Close</Button>
          <Button onClick={() => handleEditReport(selectedReport!)} variant="contained">Edit Report</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={editReportDialog} onClose={() => setEditReportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Report - {selectedReport?.report_title}</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Report Title"
                    value={selectedReport.report_title}
                    onChange={(e) => setSelectedReport({...selectedReport, report_title: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedReport.status}
                      onChange={(e) => setSelectedReport({...selectedReport, status: e.target.value})}
                      label="Status"
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="pending_qa">Pending QA</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Admin Notes"
                    value={selectedReport.admin_data?.notes || ''}
                    onChange={(e) => setSelectedReport({
                      ...selectedReport, 
                      admin_data: {...selectedReport.admin_data, notes: e.target.value}
                    })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReportDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateReport} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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