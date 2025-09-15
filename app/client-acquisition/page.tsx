"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, MenuItem, Alert, Card, CardContent, Chip } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';


const requiredDocuments = [
  { id: "instructions", label: "Copy of Instructions", required: true },
  { id: "title", label: "Copy of Title", required: true },
  { id: "boq", label: "Bill of Quantities", required: true },
  { id: "architectural", label: "Architectural Plan", required: true },
  { id: "nema", label: "NEMA Certificate", required: true },
];

export default function ClientAcquisitionPage() {
  const { addJob, jobs } = useJobs();
  const { addNotification } = useNotifications();

  const [submitted, setSubmitted] = useState(false);

  // Client Information
  const [clientInfo, setClientInfo] = useState({
    clientName: "",
    contactNumber: "",
    email: "",
    clientType: "individual" as "individual" | "company",
    idNumber: "",
    companyName: "",
    companyRegNumber: "",
  });

  // Property Information
  const [propertyInfo, setPropertyInfo] = useState({
    assetType: "land",
    propertyLocation: "",
    propertyAddress: "",
    landTitle: "",
    plotNumber: "",
    size: "",
    propertyUse: "",
    estimatedValue: "",
    urgency: "normal",
  });

  // Valuation Details
  const [valuationInfo, setValuationInfo] = useState({
    valuationPurpose: "",
    specialRequirements: "",
    preferredInspectionDate: "",
    notes: "",
  });

  // Document Uploads
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: File | null }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>({});

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  };

  const handlePropertyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyInfo({ ...propertyInfo, [e.target.name]: e.target.value });
  };

  const handleValuationInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValuationInfo({ ...valuationInfo, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setUploadedDocuments({ ...uploadedDocuments, [documentId]: file });
    setUploadStatus({ ...uploadStatus, [documentId]: true });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required documents
    const missingDocuments = requiredDocuments
      .filter(doc => doc.required && !uploadedDocuments[doc.id])
      .map(doc => doc.label);

    if (missingDocuments.length > 0) {
      alert(`Please upload the following required documents: ${missingDocuments.join(", ")}`);
      return;
    }

    // Create job with enhanced information
    const newJob = {
      clientName: clientInfo.clientName,
      clientInfo: {
        clientType: clientInfo.clientType as "individual" | "company",
        contactNumber: clientInfo.contactNumber,
        email: clientInfo.email,
        address: clientInfo.companyName || clientInfo.idNumber || "Address not provided"
      },
      assetType: propertyInfo.assetType,
      assetDetails: {
        location: propertyInfo.propertyLocation,
        size: propertyInfo.size,
        propertyUse: propertyInfo.propertyUse,
        previousWorkHistory: [],
        neighborhood: []
      },
      valuationRequirements: {
        purpose: valuationInfo.valuationPurpose,
        value: parseFloat(propertyInfo.estimatedValue) || 0,
        currency: "UGX",
        deadline: valuationInfo.preferredInspectionDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      bankInfo: {
        bankName: "To be determined",
        branch: "To be determined",
        contactPerson: "To be determined",
        contactNumber: "To be determined"
      },
      status: "pending fieldwork",
      qaChecklist: {
        completed: false,
        items: [],
        notes: ""
      },
              chain: {}
    };

    addJob(newJob);
    
    // Send notification to all roles
    addNotification("admin", {
      title: "New Client Onboarded",
      message: `New client onboarded: ${clientInfo.clientName} - ${propertyInfo.propertyLocation}`,
      type: "info",
      priority: "medium"
    });

    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setClientInfo({
        clientName: "",
        contactNumber: "",
        email: "",
        clientType: "individual",
        idNumber: "",
        companyName: "",
        companyRegNumber: "",
      });
      setPropertyInfo({
        assetType: "land",
        propertyLocation: "",
        propertyAddress: "",
        landTitle: "",
        plotNumber: "",
        size: "",
        propertyUse: "",
        estimatedValue: "",
        urgency: "normal",
      });
      setValuationInfo({
        valuationPurpose: "",
        specialRequirements: "",
        preferredInspectionDate: "",
        notes: "",
      });
      setUploadedDocuments({});
      setUploadStatus({});

      setSubmitted(false);
    }, 3000);
  };

  const total = jobs?.length || 0;
  const pending = jobs?.filter(j => j.status !== "complete").length || 0;
  const completed = jobs?.filter(j => j.status === "complete").length || 0;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4,
      px: 2
    }}>
      <Box maxWidth={1200} mx="auto">
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700} color="primary">
          Client Onboarding & Document Management
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
          Comprehensive client registration with required document uploads
        </Typography>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, justifyContent: 'center' }}>
        <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
          <CardContent>
            <AssignmentIcon color="primary" />
              <Typography variant="h6">Total Clients</Typography>
              <Typography variant="h5">{total}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, bgcolor: '#fffde7' }}>
          <CardContent>
            <PersonIcon color="secondary" />
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h5">{pending}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, bgcolor: '#e8f5e9' }}>
          <CardContent>
            <CheckCircleIcon color="success" />
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h5">{completed}</Typography>
          </CardContent>
        </Card>
        </Box>

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Client successfully onboarded! Notification sent to all team members.
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
            {/* Client Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" mb={2}>Client Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <TextField
                    select
                    label="Client Type"
                    name="clientType"
                    value={clientInfo.clientType}
                    onChange={handleClientInfoChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </TextField>
                </Box>
                <Box>
                  <TextField
                    label="Full Name"
                    name="clientName"
                    value={clientInfo.clientName}
                    onChange={handleClientInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Contact Number"
                    name="contactNumber"
                    value={clientInfo.contactNumber}
                    onChange={handleClientInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={handleClientInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                {clientInfo.clientType === "individual" ? (
                  <Box>
                    <TextField
                      label="ID Number"
                      name="idNumber"
                      value={clientInfo.idNumber}
                      onChange={handleClientInfoChange}
                      fullWidth
                      required
                    />
                  </Box>
                ) : (
                  <>
                    <Box>
                      <TextField
                        label="Company Name"
                        name="companyName"
                        value={clientInfo.companyName}
                        onChange={handleClientInfoChange}
                        fullWidth
                        required
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Company Registration Number"
                        name="companyRegNumber"
                        value={clientInfo.companyRegNumber}
                        onChange={handleClientInfoChange}
                        fullWidth
                        required
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            {/* Property Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" mb={2}>Property Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
            <TextField
              select
              label="Asset Type"
                    name="assetType"
                    value={propertyInfo.assetType}
                    onChange={handlePropertyInfoChange}
                    fullWidth
              required
            >
              <MenuItem value="land">Land</MenuItem>
                    <MenuItem value="building">Building</MenuItem>
                    <MenuItem value="vehicle">Vehicle</MenuItem>
                    <MenuItem value="equipment">Equipment</MenuItem>
                  </TextField>
                </Box>
                <Box>
                  <TextField
                    select
                    label="Urgency Level"
                    name="urgency"
                    value={propertyInfo.urgency}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
            </TextField>
                </Box>
                <Box>
                  <TextField
                    label="Property Location"
                    name="propertyLocation"
                    value={propertyInfo.propertyLocation}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Land Title"
                    name="landTitle"
                    value={propertyInfo.landTitle}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Plot Number"
                    name="plotNumber"
                    value={propertyInfo.plotNumber}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Size (acres)"
                    name="size"
                    value={propertyInfo.size}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Property Use"
                    name="propertyUse"
                    value={propertyInfo.propertyUse}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    label="Estimated Value"
                    name="estimatedValue"
                    value={propertyInfo.estimatedValue}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <TextField
                    label="Property Address"
                    name="propertyAddress"
                    value={propertyInfo.propertyAddress}
                    onChange={handlePropertyInfoChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                </Box>
              </Box>
            </Box>

            {/* Valuation Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" mb={2}>Valuation Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <TextField
                    label="Purpose of Valuation"
                    name="valuationPurpose"
                    value={valuationInfo.valuationPurpose}
                    onChange={handleValuationInfoChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                </Box>
                <Box>
              <TextField
                    label="Preferred Inspection Date"
                    name="preferredInspectionDate"
                    type="date"
                    value={valuationInfo.preferredInspectionDate}
                    onChange={handleValuationInfoChange}
                    fullWidth
                required
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <TextField
                    label="Special Requirements"
                    name="specialRequirements"
                    value={valuationInfo.specialRequirements}
                    onChange={handleValuationInfoChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <TextField
                    label="Additional Notes"
                    name="notes"
                    value={valuationInfo.notes}
                    onChange={handleValuationInfoChange}
                fullWidth
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>
            </Box>

            {/* Document Uploads */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" mb={2}>Required Documents</Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Please upload all required documents. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </Alert>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {requiredDocuments.map(doc => (
                  <Box key={doc.id}>
                    <Card sx={{ p: 2, border: uploadedDocuments[doc.id] ? '2px solid #4caf50' : '2px solid #e0e0e0' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {doc.label}
                          {doc.required && <span style={{ color: 'red' }}> *</span>}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            size="small"
                          >
                            Upload File
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(doc.id, e.target.files[0]);
                                }
                              }}
                            />
                          </Button>
                          {uploadedDocuments[doc.id] && (
                            <Chip 
                              label={uploadedDocuments[doc.id]?.name} 
                              color="success" 
                              size="small"
                              onDelete={() => {
                                setUploadedDocuments({ ...uploadedDocuments, [doc.id]: null });
                                setUploadStatus({ ...uploadStatus, [doc.id]: false });
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitted}
                sx={{ 
                  background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5
                }}
              >
                {submitted ? 'Submitting...' : 'Submit Client'}
              </Button>
            </Box>
        </form>
      </Paper>
      </Box>
    </Box>
  );
} 