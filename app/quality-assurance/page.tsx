"use client";
import { useState } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert,
  List, ListItem, ListItemText, ListItemIcon, Checkbox,
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { useJobs, Job } from "../../components/JobsContext";
import { useUser } from "../../components/UserContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function QualityAssurance() {
  const { user } = useUser();
  const { jobs, updateJob, getAllBanks, getBankStatistics } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [qaDialogOpen, setQADialogOpen] = useState(false);
  const [propertyHistoryDialogOpen, setPropertyHistoryDialogOpen] = useState(false);
  const [bankHistoryDialogOpen, setBankHistoryDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  // Filter jobs for QA
  const qaJobs = jobs.filter(job => job.status === "pending QA");
  const total = qaJobs.length;
  const pending = qaJobs.filter(j => j.status === "pending QA").length;
  const completed = jobs.filter(j => j.status === "pending MD approval").length;

  // Get all banks
  const allBanks = getAllBanks();

  const handleQAReview = (job: Job) => {
    setSelectedJob(job);
    setQADialogOpen(true);
  };

  const handlePropertyHistory = (job: Job) => {
    setSelectedJob(job);
    setPropertyHistoryDialogOpen(true);
  };

  const handleBankHistory = (bankName: string) => {
    setSelectedBank(bankName);
    setBankHistoryDialogOpen(true);
  };

  const handleQASubmit = (job: Job, checklist: { overallApproved: boolean; notes: string }) => {
    const updatedJob = {
      ...job,
      status: checklist.overallApproved ? "pending MD approval" as const : "pending fieldwork" as const,
      qaChecklist: {
        completed: true,
        items: ["Document Verification", "Field Report Review", "Value Assessment", "Compliance Check"],
        notes: checklist.notes
      },
      qaNotes: checklist.notes,
      updatedAt: new Date().toISOString()
    };

    updateJob(job.id, updatedJob);

    // Send notification
    addNotification("admin", {
      title: "QA Review Complete",
      message: `QA review completed for ${job.clientName} - ${checklist.overallApproved ? 'Approved' : 'Returned for corrections'}`,
      type: checklist.overallApproved ? "success" : "warning",
      priority: "medium"
    });

    setQADialogOpen(false);
    setSelectedJob(null);
  };

  if (!user || user.role !== "qa_officer") {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Access Denied - QA Officer Only
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4,
      px: 2
    }}>
      <Box maxWidth={1400} mx="auto">
        {/* Dashboard Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push('/dashboard')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            ← Return to Dashboard
          </Button>
          <Typography variant="h4" fontWeight={700} mb={2}>
            Quality Assurance Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Comprehensive Report Review & Quality Control
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, justifyContent: 'center' }}>
          <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <AssignmentIcon color="primary" />
              <Typography variant="h6">Total QA Jobs</Typography>
              <Typography variant="h5">{total}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 180, bgcolor: '#fffde7' }}>
            <CardContent>
              <WarningIcon color="warning" />
              <Typography variant="h6">Pending Review</Typography>
              <Typography variant="h5">{pending}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 180, bgcolor: '#e8f5e9' }}>
            <CardContent>
              <CheckCircleIcon color="success" />
              <Typography variant="h6">Approved</Typography>
              <Typography variant="h5">{completed}</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Bank History Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Bank Work History & Relationships
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {allBanks.map((bankName) => {
              const stats = getBankStatistics();
              return (
                <Card key={bankName} sx={{ 
                  p: 3, 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  transition: 'all 0.3s ease'
                }} onClick={() => handleBankHistory(bankName)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <BusinessIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        {bankName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Total Jobs</Typography>
                        <Typography variant="h6">{stats.totalJobs}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Total Value</Typography>
                        <Typography variant="h6">KES {stats.totalAmount}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Last Work: {new Date(stats.lastWorkDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* QA Jobs Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Reports Pending QA Review
          </Typography>
          
          {qaJobs.length === 0 ? (
            <Alert severity="info">
              No reports pending QA review. All field reports have been processed.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {qaJobs.map((job) => (
                <Card key={job.id} sx={{ 
                  p: 3, 
                  borderLeft: `6px solid #ff9800`,
                  '&:hover': { boxShadow: 4 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      bgcolor: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mr: 2
                    }}>
                      {job.clientName?.charAt(0) || 'C'}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {job.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.assetType} - {job.assetDetails.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Bank:</strong> {job.bankInfo.bankName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Estimated Value:</strong> KES {job.valuationRequirements?.value || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Field Report:</strong> {job.fieldReportData ? 'Submitted' : 'No report submitted'}
                    </Typography>
                  </Box>

                  {/* Property History Alert */}
                  {job.assetDetails.previousWorkHistory && job.assetDetails.previousWorkHistory.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      ⚠️ This property has been worked on before! 
                      Previous work: {job.assetDetails.previousWorkHistory.join(', ')}
                    </Alert>
                  )}

                  {/* Neighborhood History */}
                  {job.assetDetails.neighborhood && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Neighborhood:</strong> {job.assetDetails.neighborhood}
                      </Typography>
                      <Chip 
                        label={`${job.assetDetails.neighborhood?.length || 0} neighborhoods identified`}
                        color="info"
                        size="small"
                        icon={<LocationOnIcon />}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AssessmentIcon />}
                      onClick={() => handleQAReview(job)}
                      size="small"
                    >
                      Review Report
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<HistoryIcon />}
                      onClick={() => handlePropertyHistory(job)}
                      size="small"
                    >
                      Property History
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* QA Review Dialog */}
        <Dialog 
          open={qaDialogOpen} 
          onClose={() => setQADialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssessmentIcon color="primary" />
              QA Review: {selectedJob?.clientName}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {selectedJob && (
              <QAReviewForm 
                onSubmit={(checklist) => handleQASubmit(selectedJob, checklist)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Property History Dialog */}
        <Dialog 
          open={propertyHistoryDialogOpen} 
          onClose={() => setPropertyHistoryDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HistoryIcon color="primary" />
              Property History: {selectedJob?.assetDetails.location}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {selectedJob && (
              <PropertyHistoryView job={selectedJob} />
            )}
          </DialogContent>
        </Dialog>

        {/* Bank History Dialog */}
        <Dialog 
          open={bankHistoryDialogOpen} 
          onClose={() => setBankHistoryDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon color="primary" />
              Bank History: {selectedBank}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <BankHistoryView bankName={selectedBank} />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

// QA Review Form Component
function QAReviewForm({ onSubmit }: { onSubmit: (checklist: { 
  documentsComplete: boolean; 
  fieldDataComplete: boolean; 
  photosAttached: boolean; 
  measurementsVerified: boolean; 
  complianceChecked: boolean; 
  reportQuality: "excellent" | "good" | "fair" | "poor"; 
  overallApproved: boolean; 
  notes: string 
}) => void }) {
  const [checklist, setChecklist] = useState({
    documentsComplete: false,
    fieldDataComplete: false,
    photosAttached: false,
    measurementsVerified: false,
    complianceChecked: false,
    reportQuality: "good" as "excellent" | "good" | "fair" | "poor",
    overallApproved: false,
    notes: ""
  });

  const handleSubmit = () => {
    onSubmit(checklist);
  };

  return (
    <Box>
      <Typography variant="h6" mb={3}>Quality Assurance Checklist</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>Document Review</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={checklist.documentsComplete}
                onChange={(e) => setChecklist(prev => ({ ...prev, documentsComplete: e.target.checked }))}
              />
            </ListItemIcon>
            <ListItemText 
              primary="All required documents uploaded and verified"
              secondary="Orthophoto, Topographic map, Area schedule, Title search, Occupancy permit"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={checklist.fieldDataComplete}
                onChange={(e) => setChecklist(prev => ({ ...prev, fieldDataComplete: e.target.checked }))}
              />
            </ListItemIcon>
            <ListItemText 
              primary="Field data complete and accurate"
              secondary="GPS coordinates, measurements, condition assessment"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={checklist.photosAttached}
                onChange={(e) => setChecklist(prev => ({ ...prev, photosAttached: e.target.checked }))}
              />
            </ListItemIcon>
            <ListItemText 
              primary="Inspection photos attached and clear"
              secondary="Property photos, boundary markers, access points"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={checklist.measurementsVerified}
                onChange={(e) => setChecklist(prev => ({ ...prev, measurementsVerified: e.target.checked }))}
              />
            </ListItemIcon>
            <ListItemText 
              primary="Measurements verified and consistent"
              secondary="Plot dimensions, building measurements, area calculations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={checklist.complianceChecked}
                onChange={(e) => setChecklist(prev => ({ ...prev, complianceChecked: e.target.checked }))}
              />
            </ListItemIcon>
            <ListItemText 
              primary="Regulatory compliance verified"
              secondary="Building codes, zoning regulations, environmental requirements"
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>Report Quality Assessment</Typography>
        <FormControl fullWidth>
          <InputLabel>Report Quality</InputLabel>
          <Select
            value={checklist.reportQuality}
            onChange={(e) => setChecklist(prev => ({ ...prev, reportQuality: e.target.value as "excellent" | "good" | "fair" | "poor" }))}
            label="Report Quality"
          >
            <MenuItem value="excellent">Excellent - Comprehensive and professional</MenuItem>
            <MenuItem value="good">Good - Meets all requirements</MenuItem>
            <MenuItem value="fair">Fair - Minor issues to address</MenuItem>
            <MenuItem value="poor">Poor - Significant issues, needs revision</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>Additional Notes</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={checklist.notes}
          onChange={(e) => setChecklist(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Enter any additional observations, recommendations, or issues found..."
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Overall Decision</InputLabel>
          <Select
            value={checklist.overallApproved ? "approved" : "rejected"}
            onChange={(e) => setChecklist(prev => ({ ...prev, overallApproved: e.target.value === "approved" }))}
            label="Overall Decision"
          >
            <MenuItem value="approved">✅ Approved - Forward to MD</MenuItem>
            <MenuItem value="rejected">❌ Rejected - Return for corrections</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={() => setChecklist(prev => ({ ...prev, overallApproved: false }))}
        >
          Reject & Return
        </Button>
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSubmit}
          disabled={!checklist.documentsComplete || !checklist.fieldDataComplete}
        >
          Submit QA Review
        </Button>
      </Box>
    </Box>
  );
}

// Property History View Component
function PropertyHistoryView({ job }: { job: Job }) {
  const { getJobsByProperty, getJobsByNeighborhood } = useJobs();
  
  const propertyJobs = getJobsByProperty(job.assetDetails.location, job.assetDetails.plotNo);
  const neighborhoodJobs = job.assetDetails.neighborhood ? getJobsByNeighborhood(job.assetDetails.neighborhood) : [];

  return (
    <Box>
      <Typography variant="h6" mb={3}>Property & Neighborhood History</Typography>
      
      {/* Current Property History */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Current Property History
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {propertyJobs.length > 1 ? (
            <List>
              {propertyJobs.filter((j: Job) => j.id !== job.id).map((historyJob: Job) => (
                <ListItem key={historyJob.id}>
                  <ListItemIcon>
                    <HistoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${historyJob.clientName} - ${historyJob.bankInfo.bankName}`}
                    secondary={`Date: ${new Date(historyJob.createdAt).toLocaleDateString()} | Value: KES ${historyJob.valuationRequirements?.value || 'N/A'} | Status: ${historyJob.status}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No previous work history for this specific property</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Neighborhood History */}
      {job.assetDetails.neighborhood && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Neighborhood History - {job.assetDetails.neighborhood}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {neighborhoodJobs.length > 1 ? (
              <List>
                {neighborhoodJobs.filter(j => j.id !== job.id).slice(0, 10).map((neighborJob) => (
                  <ListItem key={neighborJob.id}>
                    <ListItemIcon>
                      <LocationOnIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${neighborJob.clientName} - ${neighborJob.bankInfo.bankName}`}
                      secondary={`Location: ${neighborJob.assetDetails.location} | Date: ${new Date(neighborJob.createdAt).toLocaleDateString()} | Value: KES ${neighborJob.assetDetails.estimatedValue}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No previous work history in this neighborhood</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

// Bank History View Component
function BankHistoryView({ bankName }: { bankName: string }) {
  const { getJobsByBank } = useJobs();
  const bankJobs = getJobsByBank(bankName);

  return (
    <Box>
      <Typography variant="h6" mb={3}>Complete Work History for {bankName}</Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {bankJobs.map((job) => (
          <Card key={job.id} sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {job.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {job.assetType} - {job.assetDetails.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Value: KES {job.valuationRequirements?.value || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(job.createdAt).toLocaleDateString()}
              </Typography>
              <Chip 
                label={job.status} 
                color={job.status === "complete" ? "success" : "warning"}
                size="small"
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
} 