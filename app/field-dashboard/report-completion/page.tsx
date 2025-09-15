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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Assessment as ReportIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import { useUser } from '../../../components/UserContext';

interface Job {
  id: number;
  client_name: string;
  client_info: any;
  project_details: any;
  financial_details: any;
  report_requirements: any;
  status: string;
  created_at: string;
  report: {
    id: number;
    report_type: string;
    report_title: string;
    report_reference_number: string;
    status: string;
    admin_data: any;
    field_data: any;
    qa_data: any;
    created_at: string;
  };
}

interface FieldFormData {
  inspection_details: {
    inspection_date: string;
    inspection_accompanied_by: {
      name: string;
      role: string;
      registered_owner_present: boolean;
    };
  };
  assets: Array<{
    asset_name: string;
    category: string;
    make_and_model: string;
    serial_number: string;
    year_of_manufacture: number | null;
  }>;
  valuation_findings: Array<{
    asset_name: string;
    operational_status: string;
    physical_condition: string;
    maintenance_notes: string;
    estimated_value: {
      market_value: number | null;
      forced_sale_value: number | null;
      currency: string;
    };
  }>;
  valuation_methodology: {
    method_summary: string;
    tools_used: string[];
    data_sources: string[];
  };
  photos: string[];
  gps_coordinates: {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
  };
}

export default function FieldReportCompletion() {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [template, setTemplate] = useState<any | null>(null);
  const [formData, setFormData] = useState<FieldFormData>({
    inspection_details: {
      inspection_date: '',
      inspection_accompanied_by: {
        name: '',
        role: '',
        registered_owner_present: false
      }
    },
    assets: [{
      asset_name: '',
      category: '',
      make_and_model: '',
      serial_number: '',
      year_of_manufacture: null
    }],
    valuation_findings: [{
      asset_name: '',
      operational_status: '',
      physical_condition: '',
      maintenance_notes: '',
      estimated_value: {
        market_value: null,
        forced_sale_value: null,
        currency: 'UGX'
      }
    }],
    valuation_methodology: {
      method_summary: '',
      tools_used: [],
      data_sources: []
    },
    photos: [],
    gps_coordinates: {
      latitude: null,
      longitude: null,
      accuracy: null
    }
  });
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const steps = [
    'Inspection Details',
    'Asset Information',
    'Valuation Findings',
    'Methodology & Media'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  // Load template for the opened job (so field team continues from admin)
  useEffect(() => {
    const loadTemplate = async () => {
      if (!selectedJob) return;
      try {
        const type = selectedJob.report?.report_type || selectedJob.report_requirements?.report_type;
        if (!type) return;
        const res = await fetch(`/api/report-templates?type=${encodeURIComponent(type)}`, { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplate(data.templates[0]);
        } else if (data?.success && data.template) {
          setTemplate(data.template);
        }
      } catch (e) {
        // ignore
      }
    };
    loadTemplate();
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setSnackbar({ open: true, message: 'Failed to fetch jobs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartReport = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      inspection_details: {
        inspection_date: new Date().toISOString().split('T')[0],
        inspection_accompanied_by: {
          name: '',
          role: '',
          registered_owner_present: false
        }
      },
      assets: [{
        asset_name: '',
        category: '',
        make_and_model: '',
        serial_number: '',
        year_of_manufacture: null
      }],
      valuation_findings: [{
        asset_name: '',
        operational_status: '',
        physical_condition: '',
        maintenance_notes: '',
        estimated_value: {
          market_value: null,
          forced_sale_value: null,
          currency: 'UGX'
        }
      }],
      valuation_methodology: {
        method_summary: '',
        tools_used: [],
        data_sources: []
      },
      photos: [],
      gps_coordinates: {
        latitude: null,
        longitude: null,
        accuracy: null
      }
    });
    setFormDialogOpen(true);
    setActiveStep(0);
    setSelfieFile(null);
    setPhotoFiles([]);
  };

  const handleSubmitReport = async () => {
    if (!selectedJob) return;

    try {
      const response = await fetch(`/api/reports/${selectedJob.report.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_data: formData,
          status: 'pending QA',
          field_proof: {
            selfie_uploaded: Boolean(selfieFile),
            photos_count: photoFiles.length,
            gps: formData.gps_coordinates,
            submitted_at: new Date().toISOString()
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        // Advance assignment to QA stage
        try { await fetch('/api/job-assignments/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job_id: selectedJob.id, current_stage: 'field' }) }); } catch {}
        setSnackbar({ open: true, message: 'Field report submitted successfully!', severity: 'success' });
        setFormDialogOpen(false);
        fetchJobs();
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to submit report', severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSnackbar({ open: true, message: 'Failed to submit report', severity: 'error' });
    }
  };

  const handleDownloadReport = async (reportId: number) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/generate-pdf`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        window.open(data.data.download_url, '_blank');
        setSnackbar({ open: true, message: 'Report downloaded successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to generate PDF', severity: 'error' });
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setSnackbar({ open: true, message: 'Failed to download report', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'field_completed': return 'info';
      case 'qa_approved': return 'success';
      case 'md_approved': return 'success';
      default: return 'default';
    }
  };

  const renderInspectionDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Inspection Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Inspection Date"
          type="date"
          value={formData.inspection_details.inspection_date}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            inspection_details: { ...prev.inspection_details, inspection_date: e.target.value }
          }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Accompanied By Name"
          value={formData.inspection_details.inspection_accompanied_by.name}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            inspection_details: {
              ...prev.inspection_details,
              inspection_accompanied_by: { ...prev.inspection_details.inspection_accompanied_by, name: e.target.value }
            }
          }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Accompanied By Role"
          value={formData.inspection_details.inspection_accompanied_by.role}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            inspection_details: {
              ...prev.inspection_details,
              inspection_accompanied_by: { ...prev.inspection_details.inspection_accompanied_by, role: e.target.value }
            }
          }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.inspection_details.inspection_accompanied_by.registered_owner_present}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                inspection_details: {
                  ...prev.inspection_details,
                  inspection_accompanied_by: {
                    ...prev.inspection_details.inspection_accompanied_by,
                    registered_owner_present: e.target.checked
                  }
                }
              }))}
            />
          }
          label="Registered Owner Present"
        />
      </Grid>
    </Grid>
  );

  const renderAssetInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Asset Information</Typography>
      </Grid>
      {formData.assets.map((asset, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Asset {index + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={asset.asset_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assets: prev.assets.map((a, i) => i === index ? { ...a, asset_name: e.target.value } : a)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={asset.category}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      assets: prev.assets.map((a, i) => i === index ? { ...a, category: e.target.value } : a)
                    }))}
                    label="Category"
                  >
                    <MenuItem value="Tractor">Tractor</MenuItem>
                    <MenuItem value="Harvester">Harvester</MenuItem>
                    <MenuItem value="Planter">Planter</MenuItem>
                    <MenuItem value="Cultivator">Cultivator</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Make and Model"
                  value={asset.make_and_model}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assets: prev.assets.map((a, i) => i === index ? { ...a, make_and_model: e.target.value } : a)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={asset.serial_number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assets: prev.assets.map((a, i) => i === index ? { ...a, serial_number: e.target.value } : a)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year of Manufacture"
                  type="number"
                  value={asset.year_of_manufacture || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assets: prev.assets.map((a, i) => i === index ? { ...a, year_of_manufacture: parseInt(e.target.value) || null } : a)
                  }))}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderValuationFindings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Valuation Findings</Typography>
      </Grid>
      {formData.valuation_findings.map((finding, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Valuation Finding {index + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={finding.asset_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    valuation_findings: prev.valuation_findings.map((f, i) => i === index ? { ...f, asset_name: e.target.value } : f)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Operational Status</InputLabel>
                  <Select
                    value={finding.operational_status}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      valuation_findings: prev.valuation_findings.map((f, i) => i === index ? { ...f, operational_status: e.target.value } : f)
                    }))}
                    label="Operational Status"
                  >
                    <MenuItem value="Fully Operational">Fully Operational</MenuItem>
                    <MenuItem value="Partially Operational">Partially Operational</MenuItem>
                    <MenuItem value="Non-Operational">Non-Operational</MenuItem>
                    <MenuItem value="Under Repair">Under Repair</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Physical Condition</InputLabel>
                  <Select
                    value={finding.physical_condition}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      valuation_findings: prev.valuation_findings.map((f, i) => i === index ? { ...f, physical_condition: e.target.value } : f)
                    }))}
                    label="Physical Condition"
                  >
                    <MenuItem value="Excellent">Excellent</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Fair">Fair</MenuItem>
                    <MenuItem value="Poor">Poor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maintenance Notes"
                  value={finding.maintenance_notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    valuation_findings: prev.valuation_findings.map((f, i) => i === index ? { ...f, maintenance_notes: e.target.value } : f)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Market Value"
                  type="number"
                  value={finding.estimated_value.market_value || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    valuation_findings: prev.valuation_findings.map((f, i) => i === index ? {
                      ...f,
                      estimated_value: { ...f.estimated_value, market_value: parseFloat(e.target.value) || null }
                    } : f)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Forced Sale Value"
                  type="number"
                  value={finding.estimated_value.forced_sale_value || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    valuation_findings: prev.valuation_findings.map((f, i) => i === index ? {
                      ...f,
                      estimated_value: { ...f.estimated_value, forced_sale_value: parseFloat(e.target.value) || null }
                    } : f)
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={finding.estimated_value.currency}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      valuation_findings: prev.valuation_findings.map((f, i) => i === index ? {
                        ...f,
                        estimated_value: { ...f.estimated_value, currency: e.target.value }
                      } : f)
                    }))}
                    label="Currency"
                  >
                    <MenuItem value="UGX">UGX</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderMethodologyAndMedia = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Methodology & Media</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Method Summary"
          multiline
          rows={4}
          value={formData.valuation_methodology.method_summary}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            valuation_methodology: { ...prev.valuation_methodology, method_summary: e.target.value }
          }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Tools Used"
          multiline
          rows={3}
          placeholder="List tools used for valuation..."
          value={formData.valuation_methodology.tools_used.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            valuation_methodology: { ...prev.valuation_methodology, tools_used: e.target.value.split(', ') }
          }))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data Sources"
          multiline
          rows={3}
          placeholder="List data sources used..."
          value={formData.valuation_methodology.data_sources.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            valuation_methodology: { ...prev.valuation_methodology, data_sources: e.target.value.split(', ') }
          }))}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>GPS Coordinates</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.gps_coordinates.latitude || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gps_coordinates: { ...prev.gps_coordinates, latitude: parseFloat(e.target.value) || null }
              }))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.gps_coordinates.longitude || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gps_coordinates: { ...prev.gps_coordinates, longitude: parseFloat(e.target.value) || null }
              }))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Accuracy (meters)"
              type="number"
              value={formData.gps_coordinates.accuracy || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gps_coordinates: { ...prev.gps_coordinates, accuracy: parseFloat(e.target.value) || null }
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setFormData(prev => ({
                      ...prev,
                      gps_coordinates: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                      }
                    }));
                  });
                }
              }}
            >
              Use Current Location
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Site Proof (Selfie & Photos)</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button component="label" variant="contained" startIcon={<PhotoCamera />}>Upload Selfie
            <input type="file" accept="image/*" hidden onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
          </Button>
          <Button component="label" variant="outlined">Upload Photos
            <input type="file" accept="image/*" multiple hidden onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
          </Button>
          <Typography variant="body2" color="text.secondary">
            {selfieFile ? `Selfie: ${selfieFile.name}` : 'No selfie selected'} • {photoFiles.length} additional photo(s)
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderAdminContext = () => {
    if (!selectedJob?.report?.admin_data) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Admin Submitted Data</Typography>
        <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(selectedJob.report.admin_data, null, 2)}</pre>
        </Paper>
      </Box>
    );
  };

  const renderFieldTemplateExtras = () => {
    if (!template?.field_mandatory && !template?.field_optional) return null;
    const all = [
      ...(template.field_mandatory || []).map((f: any) => ({ ...f, required: true })),
      ...(template.field_optional || []).map((f: any) => ({ ...f, required: false }))
    ];
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Template Fields (Field Team)</Typography>
        <Grid container spacing={2}>
          {all.map((f: any) => (
            <Grid item xs={12} md={6} key={f.key}>
              <TextField
                fullWidth
                label={`${f.label || f.key}${f.required ? ' *' : ''}`}
                value={(formData as any)[f.key] || ''}
                onChange={(e) => setFormData(prev => ({ ...(prev as any), [f.key]: e.target.value }) as any)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return renderInspectionDetails();
      case 1: return renderAssetInformation();
      case 2: return renderValuationFindings();
      case 3: return renderMethodologyAndMedia();
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportIcon color="primary" />
          Field Report Completion
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchJobs}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {job.client_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {job.client_info?.contact_person}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {job.project_details?.project_title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {job.project_details?.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={job.report_requirements?.report_type || 'N/A'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={job.report?.status || 'pending'} 
                        color={getStatusColor(job.report?.status || 'pending')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleStartReport(job)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleDownloadReport(job.report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Report Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Complete Field Report: {selectedJob?.client_name}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              {renderAdminContext()}
              {renderFieldTemplateExtras()}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Paper sx={{ p: 3, mb: 3 }}>
                {renderStepContent(activeStep)}
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SendIcon />}
                      onClick={handleSubmitReport}
                    >
                      Submit to QA
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setActiveStep(activeStep + 1)}
                      variant="contained"
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
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
