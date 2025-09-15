'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface AdminFormData {
  project_details: {
    report_title: string;
    report_reference_number: string;
    report_date: string;
    assignment_type: string;
    assignment_purpose: string;
    report_recipient: {
      name: string;
      organization: string;
      branch: string;
      location: string;
    };
  };
  client_details: {
    name: string;
    branch: string;
    location: string;
    contact_person: {
      name: string;
      contact_number: string;
      role: string;
    };
  };
  ownership_and_registration_info: {
    registered_owner: {
      name: string;
      address: string;
      contact_number: string;
    };
    machinery_registration_details: {
      registration_number: string;
      source_of_information: string;
    };
  };
  related_documents: {
    purchase_documents: string[];
    registration_documents: string[];
  };
  search_report_details: {
    search_reference_number: string | null;
    search_date: string | null;
    search_signed_by: {
      name: string | null;
      role: string | null;
    };
  };
}

export default function AdminReportForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminFormData>({
    project_details: {
      report_title: '',
      report_reference_number: '',
      report_date: '',
      assignment_type: '',
      assignment_purpose: '',
      report_recipient: {
        name: '',
        organization: '',
        branch: '',
        location: ''
      }
    },
    client_details: {
      name: '',
      branch: '',
      location: '',
      contact_person: {
        name: '',
        contact_number: '',
        role: ''
      }
    },
    ownership_and_registration_info: {
      registered_owner: {
        name: '',
        address: '',
        contact_number: ''
      },
      machinery_registration_details: {
        registration_number: '',
        source_of_information: ''
      }
    },
    related_documents: {
      purchase_documents: [],
      registration_documents: []
    },
    search_report_details: {
      search_reference_number: null,
      search_date: null,
      search_signed_by: {
        name: null,
        role: null
      }
    }
  });

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const steps = [
    'Project Details',
    'Client Information',
    'Ownership & Registration',
    'Related Documents',
    'Search Report Details'
  ];

  const handleInputChange = (section: string, field: string, value: any, subField?: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: subField 
        ? { ...prev[section as keyof AdminFormData], [field]: { ...prev[section as keyof AdminFormData][field], [subField]: value } }
        : { ...prev[section as keyof AdminFormData], [field]: value }
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would save the admin data to the report
      console.log('Saving admin form data:', formData);
      setSnackbar({ open: true, message: 'Admin data saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving admin data:', error);
      setSnackbar({ open: true, message: 'Failed to save admin data', severity: 'error' });
    }
  };

  const renderProjectDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Project Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Report Title"
          value={formData.project_details.report_title}
          onChange={(e) => handleInputChange('project_details', 'report_title', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Report Reference Number"
          value={formData.project_details.report_reference_number}
          onChange={(e) => handleInputChange('project_details', 'report_reference_number', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Report Date"
          type="date"
          value={formData.project_details.report_date}
          onChange={(e) => handleInputChange('project_details', 'report_date', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Assignment Type</InputLabel>
          <Select
            value={formData.project_details.assignment_type}
            onChange={(e) => handleInputChange('project_details', 'assignment_type', e.target.value)}
            label="Assignment Type"
          >
            <MenuItem value="Valuation">Valuation</MenuItem>
            <MenuItem value="Inspection">Inspection</MenuItem>
            <MenuItem value="Assessment">Assessment</MenuItem>
            <MenuItem value="Review">Review</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Assignment Purpose"
          multiline
          rows={3}
          value={formData.project_details.assignment_purpose}
          onChange={(e) => handleInputChange('project_details', 'assignment_purpose', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Report Recipient</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Recipient Name"
          value={formData.project_details.report_recipient.name}
          onChange={(e) => handleInputChange('project_details', 'report_recipient', e.target.value, 'name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Organization"
          value={formData.project_details.report_recipient.organization}
          onChange={(e) => handleInputChange('project_details', 'report_recipient', e.target.value, 'organization')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Branch"
          value={formData.project_details.report_recipient.branch}
          onChange={(e) => handleInputChange('project_details', 'report_recipient', e.target.value, 'branch')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Location"
          value={formData.project_details.report_recipient.location}
          onChange={(e) => handleInputChange('project_details', 'report_recipient', e.target.value, 'location')}
        />
      </Grid>
    </Grid>
  );

  const renderClientDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Client Information</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Client Name"
          value={formData.client_details.name}
          onChange={(e) => handleInputChange('client_details', 'name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Branch"
          value={formData.client_details.branch}
          onChange={(e) => handleInputChange('client_details', 'branch', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Location"
          value={formData.client_details.location}
          onChange={(e) => handleInputChange('client_details', 'location', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Contact Person</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Contact Name"
          value={formData.client_details.contact_person.name}
          onChange={(e) => handleInputChange('client_details', 'contact_person', e.target.value, 'name')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Contact Number"
          value={formData.client_details.contact_person.contact_number}
          onChange={(e) => handleInputChange('client_details', 'contact_person', e.target.value, 'contact_number')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Role"
          value={formData.client_details.contact_person.role}
          onChange={(e) => handleInputChange('client_details', 'contact_person', e.target.value, 'role')}
        />
      </Grid>
    </Grid>
  );

  const renderOwnershipDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Ownership & Registration Information</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Registered Owner</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Owner Name"
          value={formData.ownership_and_registration_info.registered_owner.name}
          onChange={(e) => handleInputChange('ownership_and_registration_info', 'registered_owner', e.target.value, 'name')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Address"
          value={formData.ownership_and_registration_info.registered_owner.address}
          onChange={(e) => handleInputChange('ownership_and_registration_info', 'registered_owner', e.target.value, 'address')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Contact Number"
          value={formData.ownership_and_registration_info.registered_owner.contact_number}
          onChange={(e) => handleInputChange('ownership_and_registration_info', 'registered_owner', e.target.value, 'contact_number')}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Machinery Registration Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Registration Number"
          value={formData.ownership_and_registration_info.machinery_registration_details.registration_number}
          onChange={(e) => handleInputChange('ownership_and_registration_info', 'machinery_registration_details', e.target.value, 'registration_number')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Source of Information"
          value={formData.ownership_and_registration_info.machinery_registration_details.source_of_information}
          onChange={(e) => handleInputChange('ownership_and_registration_info', 'machinery_registration_details', e.target.value, 'source_of_information')}
        />
      </Grid>
    </Grid>
  );

  const renderRelatedDocuments = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Related Documents</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>Purchase Documents</Typography>
        <TextField
          fullWidth
          label="Document Details"
          multiline
          rows={3}
          placeholder="List purchase documents..."
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>Registration Documents</Typography>
        <TextField
          fullWidth
          label="Document Details"
          multiline
          rows={3}
          placeholder="List registration documents..."
        />
      </Grid>
    </Grid>
  );

  const renderSearchReportDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Search Report Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Search Reference Number"
          value={formData.search_report_details.search_reference_number || ''}
          onChange={(e) => handleInputChange('search_report_details', 'search_reference_number', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Search Date"
          type="date"
          value={formData.search_report_details.search_date || ''}
          onChange={(e) => handleInputChange('search_report_details', 'search_date', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Signed By Name"
          value={formData.search_report_details.search_signed_by.name || ''}
          onChange={(e) => handleInputChange('search_report_details', 'search_signed_by', e.target.value, 'name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Signed By Role"
          value={formData.search_report_details.search_signed_by.role || ''}
          onChange={(e) => handleInputChange('search_report_details', 'search_signed_by', e.target.value, 'role')}
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return renderProjectDetails();
      case 1: return renderClientDetails();
      case 2: return renderOwnershipDetails();
      case 3: return renderRelatedDocuments();
      case 4: return renderSearchReportDetails();
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportIcon color="primary" />
          Admin Report Form
        </Typography>
      </Box>

      <Card>
        <CardContent>
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
              <Button
                onClick={handleSave}
                startIcon={<SaveIcon />}
                variant="contained"
                sx={{ mr: 2 }}
              >
                Save Progress
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleSave();
                    router.push('/admin/report-management');
                  }}
                >
                  Complete Admin Section
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
        </CardContent>
      </Card>

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


