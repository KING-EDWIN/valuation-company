"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper, Stack, MenuItem, Card, CardContent } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function InstructionPage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "client") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    contactNumber: "",
    email: "",
    assetType: "land",
    assetLocation: "",
    assetDescription: "",
    valuationPurpose: "",
    urgency: "normal",
    specialRequirements: "",
    preferredInspectionDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setForm({
        clientName: "",
        contactNumber: "",
        email: "",
        assetType: "land",
        assetLocation: "",
        assetDescription: "",
        valuationPurpose: "",
        urgency: "normal",
        specialRequirements: "",
        preferredInspectionDate: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  if (!user || user.role !== "client") return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4,
      px: 2
    }}>
      <Box maxWidth={800} mx="auto">
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700} color="primary">
          Submit Valuation Instruction
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
          Please provide all necessary details for your valuation request
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Instruction submitted successfully! Our team will contact you within 24 hours.
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Client Information */}
              <Box>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      Client Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                      <Box>
                        <TextField 
                          label="Full Name" 
                          name="clientName" 
                          value={form.clientName} 
                          onChange={handleChange} 
                          fullWidth 
                          required 
                        />
                      </Box>
                      <Box>
                        <TextField 
                          label="Contact Number" 
                          name="contactNumber" 
                          value={form.contactNumber} 
                          onChange={handleChange} 
                          fullWidth 
                          required 
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                        <TextField 
                          label="Email Address" 
                          name="email" 
                          type="email"
                          value={form.email} 
                          onChange={handleChange} 
                          fullWidth 
                          required 
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Asset Information */}
              <Grid xs={12}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon color="primary" />
                      Asset Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={12} md={6}>
                        <TextField
                          select
                          label="Asset Type"
                          name="assetType"
                          value={form.assetType}
                          onChange={handleChange}
                          fullWidth
                          required
                        >
                          <MenuItem value="land">Land/Property</MenuItem>
                          <MenuItem value="vehicle">Vehicle</MenuItem>
                          <MenuItem value="equipment">Equipment/Machinery</MenuItem>
                          <MenuItem value="business">Business Valuation</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <TextField
                          select
                          label="Urgency Level"
                          name="urgency"
                          value={form.urgency}
                          onChange={handleChange}
                          fullWidth
                          required
                        >
                          <MenuItem value="low">Low Priority</MenuItem>
                          <MenuItem value="normal">Normal Priority</MenuItem>
                          <MenuItem value="high">High Priority</MenuItem>
                          <MenuItem value="urgent">Urgent</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid xs={12}>
                        <TextField 
                          label="Asset Location" 
                          name="assetLocation" 
                          value={form.assetLocation} 
                          onChange={handleChange} 
                          fullWidth 
                          required 
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField 
                          label="Asset Description" 
                          name="assetDescription" 
                          value={form.assetDescription} 
                          onChange={handleChange} 
                          fullWidth 
                          multiline 
                          rows={3}
                          required 
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Valuation Details */}
              <Grid xs={12}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon color="primary" />
                      Valuation Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={12}>
                        <TextField
                          select
                          label="Purpose of Valuation"
                          name="valuationPurpose"
                          value={form.valuationPurpose}
                          onChange={handleChange}
                          fullWidth
                          required
                        >
                          <MenuItem value="mortgage">Mortgage/Security</MenuItem>
                          <MenuItem value="insurance">Insurance</MenuItem>
                          <MenuItem value="sale">Sale/Purchase</MenuItem>
                          <MenuItem value="tax">Tax Assessment</MenuItem>
                          <MenuItem value="legal">Legal Proceedings</MenuItem>
                          <MenuItem value="investment">Investment Decision</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <TextField 
                          label="Preferred Inspection Date" 
                          name="preferredInspectionDate" 
                          type="date"
                          value={form.preferredInspectionDate} 
                          onChange={handleChange} 
                          fullWidth 
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField 
                          label="Special Requirements or Notes" 
                          name="specialRequirements" 
                          value={form.specialRequirements} 
                          onChange={handleChange} 
                          fullWidth 
                          multiline 
                          rows={3}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2
                    }}
                  >
                    Submit Instruction
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => router.push('/dashboard')}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
        </form>
      </Paper>
      </Box>
    </Box>
  );
} 