'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  Fade,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useJobs } from '../../../components/JobsContext';
import { useNotifications } from '../../../components/NotificationsContext';
import { useRouter } from 'next/navigation';

const steps = [
  'Client Information',
  'Property Details',
  'Valuation Requirements',
  'Document Upload'
];

const requiredDocuments = [
  'Copy of instructions',
  'Copy of title',
  'Bill of quantities',
  'Architectural plan',
  'NEMA Certificate',
  'Print'
];

export default function AddClient() {
  const { addJob } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();


  const [activeStep, setActiveStep] = useState(0);
  type AssetType = 'land' | 'residential' | 'commercial' | 'industrial' | 'car' | 'machinery' | 'equipment';
type ClientType = 'individual' | 'company';
type Urgency = 'low' | 'normal' | 'high' | 'urgent';

const [formData, setFormData] = useState<{
  clientName: string;
  clientType: ClientType;
  contactNumber: string;
  email: string;
  idNumber: string;
  companyName: string;
  companyRegNumber: string;
  assetType: AssetType;
  location: string;
  landTitle: string;
  plotNumber: string;
  size: string;
  propertyUse: string;
  estimatedValue: string;
  urgency: Urgency;
  valuationPurpose: string;
  specialRequirements: string;
  preferredInspectionDate: string;
  notes: string;
  bankName: string;
  branch: string;
  contactPerson: string;
  contactNumberBank: string;
  emailBank: string;
}>({
    clientName: '',
    clientType: 'individual',
    contactNumber: '',
    email: '',
    idNumber: '',
    companyName: '',
    companyRegNumber: '',
    assetType: 'land',
    location: '',
    landTitle: '',
    plotNumber: '',
    size: '',
    propertyUse: '',
    estimatedValue: '',
    urgency: 'normal',
    valuationPurpose: '',
    specialRequirements: '',
    preferredInspectionDate: '',
    notes: '',
    bankName: '',
    branch: '',
    contactPerson: '',
    contactNumberBank: '',
    emailBank: ''
  });

  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [docType]: file }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
      if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (formData.clientType === 'company' && !formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
    }

    if (step === 1) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.landTitle.trim()) newErrors.landTitle = 'Land title is required';
      if (!formData.plotNumber.trim()) newErrors.plotNumber = 'Plot number is required';
      if (!formData.size.trim()) newErrors.size = 'Size is required';
      if (!formData.estimatedValue.trim()) newErrors.estimatedValue = 'Estimated value is required';
    }

    if (step === 2) {
      if (!formData.valuationPurpose.trim()) newErrors.valuationPurpose = 'Valuation purpose is required';
      if (!formData.preferredInspectionDate.trim()) newErrors.preferredInspectionDate = 'Preferred inspection date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const newJob = {
        clientName: formData.clientName,
        clientInfo: {
          clientType: formData.clientType,
          contactNumber: formData.contactNumber,
          email: formData.email,
          address: formData.location
        },
        assetType: formData.assetType,
        assetDetails: {
          location: formData.location,
          size: formData.size,
          propertyUse: formData.propertyUse,
          previousWorkHistory: [],
          neighborhood: [formData.location.split(',')[0] || formData.location]
        },
        bankInfo: {
          bankName: formData.bankName,
          branch: formData.branch,
          contactPerson: formData.contactPerson,
          contactNumber: formData.contactNumberBank
        },
        valuationRequirements: {
          purpose: formData.valuationPurpose,
          value: parseFloat(formData.estimatedValue) || 0,
          currency: 'UGX',
          deadline: formData.preferredInspectionDate
        },
        status: 'pending fieldwork' as const,
        qaChecklist: {
          completed: false,
          items: [],
          notes: ""
        },
        chain: ["Field Team", "QA Officer", "MD", "Accounts"]
      };

      addJob(newJob);

      // Send notification to field supervisors
      addNotification("admin", {
        title: "New Client Onboarded",
        message: `New client ${formData.clientName} onboarded - Ready for field inspection`,
        type: 'info',
        priority: "medium"
      });

      // Success notification
      addNotification("admin", {
        title: "Client Added Successfully",
        message: `Client ${formData.clientName} successfully added to the system`,
        type: 'success',
        priority: "medium"
      });

      router.push('/dashboard');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h6" mb={3} color="primary" fontWeight={600}>
                Client Information
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Client Name *"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  error={!!errors.clientName}
                  helperText={errors.clientName}
                  required
                />

                <FormControl fullWidth>
                  <InputLabel>Client Type *</InputLabel>
                  <Select
                    value={formData.clientType}
                    onChange={(e) => handleInputChange('clientType', e.target.value)}
                    label="Client Type *"
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Contact Number *"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  required
                />

                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />

                {formData.clientType === 'individual' ? (
                  <TextField
                    fullWidth
                    label="ID Number"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  />
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Company Registration Number"
                      value={formData.companyRegNumber}
                      onChange={(e) => handleInputChange('companyRegNumber', e.target.value)}
                    />
                  </>
                )}
              </Box>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h6" mb={3} color="primary" fontWeight={600}>
                Property Details
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Asset Type *</InputLabel>
                  <Select
                    value={formData.assetType}
                    onChange={(e) => handleInputChange('assetType', e.target.value)}
                    label="Asset Type *"
                  >
                    <MenuItem value="land">Land</MenuItem>
                    <MenuItem value="building">Building</MenuItem>
                    <MenuItem value="vehicle">Vehicle</MenuItem>
                    <MenuItem value="equipment">Equipment</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Location *"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  error={!!errors.location}
                  helperText={errors.location}
                  required
                />

                <TextField
                  fullWidth
                  label="Land Title *"
                  value={formData.landTitle}
                  onChange={(e) => handleInputChange('landTitle', e.target.value)}
                  error={!!errors.landTitle}
                  helperText={errors.landTitle}
                  required
                />

                <TextField
                  fullWidth
                  label="Plot Number *"
                  value={formData.plotNumber}
                  onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                  error={!!errors.plotNumber}
                  helperText={errors.plotNumber}
                  required
                />

                <TextField
                  fullWidth
                  label="Size *"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  error={!!errors.size}
                  helperText={errors.size}
                  placeholder="e.g., 100m², 1 acre"
                  required
                />

                <TextField
                  fullWidth
                  label="Property Use"
                  value={formData.propertyUse}
                  onChange={(e) => handleInputChange('propertyUse', e.target.value)}
                  placeholder="e.g., Residential, Commercial, Agricultural"
                />

                <TextField
                  fullWidth
                  label="Estimated Value *"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  error={!!errors.estimatedValue}
                  helperText={errors.estimatedValue}
                  placeholder="e.g., 5,000,000"
                  required
                />

                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    label="Urgency Level"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h6" mb={3} color="primary" fontWeight={600}>
                Valuation Requirements
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Valuation Purpose *"
                  value={formData.valuationPurpose}
                  onChange={(e) => handleInputChange('valuationPurpose', e.target.value)}
                  error={!!errors.valuationPurpose}
                  helperText={errors.valuationPurpose}
                  placeholder="e.g., Mortgage, Insurance, Sale"
                  required
                />

                <TextField
                  fullWidth
                  label="Preferred Inspection Date *"
                  type="date"
                  value={formData.preferredInspectionDate}
                  onChange={(e) => handleInputChange('preferredInspectionDate', e.target.value)}
                  error={!!errors.preferredInspectionDate}
                  helperText={errors.preferredInspectionDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Special Requirements"
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any special requirements or conditions"
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional information or notes"
                  multiline
                  rows={3}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" mb={2} color="primary" fontWeight={600}>
                  Bank Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="e.g., Stanbic Bank, Equity Bank"
                  />

                  <TextField
                    fullWidth
                    label="Branch"
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    placeholder="e.g., Westlands, CBD"
                  />

                  <TextField
                    fullWidth
                    label="Contact Person"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Bank representative name"
                  />

                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={formData.contactNumberBank}
                    onChange={(e) => handleInputChange('contactNumberBank', e.target.value)}
                    placeholder="Bank contact number"
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.emailBank}
                    onChange={(e) => handleInputChange('emailBank', e.target.value)}
                    placeholder="Bank email address"
                  />
                </Box>
              </Box>
            </Box>
          </Fade>
        );

      case 3:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h6" mb={3} color="primary" fontWeight={600}>
                Required Documents
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Please upload all required documents. These documents will be attached to the client&apos;s record and used for the valuation process.
                </Typography>
              </Alert>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {requiredDocuments.map((docType) => (
                  <Card key={docType} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: '8px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {docType}
                        </Typography>
                        {documents[docType] && (
                          <Chip
                            icon={<CheckIcon />}
                            label="Uploaded"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          startIcon={<UploadIcon />}
                          fullWidth
                        >
                          {documents[docType] ? documents[docType]?.name : 'Upload File'}
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleDocumentUpload(docType, e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </Button>
                        
                        {documents[docType] && (
                          <Tooltip title="Remove file">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDocumentUpload(docType, null)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            bgcolor: 'rgba(255,255,255,0.2)'
          }}>
            {/* Stanfield Logo - CSS Generated */}
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Red geometric shape - upper left */}
              <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '40%',
                height: '40%',
                backgroundColor: '#e53935',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
                zIndex: 2
              }} />
              
              {/* Dark gray geometric shape - lower right */}
              <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '40%',
                height: '40%',
                backgroundColor: '#424242',
                clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
                zIndex: 2
              }} />
              
              {/* Diagonal line connecting the shapes */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '80%',
                height: '3px',
                backgroundColor: '#1976d2',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                zIndex: 1
              }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={600} color="white">
            Stanfield Property Partners
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            ← Return to Dashboard
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Typography variant="h4" fontWeight={700}>
            Add New Client
          </Typography>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
          {renderStepContent(activeStep)}
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="large"
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<CheckIcon />}
                size="large"
                sx={{ px: 4 }}
              >
                Submit Client
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                size="large"
                sx={{ px: 4 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
