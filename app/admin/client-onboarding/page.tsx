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
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  Assessment as ReportIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ClientData {
  client_details: {
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    client_type: string;
    institution_type: string;
  };
  project_details: {
    project_title: string;
    project_type: string;
    location: string;
    estimated_value: number;
    currency: string;
    project_description: string;
  };
  financial_details: {
    gross_revenue: number;
    net_revenue: number;
    fees: number;
    deposit_received: number;
    payment_status: string;
  };
  report_requirements: {
    report_type: string;
    urgency: string;
    special_requirements: string;
  };
}

export default function ClientOnboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClientData>({
    client_details: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      client_type: '',
      institution_type: ''
    },
    project_details: {
      project_title: '',
      project_type: '',
      location: '',
      estimated_value: 0,
      currency: 'UGX',
      project_description: ''
    },
    financial_details: {
      gross_revenue: 0,
      net_revenue: 0,
      fees: 0,
      deposit_received: 0,
      payment_status: 'pending'
    },
    report_requirements: {
      report_type: '',
      urgency: 'normal',
      special_requirements: ''
    }
  });

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const steps = [
    'Client Information',
    'Project Details',
    'Financial Information',
    'Report Requirements'
  ];

  const reportTypes = [
    'Agricultural Machinery',
    'Boundary Opening',
    'Bulk Materials',
    'Commercial Vehicles',
    'Forestry_Timber Property'
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof ClientData], [field]: value }
    }));
  };

  const handleSaveAndCreateJob = async () => {
    try {
      // Create job with client data - mapping to correct field names
      const jobData = {
        client_name: formData.client_details.name,
        client_info: {
          email: formData.client_details.email,
          address: formData.client_details.address,
          clientType: formData.client_details.client_type,
          contactNumber: formData.client_details.phone,
          contactPerson: formData.client_details.contact_person
        },
        asset_type: formData.project_details.project_type,
        asset_details: {
          size: formData.project_details.estimated_value.toString(),
          location: formData.project_details.location,
          propertyUse: formData.project_details.project_title,
          neighborhood: [formData.project_details.location]
        },
        valuation_requirements: {
          value: formData.project_details.estimated_value,
          purpose: formData.project_details.project_type,
          currency: formData.project_details.currency,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        },
        bank_info: {
          branch: formData.client_details.institution_type,
          bankName: formData.client_details.institution_type,
          contactNumber: formData.client_details.phone,
          contactPerson: formData.client_details.contact_person
        },
        status: 'pending fieldwork',
        qa_checklist: {
          items: ['Site Inspection', 'Document Collection', 'Initial Assessment'],
          notes: 'New assignment, awaiting field team inspection',
          completed: false
        },
        field_report_data: {},
        admin_reviewed: false,
        admin_review_date: null,
        admin_review_notes: null,
        qa_notes: null,
        md_approval: null,
        payment_received: false,
        revocation_reason: null,
        chain: {
          surveyor: null // Will be assigned later
        }
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Client onboarded and job created successfully!', severity: 'success' });
        
        // Create initial report
        const reportData = {
          job_id: data.data.id,
          report_type: formData.report_requirements.report_type,
          report_title: `${formData.report_requirements.report_type} - ${formData.client_details.name}`,
          created_by: 1,
          assigned_to: 1
        };

        const reportResponse = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        });

        if (reportResponse.ok) {
          setSnackbar({ open: true, message: 'Client onboarded, job created, and report initialized!', severity: 'success' });
          setTimeout(() => router.push('/admin/client-database'), 2000);
        }
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to create job', severity: 'error' });
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setSnackbar({ open: true, message: 'Failed to create job', severity: 'error' });
    }
  };

  const renderClientInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Client Information</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Client Name"
          value={formData.client_details.name}
          onChange={(e) => handleInputChange('client_details', 'name', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Contact Person"
          value={formData.client_details.contact_person}
          onChange={(e) => handleInputChange('client_details', 'contact_person', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.client_details.email}
          onChange={(e) => handleInputChange('client_details', 'email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.client_details.phone}
          onChange={(e) => handleInputChange('client_details', 'phone', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={2}
          value={formData.client_details.address}
          onChange={(e) => handleInputChange('client_details', 'address', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Client Type</InputLabel>
          <Select
            value={formData.client_details.client_type}
            onChange={(e) => handleInputChange('client_details', 'client_type', e.target.value)}
            label="Client Type"
          >
            <MenuItem value="Bank">Bank</MenuItem>
            <MenuItem value="Non-Bank Institution">Non-Bank Institution</MenuItem>
            <MenuItem value="Individual">Individual</MenuItem>
            <MenuItem value="Government">Government</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Institution Type</InputLabel>
          <Select
            value={formData.client_details.institution_type}
            onChange={(e) => handleInputChange('client_details', 'institution_type', e.target.value)}
            label="Institution Type"
          >
            <MenuItem value="Commercial Bank">Commercial Bank</MenuItem>
            <MenuItem value="Microfinance">Microfinance</MenuItem>
            <MenuItem value="SACCO">SACCO</MenuItem>
            <MenuItem value="Insurance Company">Insurance Company</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderProjectDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Project Details</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Project Title"
          value={formData.project_details.project_title}
          onChange={(e) => handleInputChange('project_details', 'project_title', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Project Type</InputLabel>
          <Select
            value={formData.project_details.project_type}
            onChange={(e) => handleInputChange('project_details', 'project_type', e.target.value)}
            label="Project Type"
          >
            <MenuItem value="Valuation">Valuation</MenuItem>
            <MenuItem value="Inspection">Inspection</MenuItem>
            <MenuItem value="Assessment">Assessment</MenuItem>
            <MenuItem value="Review">Review</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Location"
          value={formData.project_details.location}
          onChange={(e) => handleInputChange('project_details', 'location', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Estimated Value"
          type="number"
          value={formData.project_details.estimated_value}
          onChange={(e) => handleInputChange('project_details', 'estimated_value', parseFloat(e.target.value) || 0)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Currency</InputLabel>
          <Select
            value={formData.project_details.currency}
            onChange={(e) => handleInputChange('project_details', 'currency', e.target.value)}
            label="Currency"
          >
            <MenuItem value="UGX">UGX</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Project Description"
          multiline
          rows={3}
          value={formData.project_details.project_description}
          onChange={(e) => handleInputChange('project_details', 'project_description', e.target.value)}
          required
        />
      </Grid>
    </Grid>
  );

  const renderFinancialDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Financial Information</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Gross Revenue"
          type="number"
          value={formData.financial_details.gross_revenue}
          onChange={(e) => handleInputChange('financial_details', 'gross_revenue', parseFloat(e.target.value) || 0)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Net Revenue"
          type="number"
          value={formData.financial_details.net_revenue}
          onChange={(e) => handleInputChange('financial_details', 'net_revenue', parseFloat(e.target.value) || 0)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Fees"
          type="number"
          value={formData.financial_details.fees}
          onChange={(e) => handleInputChange('financial_details', 'fees', parseFloat(e.target.value) || 0)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Deposit Received"
          type="number"
          value={formData.financial_details.deposit_received}
          onChange={(e) => handleInputChange('financial_details', 'deposit_received', parseFloat(e.target.value) || 0)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={formData.financial_details.payment_status}
            onChange={(e) => handleInputChange('financial_details', 'payment_status', e.target.value)}
            label="Payment Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderReportRequirements = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Report Requirements</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={formData.report_requirements.report_type}
            onChange={(e) => handleInputChange('report_requirements', 'report_type', e.target.value)}
            label="Report Type"
          >
            {reportTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Urgency</InputLabel>
          <Select
            value={formData.report_requirements.urgency}
            onChange={(e) => handleInputChange('report_requirements', 'urgency', e.target.value)}
            label="Urgency"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Special Requirements"
          multiline
          rows={3}
          value={formData.report_requirements.special_requirements}
          onChange={(e) => handleInputChange('report_requirements', 'special_requirements', e.target.value)}
          placeholder="Any special requirements or notes for this report..."
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return renderClientInformation();
      case 1: return renderProjectDetails();
      case 2: return renderFinancialDetails();
      case 3: return renderReportRequirements();
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
          <PersonAddIcon color="primary" />
          Client Onboarding
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
                onClick={handleSaveAndCreateJob}
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
                  startIcon={<SendIcon />}
                  onClick={handleSaveAndCreateJob}
                >
                  Complete Onboarding & Create Job
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
