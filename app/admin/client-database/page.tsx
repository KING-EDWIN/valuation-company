'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useJobs, Job } from '../../../components/JobsContext';
import { useRouter } from 'next/navigation';

type ChipColor = 'warning' | 'info' | 'secondary' | 'success' | 'default';

export default function ClientDatabase() {
  const { jobs, updateJob, deleteJob } = useJobs();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.clientInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.assetDetails?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (job: Job) => {
    setSelectedJob({ ...job });
    setEditDialogOpen(true);
  };

  const handleView = (job: Job) => {
    setSelectedJob({ ...job });
    setViewDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedJob) {
      updateJob(selectedJob.id, selectedJob);
      setEditDialogOpen(false);
      setSelectedJob(null);
    }
  };

  const handleCancel = () => {
    setEditDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteJob(jobId);
    }
  };

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'pending fieldwork': return 'warning';
      case 'pending QA': return 'info';
      case 'pending MD approval': return 'secondary';
      case 'complete': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.push('/dashboard')} size="large">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Client Database
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage all clients and their information
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending fieldwork">Pending Fieldwork</MenuItem>
                  <MenuItem value="pending QA">Pending QA</MenuItem>
                  <MenuItem value="pending MD approval">Pending MD Approval</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                fullWidth
              >
                Advanced Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => router.push('/admin/add-client')}
              >
                Add Client
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {filteredJobs.length} Client{filteredJobs.length !== 1 ? 's' : ''} Found
          </Typography>
        </Box>

        {/* Clients Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Asset Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {job.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.clientInfo?.clientType || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.assetType} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {job.assetDetails?.location || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(job.valuationRequirements?.value, job.valuationRequirements?.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      size="small" 
                      color={getStatusColor(job.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(job)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Client">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(job)}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Client">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(job.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No clients found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or add a new client.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon color="primary" />
            <Typography variant="h6">
              Edit Client: {selectedJob?.clientName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                    Client Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <TextField
                  fullWidth
                  label="Client Name"
                  value={selectedJob.clientName || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { ...prev, clientName: e.target.value } : null)}
                  margin="normal"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Client Type</InputLabel>
                  <Select
                    value={selectedJob.clientInfo?.clientType || ''}
                    onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                      ...prev, 
                      clientInfo: { ...prev.clientInfo, clientType: e.target.value }
                    } : null)}
                    label="Client Type"
                  >
                    <MenuItem value="Financial Institution">Financial Institution</MenuItem>
                    <MenuItem value="Private Company">Private Company</MenuItem>
                    <MenuItem value="Microfinance Institution">Microfinance Institution</MenuItem>
                    <MenuItem value="Cooperative Society">Cooperative Society</MenuItem>
                    <MenuItem value="Investment Company">Investment Company</MenuItem>
                    <MenuItem value="Real Estate Company">Real Estate Company</MenuItem>
                    <MenuItem value="Individual">Individual</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={selectedJob.clientInfo?.contactNumber || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    clientInfo: { ...prev.clientInfo, contactNumber: e.target.value }
                  } : null)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedJob.clientInfo?.email || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    clientInfo: { ...prev.clientInfo, email: e.target.value }
                  } : null)}
                  margin="normal"
                />
                
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={selectedJob.clientInfo?.address || ''}
                    onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                      ...prev, 
                      clientInfo: { ...prev.clientInfo, address: e.target.value }
                    } : null)}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 3 }}>
                    Property Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <TextField
                  fullWidth
                  label="Location"
                  value={selectedJob.assetDetails?.location || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    assetDetails: { ...prev.assetDetails, location: e.target.value }
                  } : null)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Size"
                  value={selectedJob.assetDetails?.size || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    assetDetails: { ...prev.assetDetails, size: e.target.value }
                  } : null)}
                  margin="normal"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Asset Type</InputLabel>
                  <Select
                    value={selectedJob.assetType || ''}
                    onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { ...prev, assetType: e.target.value } : null)}
                    label="Asset Type"
                  >
                    <MenuItem value="Commercial Property">Commercial Property</MenuItem>
                    <MenuItem value="Residential Property">Residential Property</MenuItem>
                    <MenuItem value="Vacant Land">Vacant Land</MenuItem>
                    <MenuItem value="Institutional Property">Institutional Property</MenuItem>
                    <MenuItem value="Vehicle">Vehicle</MenuItem>
                    <MenuItem value="Equipment">Equipment</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Property Use"
                  value={selectedJob.assetDetails?.propertyUse || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    assetDetails: { ...prev.assetDetails, propertyUse: e.target.value }
                  } : null)}
                  margin="normal"
                />

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 3 }}>
                    Valuation Requirements
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <TextField
                  fullWidth
                  label="Purpose"
                  value={selectedJob.valuationRequirements?.purpose || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    valuationRequirements: { ...prev.valuationRequirements, purpose: e.target.value }
                  } : null)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={selectedJob.valuationRequirements?.value || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    valuationRequirements: { ...prev.valuationRequirements, value: parseFloat(e.target.value) || 0 }
                  } : null)}
                  margin="normal"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={selectedJob.valuationRequirements?.currency || 'UGX'}
                    onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                      ...prev, 
                      valuationRequirements: { ...prev.valuationRequirements, currency: e.target.value }
                    } : null)}
                    label="Currency"
                  >
                    <MenuItem value="UGX">UGX</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  value={selectedJob.valuationRequirements?.deadline || ''}
                  onChange={(e) => setSelectedJob((prev: Job | null) => prev ? { 
                    ...prev, 
                    valuationRequirements: { ...prev.valuationRequirements, deadline: e.target.value }
                  } : null)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VisibilityIcon color="primary" />
            <Typography variant="h6">
              Client Details: {selectedJob?.clientName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
                            <Box sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
              }}>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
                    Client Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Client Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.clientName}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Client Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.clientInfo?.clientType || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Contact Number</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.clientInfo?.contactNumber || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.clientInfo?.email || 'N/A'}</Typography>
                </Box>
                
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.clientInfo?.address || 'N/A'}</Typography>
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 3 }}>
                    Property Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Asset Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.assetType}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.assetDetails?.location || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Size</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.assetDetails?.size || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Property Use</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.assetDetails?.propertyUse || 'N/A'}</Typography>
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 3 }}>
                    Valuation Requirements
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Purpose</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.valuationRequirements?.purpose || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Value</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatCurrency(selectedJob.valuationRequirements?.value, selectedJob.valuationRequirements?.currency)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Deadline</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.valuationRequirements?.deadline || 'N/A'}</Typography>
                </Box>

                {selectedJob.fieldReportData && (
                  <>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mt: 3 }}>
                        Field Report Data
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Inspection Date</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.fieldReportData.inspectionDate}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Site Conditions</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.fieldReportData.siteConditions}</Typography>
                    </Box>
                    
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>{selectedJob.fieldReportData.notes}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setViewDialogOpen(false);
              handleEdit(selectedJob!);
            }}
          >
            Edit Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
