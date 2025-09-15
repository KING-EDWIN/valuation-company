'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  GpsFixed as GpsIcon,
  Notes as NotesIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useJobs, Job } from '../../../components/JobsContext';
import { useRouter } from 'next/navigation';

type ChipColor = 'warning' | 'info' | 'secondary' | 'success' | 'default';

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

export default function ClientDatabase() {
  const { jobs, updateJob, deleteJob } = useJobs();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    clientType: '',
    assetType: '',
    minValue: '',
    maxValue: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });
  const [templateViewDialog, setTemplateViewDialog] = useState(false);
  const [templateEditDialog, setTemplateEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [templateData, setTemplateData] = useState<any>({});

  useEffect(() => {
    fetchReports();
    fetchTemplates();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchReports();
      fetchTemplates();
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
      setSnackbar({ open: true, message: 'Failed to fetch templates', severity: 'error' });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.asset_details?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    // Advanced filters
    const matchesClientType = !advancedFilters.clientType || job.client_info?.clientType === advancedFilters.clientType;
    const matchesAssetType = !advancedFilters.assetType || job.asset_type === advancedFilters.assetType;
    const matchesMinValue = !advancedFilters.minValue || (job.valuation_requirements?.value || 0) >= parseFloat(advancedFilters.minValue);
    const matchesMaxValue = !advancedFilters.maxValue || (job.valuation_requirements?.value || 0) <= parseFloat(advancedFilters.maxValue);
    const matchesDateFrom = !advancedFilters.dateFrom || new Date(job.created_at) >= new Date(advancedFilters.dateFrom);
    const matchesDateTo = !advancedFilters.dateTo || new Date(job.created_at) <= new Date(advancedFilters.dateTo);
    const matchesAdvancedStatus = !advancedFilters.status || job.status === advancedFilters.status;
    
    return matchesSearch && matchesStatus && matchesClientType && matchesAssetType && 
           matchesMinValue && matchesMaxValue && matchesDateFrom && matchesDateTo && matchesAdvancedStatus;
  });

  const getReportsForJob = (jobId: number) => {
    return reports.filter(report => report.job_id === jobId);
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
        setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setSnackbar({ open: true, message: 'Failed to download report', severity: 'error' });
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleExportData = () => {
    setExportDialogOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredJobs.map(job => ({
      'Client Name': job.client_name,
      'Client Type': job.client_info?.clientType || '',
      'Email': job.client_info?.email || '',
      'Asset Type': job.asset_type || '',
      'Location': job.asset_details?.location || '',
      'Value': job.valuation_requirements?.value || 0,
      'Currency': job.valuation_requirements?.currency || '',
      'Purpose': job.valuation_requirements?.purpose || '',
      'Status': job.status,
      'Created Date': new Date(job.created_at).toLocaleDateString(),
      'Bank': job.bank_info?.bankName || '',
      'Contact Person': job.bank_info?.contactPerson || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setExportDialogOpen(false);
    setSnackbar({ open: true, message: 'Data exported successfully!', severity: 'success' });
  };

  const handleExportPDF = () => {
    // Create a simple PDF export
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Client Database Export</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Valuation Company - Client Database</h1>
              <p>Export Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Type</th>
                  <th>Asset Type</th>
                  <th>Location</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                ${filteredJobs.map(job => `
                  <tr>
                    <td>${job.client_name}</td>
                    <td>${job.client_info?.clientType || ''}</td>
                    <td>${job.asset_type || ''}</td>
                    <td>${job.asset_details?.location || ''}</td>
                    <td>${formatCurrency(job.valuation_requirements?.value, job.valuation_requirements?.currency)}</td>
                    <td>${job.status}</td>
                    <td>${new Date(job.created_at).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
    setExportDialogOpen(false);
    setSnackbar({ open: true, message: 'PDF generated successfully!', severity: 'success' });
  };

  const handleAdvancedFilters = () => {
    setAdvancedFiltersOpen(true);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({
      clientType: '',
      assetType: '',
      minValue: '',
      maxValue: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    });
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleRefreshData = () => {
    fetchReports();
    fetchTemplates();
    setSnackbar({ open: true, message: 'Data refreshed successfully!', severity: 'success' });
  };

  const handleViewTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setTemplateViewDialog(true);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setTemplateData(template.admin_mandatory || {});
    setTemplateEditDialog(true);
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/report-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedTemplate,
          admin_mandatory: templateData
        })
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Template updated successfully!', severity: 'success' });
        setTemplateEditDialog(false);
        fetchTemplates();
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to update template', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating template:', error);
      setSnackbar({ open: true, message: 'Failed to update template', severity: 'error' });
    }
  };

  const renderTemplateFields = (fields: any, prefix = '') => {
    if (!fields || typeof fields !== 'object') return null;

    return Object.entries(fields).map(([key, value]) => {
      const fieldKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <Box key={fieldKey} sx={{ mb: 2, pl: 2, borderLeft: 2, borderColor: 'primary.main' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            {renderTemplateFields(value, fieldKey)}
          </Box>
        );
      } else if (Array.isArray(value)) {
        return (
          <Box key={fieldKey} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {key.replace(/_/g, ' ').toUpperCase()}: Array ({value.length} items)
            </Typography>
          </Box>
        );
      } else {
        return (
          <Box key={fieldKey} sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value || 'Empty'}
            </Typography>
          </Box>
        );
      }
    });
  };

  const renderEditableTemplateFields = (fields: any, prefix = '') => {
    if (!fields || typeof fields !== 'object') return null;

    return Object.entries(fields).map(([key, value]) => {
      const fieldKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <Box key={fieldKey} sx={{ mb: 2, pl: 2, borderLeft: 2, borderColor: 'primary.main' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            {renderEditableTemplateFields(value, fieldKey)}
          </Box>
        );
      } else if (Array.isArray(value)) {
        return (
          <Box key={fieldKey} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {key.replace(/_/g, ' ').toUpperCase()}: Array ({value.length} items)
            </Typography>
            {value.map((item, index) => (
              <Box key={index} sx={{ ml: 2, mb: 1 }}>
                <Typography variant="caption">
                  Item {index + 1}: {typeof item === 'object' ? JSON.stringify(item) : item}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      } else {
        return (
          <TextField
            key={fieldKey}
            fullWidth
            label={key.replace(/_/g, ' ').toUpperCase()}
            value={value || ''}
            onChange={(e) => {
              const newData = { ...templateData };
              const keys = fieldKey.split('.');
              let current = newData;
              for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
              }
              current[keys[keys.length - 1]] = e.target.value;
              setTemplateData(newData);
            }}
            sx={{ mb: 1 }}
            size="small"
          />
        );
      }
    });
  };

  const handleEdit = (job: Job) => {
    setSelectedJob({ ...job });
    setEditDialogOpen(true);
  };

  const handleView = (job: Job) => {
    setSelectedJob({ ...job });
    setViewDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedJob) {
      updateJob(selectedJob.id, selectedJob);
      setEditDialogOpen(false);
      setSelectedJob(null);
    }
  };

  const handleCancel = () => {
    setEditDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteJob(jobId);
    }
  };

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'pending fieldwork': return 'warning';
      case 'pending QA': return 'info';
      case 'pending MD approval': return 'secondary';
      case 'complete': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Client Overview Tab Component
  const ClientOverviewTab = () => (
            <Box>
        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending fieldwork">Pending Fieldwork</MenuItem>
                  <MenuItem value="pending QA">Pending QA</MenuItem>
                  <MenuItem value="pending MD approval">Pending MD Approval</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                fullWidth
              onClick={handleAdvancedFilters}
              startIcon={<FilterIcon />}
              >
                Advanced Filters
              </Button>
              <Button
                variant="contained"
                fullWidth
              startIcon={<FileDownloadIcon />}
              onClick={handleExportData}
              >
              Export Data
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            {filteredJobs.length} Clients Found
          </Typography>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshData}
            variant="outlined"
          >
            Refresh
          </Button>
          <Button
            size="small"
            onClick={handleClearFilters}
            variant="outlined"
            color="secondary"
          >
            Clear Filters
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip label={`${jobs.filter(j => j.status === 'complete').length} Complete`} color="success" />
          <Chip label={`${jobs.filter(j => j.status === 'pending fieldwork').length} Pending Fieldwork`} color="warning" />
          <Chip label={`${jobs.filter(j => j.status === 'pending QA').length} Pending QA`} color="info" />
        </Box>
        </Box>

      {/* Client Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Details</TableCell>
                <TableCell>Project Information</TableCell>
                <TableCell>Financial Details</TableCell>
                <TableCell>Status & Progress</TableCell>
                <TableCell>Reports</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job) => {
                const jobReports = getReportsForJob(job.id);
                return (
                <TableRow key={job.id} hover>
                  <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {job.client_name?.charAt(0) || 'C'}
                        </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {job.client_name}
                      </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.client_info?.clientType || 'N/A'}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {job.client_info?.email || 'N/A'}
                      </Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {job.asset_type || 'N/A'}
                    </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {job.asset_details?.location || 'N/A'}
                      </Typography>
                        <Typography variant="caption" display="block">
                          Size: {job.asset_details?.size || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(job.valuation_requirements?.value, job.valuation_requirements?.currency)}
                    </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Purpose: {job.valuation_requirements?.purpose || 'N/A'}
                    </Typography>
                        <Typography variant="caption" display="block">
                          Deadline: {job.valuation_requirements?.deadline ? new Date(job.valuation_requirements.deadline).toLocaleDateString() : 'N/A'}
                    </Typography>
                      </Box>
                  </TableCell>
                  <TableCell>
                      <Box>
                    <Chip 
                      label={job.status} 
                      color={getStatusColor(job.status)}
                      size="small" 
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={job.status === 'complete' ? 100 : job.status === 'pending MD approval' ? 75 : job.status === 'pending QA' ? 50 : 25}
                            sx={{ width: 100, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption">
                            {job.status === 'complete' ? '100%' : job.status === 'pending MD approval' ? '75%' : job.status === 'pending QA' ? '50%' : '25%'}
                          </Typography>
                        </Box>
                      </Box>
                  </TableCell>
                  <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge badgeContent={jobReports.length} color="primary">
                          <DescriptionIcon color="action" />
                        </Badge>
                        <Typography variant="caption">
                          {jobReports.length} report{jobReports.length !== 1 ? 's' : ''}
                    </Typography>
                      </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Full Details">
                          <IconButton size="small" onClick={() => handleView(job)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Client">
                          <IconButton size="small" onClick={() => handleEdit(job)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                        <Tooltip title="Download Reports">
                          <IconButton size="small" onClick={() => handleDownloadReport(jobReports[0]?.id)} disabled={jobReports.length === 0}>
                            <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Client">
                          <IconButton size="small" onClick={() => handleDelete(job.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  // Reports Tab Component
  const ReportsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        All Reports & Documents
            </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View and download all reports across all clients
            </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          </Box>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => {
            const job = jobs.find(j => j.id === report.job_id);
            return (
              <Grid item xs={12} md={6} lg={4} key={report.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <DescriptionIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {report.report_title}
                  </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.report_type}
            </Typography>
          </Box>
                </Box>
                
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Client: {job?.client_name || 'Unknown'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip 
                        label={report.status} 
                        color={getStatusColor(report.status)} 
                        size="small" 
                      />
                      <Typography variant="caption">
                        {new Date(report.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<PdfIcon />}
                        onClick={() => handleDownloadReport(report.id)}
                        variant="contained"
                  fullWidth
                      >
                        Download PDF
                      </Button>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        variant="outlined"
                        fullWidth
                        onClick={() => handleViewReport(report)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );

  // Templates Tab Component
  const TemplatesTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Report Templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View and manage all available report templates
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <AssessmentIcon />
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
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
        fullWidth
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewTemplate(template)}
                    >
                      View Template
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={() => router.push('/admin/template-data-entry')}
                    >
                      Fill Data
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
                </Box>
  );

  // Analytics Tab Component
  const AnalyticsTab = () => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'complete').length;
    const pendingJobs = jobs.filter(j => j.status !== 'complete').length;
    const totalValue = jobs.reduce((sum, job) => sum + (job.valuation_requirements?.value || 0), 0);
    const avgValue = totalValue / totalJobs || 0;

    return (
                <Box>
        <Typography variant="h6" gutterBottom>
          Client Analytics & Insights
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <BusinessIcon />
                  </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {totalJobs}
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Clients
            </Typography>
          </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckIcon />
                  </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {completedJobs}
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                  </Typography>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <ScheduleIcon />
                  </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {pendingJobs}
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <MoneyIcon />
                  </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {formatCurrency(avgValue, 'UGX').split(' ')[0]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Value
                  </Typography>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status Distribution
                      </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['complete', 'pending fieldwork', 'pending QA', 'pending MD approval'].map((status) => {
                    const count = jobs.filter(j => j.status === status).length;
                    const percentage = (count / totalJobs) * 100;
                    return (
                      <Box key={status}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {status.replace('_', ' ')}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {count} ({percentage.toFixed(1)}%)
                  </Typography>
                    </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          color={getStatusColor(status)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {jobs.slice(0, 5).map((job) => (
                    <ListItem key={job.id} divider>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {job.client_name?.charAt(0) || 'C'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={job.client_name}
                        secondary={
                    <Box>
                            <Typography variant="caption" display="block">
                              {job.asset_type} • {job.asset_details?.location}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(job.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                        }
                      />
                      <Chip 
                        label={job.status} 
                        color={getStatusColor(job.status)} 
                        size="small" 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
                </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.push('/dashboard')} size="large">
              <ArrowBackIcon />
            </IconButton>
                    <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Client Database
                  </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive client management with full report access and template viewing
              </Typography>
                    </Box>
            <Box sx={{ ml: 'auto' }}>
          <Button 
                startIcon={<AddIcon />}
                onClick={() => router.push('/admin/client-onboarding')}
            variant="contained" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                New Client Onboarding
          </Button>
            </Box>
          </Box>
        </Container>
                </Box>
                
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Main Content with Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab label="Client Overview" icon={<BusinessIcon />} />
              <Tab label="Reports & Documents" icon={<DescriptionIcon />} />
              <Tab label="Report Templates" icon={<AssessmentIcon />} />
              <Tab label="Analytics" icon={<BarChartIcon />} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && <ClientOverviewTab />}
            {selectedTab === 1 && <ReportsTab />}
            {selectedTab === 2 && <TemplatesTab />}
            {selectedTab === 3 && <AnalyticsTab />}
          </Box>
        </Card>
      </Container>

      {/* Advanced Filters Dialog */}
      <Dialog open={advancedFiltersOpen} onClose={() => setAdvancedFiltersOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Client Type</InputLabel>
                <Select
                  value={advancedFilters.clientType}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, clientType: e.target.value})}
                  label="Client Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Financial Institution">Financial Institution</MenuItem>
                  <MenuItem value="Real Estate Company">Real Estate Company</MenuItem>
                  <MenuItem value="Investment Company">Investment Company</MenuItem>
                  <MenuItem value="Cooperative Society">Cooperative Society</MenuItem>
                  <MenuItem value="Microfinance Institution">Microfinance Institution</MenuItem>
                  <MenuItem value="Private Company">Private Company</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                  <InputLabel>Asset Type</InputLabel>
                  <Select
                  value={advancedFilters.assetType}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, assetType: e.target.value})}
                    label="Asset Type"
                  >
                  <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Commercial Property">Commercial Property</MenuItem>
                    <MenuItem value="Residential Property">Residential Property</MenuItem>
                    <MenuItem value="Vacant Land">Vacant Land</MenuItem>
                    <MenuItem value="Institutional Property">Institutional Property</MenuItem>
                  </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                label="Min Value (UGX)"
                type="number"
                value={advancedFilters.minValue}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minValue: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                label="Max Value (UGX)"
                type="number"
                value={advancedFilters.maxValue}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxValue: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                label="From Date"
                type="date"
                value={advancedFilters.dateFrom}
                onChange={(e) => setAdvancedFilters({...advancedFilters, dateFrom: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                label="To Date"
                  type="date"
                value={advancedFilters.dateTo}
                onChange={(e) => setAdvancedFilters({...advancedFilters, dateTo: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdvancedFiltersOpen(false)}>Cancel</Button>
          <Button onClick={handleClearFilters} color="secondary">Clear All</Button>
          <Button onClick={() => setAdvancedFiltersOpen(false)} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Client Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Choose the format for exporting {filteredJobs.length} client records:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              fullWidth
              sx={{ py: 2 }}
            >
              Export as CSV
          </Button>
          <Button 
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={handleExportPDF}
              fullWidth
              sx={{ py: 2 }}
            >
              Export as PDF
          </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* View Client Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Client Details - {selectedJob?.client_name}</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Client Information</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                          {selectedJob.client_name?.charAt(0) || 'C'}
                        </Avatar>
                <Box>
                          <Typography variant="h6">{selectedJob.client_name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedJob.client_info?.clientType || 'N/A'}
                  </Typography>
                </Box>
                </Box>
                      <Typography variant="body2"><strong>Email:</strong> {selectedJob.client_info?.email || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedJob.client_info?.address || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Contact:</strong> {selectedJob.client_info?.contactNumber || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Contact Person:</strong> {selectedJob.client_info?.contactPerson || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Project Information</Typography>
                      <Typography variant="body2"><strong>Asset Type:</strong> {selectedJob.asset_type || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Location:</strong> {selectedJob.asset_details?.location || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Size:</strong> {selectedJob.asset_details?.size || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Property Use:</strong> {selectedJob.asset_details?.propertyUse || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Neighborhood:</strong> {selectedJob.asset_details?.neighborhood?.join(', ') || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Financial Details</Typography>
                      <Typography variant="h5" color="success.main" sx={{ mb: 1 }}>
                        {formatCurrency(selectedJob.valuation_requirements?.value, selectedJob.valuation_requirements?.currency)}
                  </Typography>
                      <Typography variant="body2"><strong>Purpose:</strong> {selectedJob.valuation_requirements?.purpose || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Deadline:</strong> {selectedJob.valuation_requirements?.deadline ? new Date(selectedJob.valuation_requirements.deadline).toLocaleDateString() : 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Bank Information</Typography>
                      <Typography variant="body2"><strong>Bank:</strong> {selectedJob.bank_info?.bankName || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Branch:</strong> {selectedJob.bank_info?.branch || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Contact Person:</strong> {selectedJob.bank_info?.contactPerson || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Contact Number:</strong> {selectedJob.bank_info?.contactNumber || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Project Status & Progress</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip label={selectedJob.status} color={getStatusColor(selectedJob.status)} />
                        <Typography variant="body2">
                          Created: {new Date(selectedJob.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedJob.status === 'complete' ? 100 : selectedJob.status === 'pending MD approval' ? 75 : selectedJob.status === 'pending QA' ? 50 : 25}
                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        QA Checklist: {selectedJob.qa_checklist?.items?.join(', ') || 'N/A'}
                  </Typography>
                      {selectedJob.qa_checklist?.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Notes: {selectedJob.qa_checklist.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
                </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button onClick={() => handleEdit(selectedJob!)} variant="contained">Edit Client</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Client - {selectedJob?.client_name}</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    value={selectedJob.client_name || ''}
                    onChange={(e) => setSelectedJob({...selectedJob, client_name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedJob.client_info?.email || ''}
                    onChange={(e) => setSelectedJob({
                      ...selectedJob, 
                      client_info: {...selectedJob.client_info, email: e.target.value}
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedJob.status}
                      onChange={(e) => setSelectedJob({...selectedJob, status: e.target.value})}
                      label="Status"
                    >
                      <MenuItem value="pending fieldwork">Pending Fieldwork</MenuItem>
                      <MenuItem value="pending QA">Pending QA</MenuItem>
                      <MenuItem value="pending MD approval">Pending MD Approval</MenuItem>
                      <MenuItem value="complete">Complete</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Asset Type"
                    value={selectedJob.asset_type || ''}
                    onChange={(e) => setSelectedJob({...selectedJob, asset_type: e.target.value})}
                  />
                </Grid>
              </Grid>
                </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Template View Dialog */}
      <Dialog open={templateViewDialog} onClose={() => setTemplateViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Template Details - {selectedTemplate?.template_name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Admin Mandatory Fields</Typography>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {renderTemplateFields(selectedTemplate.admin_mandatory)}
                </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Field Worker Mandatory Fields</Typography>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {renderTemplateFields(selectedTemplate.field_mandatory)}
                </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Admin Optional Fields</Typography>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {renderTemplateFields(selectedTemplate.admin_optional)}
                </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Field Worker Optional Fields</Typography>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {renderTemplateFields(selectedTemplate.field_optional)}
                </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Static Data</Typography>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {renderTemplateFields(selectedTemplate.static_data)}
                </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
                </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateViewDialog(false)}>Close</Button>
          <Button onClick={() => handleEditTemplate(selectedTemplate!)} variant="contained">Edit Template</Button>
        </DialogActions>
      </Dialog>

      {/* Template Edit Dialog */}
      <Dialog open={templateEditDialog} onClose={() => setTemplateEditDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Template - {selectedTemplate?.template_name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Admin Mandatory Fields</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Edit the admin mandatory fields for this template
                      </Typography>
              <Box sx={{ maxHeight: 500, overflow: 'auto', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                {renderEditableTemplateFields(selectedTemplate.admin_mandatory)}
                    </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained">Save Changes</Button>
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