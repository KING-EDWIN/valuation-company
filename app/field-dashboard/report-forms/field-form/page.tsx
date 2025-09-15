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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Assessment as ReportIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface FieldFormData {
  asset_details: {
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
  };
  valuation_findings: {
    asset_conditions: Array<{
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
  };
  valuation_methodology: {
    method_summary: string;
    tools_used: string[];
    data_sources: string[];
  };
}

export default function FieldReportForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FieldFormData>({
    asset_details: {
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
      }]
    },
    valuation_findings: {
      asset_conditions: [{
        asset_name: '',
        operational_status: '',
        physical_condition: '',
        maintenance_notes: '',
        estimated_value: {
          market_value: null,
          forced_sale_value: null,
          currency: 'UGX'
        }
      }]
    },
    valuation_methodology: {
      method_summary: '',
      tools_used: [],
      data_sources: []
    }
  });

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const steps = [
    'Inspection Details',
    'Asset Information',
    'Valuation Findings',
    'Methodology'
  ];

  const handleInputChange = (section: string, field: string, value: any, subField?: string, index?: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== undefined) {
        if (subField) {
          newData[section as keyof FieldFormData][field][index][subField] = value;
        } else {
          newData[section as keyof FieldFormData][field][index] = value;
        }
      } else if (subField) {
        newData[section as keyof FieldFormData][field][subField] = value;
      } else {
        newData[section as keyof FieldFormData][field] = value;
      }
      return newData;
    });
  };

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      asset_details: {
        ...prev.asset_details,
        assets: [...prev.asset_details.assets, {
          asset_name: '',
          category: '',
          make_and_model: '',
          serial_number: '',
          year_of_manufacture: null
        }]
      }
    }));
  };

  const removeAsset = (index: number) => {
    setFormData(prev => ({
      ...prev,
      asset_details: {
        ...prev.asset_details,
        assets: prev.asset_details.assets.filter((_, i) => i !== index)
      }
    }));
  };

  const addAssetCondition = () => {
    setFormData(prev => ({
      ...prev,
      valuation_findings: {
        ...prev.valuation_findings,
        asset_conditions: [...prev.valuation_findings.asset_conditions, {
          asset_name: '',
          operational_status: '',
          physical_condition: '',
          maintenance_notes: '',
          estimated_value: {
            market_value: null,
            forced_sale_value: null,
            currency: 'UGX'
          }
        }]
      }
    }));
  };

  const removeAssetCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      valuation_findings: {
        ...prev.valuation_findings,
        asset_conditions: prev.valuation_findings.asset_conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving field form data:', formData);
      setSnackbar({ open: true, message: 'Field data saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving field data:', error);
      setSnackbar({ open: true, message: 'Failed to save field data', severity: 'error' });
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
          value={formData.asset_details.inspection_details.inspection_date}
          onChange={(e) => handleInputChange('asset_details', 'inspection_details', e.target.value, 'inspection_date')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.asset_details.inspection_details.inspection_accompanied_by.registered_owner_present}
              onChange={(e) => handleInputChange('asset_details', 'inspection_details', e.target.checked, 'inspection_accompanied_by', 0)}
            />
          }
          label="Registered Owner Present"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Accompanied By Name"
          value={formData.asset_details.inspection_details.inspection_accompanied_by.name}
          onChange={(e) => handleInputChange('asset_details', 'inspection_details', e.target.value, 'inspection_accompanied_by', 0)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Accompanied By Role"
          value={formData.asset_details.inspection_details.inspection_accompanied_by.role}
          onChange={(e) => handleInputChange('asset_details', 'inspection_details', e.target.value, 'inspection_accompanied_by', 0)}
        />
      </Grid>
    </Grid>
  );

  const renderAssetInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Asset Information</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addAsset}
            variant="outlined"
            size="small"
          >
            Add Asset
          </Button>
        </Box>
      </Grid>
      {formData.asset_details.assets.map((asset, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Asset {index + 1}</Typography>
              <IconButton
                onClick={() => removeAsset(index)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={asset.asset_name}
                  onChange={(e) => handleInputChange('asset_details', 'assets', e.target.value, 'asset_name', index)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={asset.category}
                    onChange={(e) => handleInputChange('asset_details', 'assets', e.target.value, 'category', index)}
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
                  onChange={(e) => handleInputChange('asset_details', 'assets', e.target.value, 'make_and_model', index)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={asset.serial_number}
                  onChange={(e) => handleInputChange('asset_details', 'assets', e.target.value, 'serial_number', index)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year of Manufacture"
                  type="number"
                  value={asset.year_of_manufacture || ''}
                  onChange={(e) => handleInputChange('asset_details', 'assets', parseInt(e.target.value) || null, 'year_of_manufacture', index)}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Valuation Findings</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addAssetCondition}
            variant="outlined"
            size="small"
          >
            Add Condition
          </Button>
        </Box>
      </Grid>
      {formData.valuation_findings.asset_conditions.map((condition, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Asset Condition {index + 1}</Typography>
              <IconButton
                onClick={() => removeAssetCondition(index)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={condition.asset_name}
                  onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', e.target.value, 'asset_name', index)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Operational Status</InputLabel>
                  <Select
                    value={condition.operational_status}
                    onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', e.target.value, 'operational_status', index)}
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
                    value={condition.physical_condition}
                    onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', e.target.value, 'physical_condition', index)}
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
                  value={condition.maintenance_notes}
                  onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', e.target.value, 'maintenance_notes', index)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Market Value (UGX)"
                  type="number"
                  value={condition.estimated_value.market_value || ''}
                  onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', parseInt(e.target.value) || null, 'estimated_value', index)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Forced Sale Value (UGX)"
                  type="number"
                  value={condition.estimated_value.forced_sale_value || ''}
                  onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', parseInt(e.target.value) || null, 'estimated_value', index)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={condition.estimated_value.currency}
                    onChange={(e) => handleInputChange('valuation_findings', 'asset_conditions', e.target.value, 'estimated_value', index)}
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

  const renderMethodology = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Valuation Methodology</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Method Summary"
          multiline
          rows={4}
          value={formData.valuation_methodology.method_summary}
          onChange={(e) => handleInputChange('valuation_methodology', 'method_summary', e.target.value)}
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
          onChange={(e) => handleInputChange('valuation_methodology', 'tools_used', e.target.value.split(', '))}
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
          onChange={(e) => handleInputChange('valuation_methodology', 'data_sources', e.target.value.split(', '))}
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return renderInspectionDetails();
      case 1: return renderAssetInformation();
      case 2: return renderValuationFindings();
      case 3: return renderMethodology();
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
          Field Worker Report Form
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
                    router.push('/field-dashboard');
                  }}
                >
                  Complete Field Section
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


