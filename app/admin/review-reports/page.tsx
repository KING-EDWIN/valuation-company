'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

type ChipColor = 'success' | 'error' | 'warning' | 'info' | 'default';

interface ReviewReport {
  id: string;
  jobId: string;
  clientName: string;
  fieldAgent: string;
  submissionDate: string;
  reportType: 'Initial Assessment' | 'Field Report' | 'Final Report' | 'Documentation';
  status: 'pending review' | 'approved' | 'rejected' | 'requires revision';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedValue: number;
  location: string;
  assetType: string;
  reviewNotes?: string;
  reviewer?: string;
  reviewDate?: string;
  documents: string[];
  fieldNotes: string;
  photos: string[];
  measurements: string;
  siteConditions: string;
}

const mockReviewReports: ReviewReport[] = [
  {
    id: 'rr-1',
    jobId: 'job-1',
    clientName: 'ABC Bank Limited',
    fieldAgent: 'John Mukisa',
    submissionDate: '2024-01-25',
    reportType: 'Field Report',
    status: 'pending review',
    priority: 'high',
    estimatedValue: 850000000,
    location: 'Nakasero, Kampala',
    assetType: 'Commercial Property',
    documents: ['field_report_abc.pdf', 'photos_abc.zip', 'measurements_abc.pdf'],
    fieldNotes: 'Property in excellent condition. Newly renovated office building with modern amenities. All measurements verified. Photos taken from multiple angles.',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    measurements: 'Length: 45m, Width: 25m, Height: 15m',
    siteConditions: 'Excellent - Well maintained, good road access, security features present'
  },
  {
    id: 'rr-2',
    jobId: 'job-2',
    clientName: 'XYZ Development Company',
    fieldAgent: 'Sarah Nalukenge',
    submissionDate: '2024-01-24',
    reportType: 'Initial Assessment',
    status: 'approved',
    priority: 'medium',
    estimatedValue: 450000000,
    location: 'Kololo, Kampala',
    assetType: 'Residential Property',
    reviewer: 'QA Officer',
    reviewDate: '2024-01-25',
    documents: ['initial_assessment_xyz.pdf', 'site_photos_xyz.zip'],
    fieldNotes: 'Residential property in prime location. Good construction quality. Minor repairs needed.',
    photos: ['photo1.jpg', 'photo2.jpg'],
    measurements: 'Length: 30m, Width: 20m, Height: 12m',
    siteConditions: 'Good - Well maintained, minor repairs needed'
  },
  {
    id: 'rr-3',
    jobId: 'job-3',
    clientName: 'DEF Microfinance',
    fieldAgent: 'Michael Kato',
    submissionDate: '2024-01-23',
    reportType: 'Final Report',
    status: 'requires revision',
    priority: 'urgent',
    estimatedValue: 120000000,
    location: 'Ntinda, Kampala',
    assetType: 'Vacant Land',
    reviewNotes: 'Missing soil test report and environmental assessment. Photos insufficient for land evaluation.',
    documents: ['final_report_def.pdf', 'land_photos_def.zip'],
    fieldNotes: 'Vacant land suitable for development. Good road access and utilities nearby.',
    photos: ['photo1.jpg', 'photo2.jpg'],
    measurements: 'Length: 100m, Width: 50m',
    siteConditions: 'Good - Flat land, good road access, utilities available'
  },
  {
    id: 'rr-4',
    jobId: 'job-4',
    clientName: 'GHI Savings Cooperative',
    fieldAgent: 'Grace Namukasa',
    submissionDate: '2024-01-22',
    reportType: 'Documentation',
    status: 'pending review',
    priority: 'low',
    estimatedValue: 650000000,
    location: 'Makindye, Kampala',
    assetType: 'Institutional Property',
    documents: ['documentation_ghi.pdf', 'building_plans_ghi.pdf', 'certificates_ghi.zip'],
    fieldNotes: 'School building documentation complete. All certificates and plans verified.',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    measurements: 'Length: 80m, Width: 40m, Height: 18m',
    siteConditions: 'Good - Well maintained school building, good facilities'
  },
  {
    id: 'rr-5',
    jobId: 'job-5',
    clientName: 'JKL Investment Group',
    fieldAgent: 'David Ochieng',
    submissionDate: '2024-01-21',
    reportType: 'Field Report',
    status: 'pending review',
    priority: 'high',
    estimatedValue: 1200000000,
    location: 'Industrial Area, Kampala',
    assetType: 'Commercial Property',
    documents: ['field_report_jkl.pdf', 'industrial_photos_jkl.zip', 'structural_assessment_jkl.pdf'],
    fieldNotes: 'Warehouse complex in good condition. Structural assessment completed. All measurements verified.',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
    measurements: 'Length: 120m, Width: 60m, Height: 20m',
    siteConditions: 'Excellent - Well maintained warehouse, good loading facilities'
  }
];

const ReviewReportsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ReviewReport | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | 'revision'>('approve');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filteredReports = mockReviewReports.filter(report => {
    const matchesSearch = report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.fieldAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'requires revision': return 'warning';
      default: return 'info';
    }
  };

  const getPriorityColor = (priority: string): ChipColor => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <WarningIcon />;
      case 'high': return <ErrorIcon />;
      case 'medium': return <CheckIcon />;
      default: return <CheckIcon />;
    }
  };

  const handleViewReport = (report: ReviewReport) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleReviewReport = (report: ReviewReport) => {
    setSelectedReport(report);
    setReviewNotes('');
    setReviewDecision('approve');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (selectedReport) {
      // Here you would typically update the report status in your backend
      const message = `Report ${reviewDecision === 'approve' ? 'approved' : reviewDecision === 'reject' ? 'rejected' : 'marked for revision'}`;
      setSnackbar({ open: true, message, severity: 'success' });
      setReviewDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f7fb' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 2 }}>
        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ color: '#666' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
                Review Reports
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Review and approve fieldwork reports from agents
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 3, py: 4 }}>
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {mockReviewReports.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Total Reports
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CheckIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {mockReviewReports.filter(r => r.status === 'approved').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Approved
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <ErrorIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                {mockReviewReports.filter(r => r.status === 'pending review').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Pending Review
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                {mockReviewReports.filter(r => r.priority === 'urgent').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Urgent Priority
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.4)' }} />,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending review">Pending Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="requires revision">Requires Revision</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority Filter</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority Filter"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                fullWidth
                sx={{ borderRadius: 3, borderColor: '#00897b', color: '#00897b' }}
              >
                Export Reports
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''} Found
            </Typography>
            
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Client & Agent</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Report Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value & Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status & Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} hover sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {report.clientName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                              {report.fieldAgent}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {report.reportType}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                            {report.assetType}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {formatCurrency(report.estimatedValue)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                              {report.location}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Chip
                            label={report.status.replace('_', ' ')}
                            color={getStatusColor(report.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Chip
                            icon={getPriorityIcon(report.priority)}
                            label={report.priority}
                            color={getPriorityColor(report.priority)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(report.submissionDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Report">
                            <IconButton
                              size="small"
                              onClick={() => handleViewReport(report)}
                              sx={{ color: '#1976d2' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {report.status === 'pending review' && (
                            <Tooltip title="Review Report">
                              <IconButton
                                size="small"
                                onClick={() => handleReviewReport(report)}
                                sx={{ color: '#00897b' }}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Download Documents">
                            <IconButton
                              size="small"
                              sx={{ color: '#7c3aed' }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* View Report Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', fontWeight: 600 }}>
          Field Report Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedReport && (
            <Box>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Client Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Client Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedReport.clientName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Field Agent</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedReport.fieldAgent}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Asset Type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedReport.assetType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Location</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedReport.location}</Typography>
                    </Box>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Report Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Report Type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedReport.reportType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Estimated Value</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatCurrency(selectedReport.estimatedValue)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Priority</Typography>
                      <Chip
                        icon={getPriorityIcon(selectedReport.priority)}
                        label={selectedReport.priority}
                        color={getPriorityColor(selectedReport.priority)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>Status</Typography>
                      <Chip
                        label={selectedReport.status.replace('_', ' ')}
                        color={getStatusColor(selectedReport.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Field Notes & Measurements
                </Typography>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>Field Notes</Typography>
                    <Typography variant="body1">{selectedReport.fieldNotes}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>Measurements</Typography>
                    <Typography variant="body1">{selectedReport.measurements}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>Site Conditions</Typography>
                  <Typography variant="body1">{selectedReport.siteConditions}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Documents & Photos
                </Typography>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>Documents</Typography>
                    <Stack spacing={1}>
                      {selectedReport.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          size="small"
                          icon={<DownloadIcon />}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>Photos</Typography>
                    <Typography variant="body1">{selectedReport.photos.length} photos taken</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedReport?.status === 'pending review' && (
            <Button
              variant="contained"
              onClick={() => {
                setViewDialogOpen(false);
                handleReviewReport(selectedReport);
              }}
              sx={{ bgcolor: '#00897b' }}
            >
              Review Report
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Review Report Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', fontWeight: 600 }}>
          Review Report
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedReport && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Reviewing report for <strong>{selectedReport.clientName}</strong> by {selectedReport.fieldAgent}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Review Decision</InputLabel>
                <Select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as 'approve' | 'reject' | 'revision')}
                  label="Review Decision"
                >
                  <MenuItem value="approve">Approve</MenuItem>
                  <MenuItem value="reject">Reject</MenuItem>
                  <MenuItem value="revision">Mark for Revision</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Review Notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            sx={{ 
              bgcolor: reviewDecision === 'approve' ? '#2e7d32' : 
                      reviewDecision === 'reject' ? '#d32f2f' : '#ed6c02'
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewReportsPage;
