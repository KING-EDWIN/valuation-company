'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  CircularProgress,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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

interface Job {
  id: number;
  client_name: string;
  client_info: any;
  asset_details: any;
  valuation_requirements: any;
  status: string;
  created_at: string;
}

export default function TemplateDataEntry() {
  const router = useRouter();
  
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: File[]}>({});
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<any>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTemplates();
    fetchJobs();
  }, []);

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

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setCompletedSections(new Set());
    setActiveStep(1);
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setActiveStep(2);
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
    const newFormData = { ...formData };
    const keys = fieldPath.split('.');
    let current = newFormData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newFormData);
  };

  const handleSectionComplete = (sectionName: string) => {
    setCompletedSections(prev => new Set([...prev, sectionName]));
  };

  const renderFormFields = (fields: any, sectionName: string, prefix = '') => {
    if (!fields || typeof fields !== 'object') return null;

    return Object.entries(fields).map(([key, value]) => {
      const fieldKey = prefix ? `${prefix}.${key}` : key;
      const fieldValue = getNestedValue(formData, fieldKey) || value || '';
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <Accordion key={fieldKey} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {key.replace(/_/g, ' ').toUpperCase()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ pl: 2 }}>
                {renderFormFields(value, sectionName, fieldKey)}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      } else if (Array.isArray(value)) {
        const isDocumentField = key.toLowerCase().includes('document') || 
                               key.toLowerCase().includes('attachment') || 
                               key.toLowerCase().includes('file') ||
                               key.toLowerCase().includes('image') ||
                               key.toLowerCase().includes('photo');
        
        return (
          <Box key={fieldKey} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            
            {isDocumentField ? (
              <Box>
                {/* File Upload Area */}
                <Paper
                  sx={{
                    p: 2,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                  onClick={() => document.getElementById(`file-upload-${fieldKey}`)?.click()}
                >
                  <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload images and PDFs
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Max 10MB per file
                  </Typography>
                  <input
                    id={`file-upload-${fieldKey}`}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(fieldKey, e.target.files)}
                  />
                </Paper>

                {/* Uploaded Files List */}
                {uploadedDocuments[fieldKey] && uploadedDocuments[fieldKey].length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Uploaded Files ({uploadedDocuments[fieldKey].length})
                    </Typography>
                    {uploadedDocuments[fieldKey].map((file, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getFileIcon(file)}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveDocument(fieldKey, index)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Array with {value.length} items
              </Typography>
            )}
          </Box>
        );
      } else {
        return (
          <TextField
            key={fieldKey}
            fullWidth
            label={key.replace(/_/g, ' ').toUpperCase()}
            value={fieldValue}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            sx={{ mb: 2 }}
            multiline={key.includes('description') || key.includes('notes') || key.includes('details')}
            rows={key.includes('description') || key.includes('notes') || key.includes('details') ? 3 : 1}
          />
        );
      }
    });
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const handleSaveAndContinue = () => {
    if (selectedTemplate && selectedJob) {
      // Save the form data and create/update report
      handleSubmitReport();
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedTemplate || !selectedJob) return;

    try {
      setLoading(true);
      
      // Create or update report with admin data
      const reportData = {
        job_id: selectedJob.id,
        report_type: selectedTemplate.report_type,
        report_title: `${selectedJob.client_name} - ${selectedTemplate.template_name}`,
        admin_data: { ...formData, uploadedDocuments },
        created_by: 1, // Admin user ID
        assigned_to: 1 // Will be reassigned later
      };

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ 
          open: true, 
          message: 'Report created successfully! Ready for field worker assignment.', 
          severity: 'success' 
        });
        setTimeout(() => {
          router.push('/admin/report-management');
        }, 2000);
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to create report', severity: 'error' });
      }
    } catch (error) {
      console.error('Error creating report:', error);
      setSnackbar({ open: true, message: 'Failed to create report', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (sectionKey: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== fileArray.length) {
      setSnackbar({
        open: true,
        message: 'Some files were rejected. Only images and PDFs under 10MB are allowed.',
        severity: 'warning'
      });
    }

    setUploadedDocuments(prev => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), ...validFiles]
    }));
  };

  const handleRemoveDocument = (sectionKey: string, fileIndex: number) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey]?.filter((_, index) => index !== fileIndex) || []
    }));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon fontSize="small" color="primary" />;
    } else if (file.type === 'application/pdf') {
      return <PdfIcon fontSize="small" color="error" />;
    }
    return <AttachFileIcon fontSize="small" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompletionPercentage = () => {
    if (!selectedTemplate) return 0;
    const totalFields = Object.keys(selectedTemplate.admin_mandatory || {}).length;
    const completedFields = Object.keys(formData).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Box sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Template Data Entry
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fill out report template data for client onboarding
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="horizontal">
              <Step>
                <StepLabel>Select Template</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Client</StepLabel>
              </Step>
              <Step>
                <StepLabel>Fill Data</StepLabel>
              </Step>
              <Step>
                <StepLabel>Submit Report</StepLabel>
              </Step>
            </Stepper>

            <Box sx={{ mt: 4 }}>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Select Report Template</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose the appropriate template for your report
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {templates.map((template) => (
                      <Grid item xs={12} md={6} lg={4} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer', 
                            '&:hover': { boxShadow: 3 },
                            border: selectedTemplate?.id === template.id ? 2 : 1,
                            borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider'
                          }}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <AssignmentIcon />
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
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Admin Fields: {Object.keys(template.admin_mandatory || {}).length} mandatory, {Object.keys(template.admin_optional || {}).length} optional
                            </Typography>
                            
                            <Button
                              fullWidth
                              variant={selectedTemplate?.id === template.id ? "contained" : "outlined"}
                              startIcon={<AssignmentIcon />}
                            >
                              {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && selectedTemplate && (
                <Box>
                  <Typography variant="h5" gutterBottom>Select Client</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose the client for this {selectedTemplate.report_type} report
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {jobs.map((job) => (
                      <Grid item xs={12} md={6} lg={4} key={job.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer', 
                            '&:hover': { boxShadow: 3 },
                            border: selectedJob?.id === job.id ? 2 : 1,
                            borderColor: selectedJob?.id === job.id ? 'primary.main' : 'divider'
                          }}
                          onClick={() => handleJobSelect(job)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: 'secondary.main' }}>
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
                            
                            <Chip 
                              label={job.status} 
                              color={job.status === 'complete' ? 'success' : 'warning'} 
                              size="small" 
                              sx={{ mb: 2 }}
                            />
                            
                            <Button
                              fullWidth
                              variant={selectedJob?.id === job.id ? "contained" : "outlined"}
                              startIcon={<BusinessIcon />}
                            >
                              {selectedJob?.id === job.id ? 'Selected' : 'Select Client'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && selectedTemplate && selectedJob && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">
                      Fill Template Data - {selectedTemplate.template_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress: {getCompletionPercentage()}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={getCompletionPercentage()} 
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Client: {selectedJob.client_name} | Template: {selectedTemplate.report_type}
                  </Typography>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Admin Mandatory Fields</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Fill out all required fields for this report template
                    </Typography>
                    {renderFormFields(selectedTemplate.admin_mandatory, 'admin_mandatory')}
                  </Paper>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Admin Optional Fields</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Additional information (optional)
                    </Typography>
                    {renderFormFields(selectedTemplate.admin_optional, 'admin_optional')}
                  </Paper>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveAndContinue}
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Save & Continue'}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 3 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Report Created Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    The report has been created and is ready for field worker assignment.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/admin/report-management')}
                    startIcon={<AssignmentIcon />}
                  >
                    Go to Report Management
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

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
