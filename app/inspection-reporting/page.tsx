'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Grow
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoIcon,
  Description as DocumentIcon,
  Save as SaveIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function InspectionReporting() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    clientName: '',
    propertyLocation: '',
    inspectionDate: '',
    propertyType: '',
    propertySize: '',
    currentCondition: '',
    accessNotes: '',
    specialRequirements: '',
    photos: [] as string[],
    documents: [] as string[],
    measurements: {
      length: '',
      width: '',
      area: '',
      height: ''
    },
    observations: '',
    recommendations: '',
    estimatedValue: '',
    urgency: 'normal'
  });

  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    'Basic Information',
    'Property Details',
    'Photos & Documents',
    'Measurements',
    'Observations',
    'Review & Submit'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayUpdate = (field: 'photos' | 'documents', value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would typically send the data to your backend
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const renderBasicInformation = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <TextField
        fullWidth
        label="Client Name"
        value={formData.clientName}
        onChange={(e) => handleInputChange('clientName', e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Property Location"
        value={formData.propertyLocation}
        onChange={(e) => handleInputChange('propertyLocation', e.target.value)}
        required
      />
      <TextField
        fullWidth
        type="date"
        label="Inspection Date"
        value={formData.inspectionDate}
        onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />
      <FormControl fullWidth>
        <InputLabel>Property Type</InputLabel>
        <Select
          value={formData.propertyType}
          label="Property Type"
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
        >
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="industrial">Industrial</MenuItem>
          <MenuItem value="land">Land</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderPropertyDetails = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <TextField
        fullWidth
        label="Property Size"
        value={formData.propertySize}
        onChange={(e) => handleInputChange('propertySize', e.target.value)}
        placeholder="e.g., 500 sq meters"
      />
      <TextField
        fullWidth
        label="Current Condition"
        value={formData.currentCondition}
        onChange={(e) => handleInputChange('currentCondition', e.target.value)}
        placeholder="e.g., Good, Fair, Poor"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Access Notes"
        value={formData.accessNotes}
        onChange={(e) => handleInputChange('accessNotes', e.target.value)}
        placeholder="How to access the property, any restrictions, etc."
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Special Requirements"
        value={formData.specialRequirements}
        onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
        placeholder="Any special equipment or access needed"
      />
    </Box>
  );

  const renderPhotosDocuments = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Photos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {formData.photos.map((photo, index) => (
              <Chip
                key={index}
                label={`Photo ${index + 1}`}
                onDelete={() => {
                  const newPhotos = formData.photos.filter((_, i) => i !== index);
                  handleArrayUpdate('photos', newPhotos);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenPhotoDialog(true)}
            variant="outlined"
            fullWidth
          >
            Add Photo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Documents
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {formData.documents.map((doc, index) => (
              <Chip
                key={index}
                label={`Document ${index + 1}`}
                onDelete={() => {
                  const newDocs = formData.documents.filter((_, i) => i !== index);
                  handleArrayUpdate('documents', newDocs);
                }}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenDocumentDialog(true)}
            variant="outlined"
            fullWidth
          >
            Add Document
          </Button>
        </CardContent>
      </Card>
    </Box>
  );

  const renderMeasurements = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <TextField
        fullWidth
        label="Length"
        value={formData.measurements.length}
        onChange={(e) => handleInputChange('measurements.length', e.target.value)}
        placeholder="in meters"
      />
      <TextField
        fullWidth
        label="Width"
        value={formData.measurements.width}
        onChange={(e) => handleInputChange('measurements.width', e.target.value)}
        placeholder="in meters"
      />
      <TextField
        fullWidth
        label="Area"
        value={formData.measurements.area}
        onChange={(e) => handleInputChange('measurements.area', e.target.value)}
        placeholder="in square meters"
      />
      <TextField
        fullWidth
        label="Height"
        value={formData.measurements.height}
        onChange={(e) => handleInputChange('measurements.height', e.target.value)}
        placeholder="in meters"
      />
    </Box>
  );

  const renderObservations = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Detailed Observations"
        value={formData.observations}
        onChange={(e) => handleInputChange('observations', e.target.value)}
        placeholder="Describe what you observed during the inspection..."
        required
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Recommendations"
        value={formData.recommendations}
        onChange={(e) => handleInputChange('recommendations', e.target.value)}
        placeholder="What actions should be taken..."
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <TextField
          fullWidth
          label="Estimated Value"
          value={formData.estimatedValue}
          onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
          placeholder="UGX"
        />
        <FormControl fullWidth>
          <InputLabel>Urgency</InputLabel>
          <Select
            value={formData.urgency}
            label="Urgency"
            onChange={(e) => handleInputChange('urgency', e.target.value)}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  const renderReview = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
      <Alert severity="info">
        Please review all the information before submitting. You can go back to make changes.
      </Alert>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Summary</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <AssignmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Client" 
                secondary={formData.clientName || 'Not specified'} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Location" 
                secondary={formData.propertyLocation || 'Not specified'} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhotoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Photos" 
                secondary={`${formData.photos.length} photos`} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DocumentIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Documents" 
                secondary={`${formData.documents.length} documents`} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderPropertyDetails();
      case 2:
        return renderPhotosDocuments();
      case 3:
        return renderMeasurements();
      case 4:
        return renderObservations();
      case 5:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Inspection Reporting
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Document property inspections and findings
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {submitted && (
          <Fade in timeout={500}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Inspection report submitted successfully! Redirecting to dashboard...
            </Alert>
          </Fade>
        )}

        <Grow in timeout={800}>
          <Box>
            {/* Stepper */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Step Content */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mt: 2 }}>
                {renderStepContent(activeStep)}
              </Box>
            </Paper>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<SendIcon />}
                    disabled={submitted}
                  >
                    Submit Report
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    startIcon={<SaveIcon />}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Grow>
      </Box>

      {/* Photo Dialog */}
      <Dialog open={openPhotoDialog} onClose={() => setOpenPhotoDialog(false)}>
        <DialogTitle>Add Photo</DialogTitle>
        <DialogContent>
          <Typography>
            Photo upload functionality would be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhotoDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              const newPhotos = [...formData.photos, `Photo ${formData.photos.length + 1}`];
              handleArrayUpdate('photos', newPhotos);
              setOpenPhotoDialog(false);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={openDocumentDialog} onClose={() => setOpenDocumentDialog(false)}>
        <DialogTitle>Add Document</DialogTitle>
        <DialogContent>
          <Typography>
            Document upload functionality would be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocumentDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              const newDocs = [...formData.documents, `Document ${formData.documents.length + 1}`];
              handleArrayUpdate('documents', newDocs);
              setOpenDocumentDialog(false);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 