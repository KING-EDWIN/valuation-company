"use client";
import { useState } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert, Paper,
  Accordion, AccordionSummary, AccordionDetails, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress,
  Avatar, Rating, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LocationCityIcon from '@mui/icons-material/LocationCity';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`md-tabpanel-${index}`}
      aria-labelledby={`md-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MDDashboard() {
  const { user } = useUser();
  const { jobs, updateJob, getAllBanks } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mdApprovalDialogOpen, setMDApprovalDialogOpen] = useState(false);
  const [propertyHistoryDialogOpen, setPropertyHistoryDialogOpen] = useState(false);
  const [bankHistoryDialogOpen, setBankHistoryDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");

  // Filter jobs for MD
  const mdJobs = jobs.filter(job => job.status === "pending MD approval");
  const pending = mdJobs.filter(j => j.status === "pending MD approval").length;
  const completed = jobs.filter(j => j.status === "pending payment").length;

  // Get all banks
  const allBanks = getAllBanks();

  const handleMDApproval = (job: Job) => {
    setSelectedJob(job);
    setMDApprovalDialogOpen(true);
  };

  const handlePropertyHistory = (job: Job) => {
    setSelectedJob(job);
    setPropertyHistoryDialogOpen(true);
  };

  const handleBankHistory = (bankName: string) => {
    setSelectedBank(bankName);
    setBankHistoryDialogOpen(true);
  };

  const handleMDSubmit = (job: Job, approval: { overallApproved: boolean; notes: string }) => {
    const updatedJob = {
      ...job,
      status: approval.overallApproved ? "pending payment" as const : "pending QA" as const,
      mdApproval: approval.overallApproved,
      updatedAt: new Date().toISOString()
    };

    updateJob(job.id, updatedJob);

    // Send notification
    addNotification("admin", {
      title: "MD Review Complete",
      message: `MD review completed for ${job.clientName} - ${approval.overallApproved ? 'Approved for payment' : 'Returned to QA'}`,
      type: approval.overallApproved ? "success" : "warning",
      priority: "medium"
    });

    setMDApprovalDialogOpen(false);
    setSelectedJob(null);
  };

  if (!user || user.role !== "md") {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Access Denied - Managing Director Only
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
          background: 'linear-gradient(135deg, #e53935 0%, #f44336 100%)',
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
          
          {/* Logo and Company Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
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
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                bgcolor: 'rgba(255,255,255,0.3)', 
                borderRadius: 2,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem'
              }}>
                SP
              </Box>
            </Box>
            <Typography variant="h5" fontWeight={600} color="white">
              Stanfield Property Partners
            </Typography>
          </Box>
          
          <Typography variant="h4" fontWeight={700} mb={2}>
            Managing Director Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Final Approval & Strategic Oversight
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, justifyContent: 'center' }}>
            <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
              <CardContent>
              <AssignmentIcon color="primary" />
              <Typography variant="h6">Total MD Jobs</Typography>
              <Typography variant="h5">{jobs.length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 180, bgcolor: '#fffde7' }}>
              <CardContent>
              <WarningIcon color="warning" />
              <Typography variant="h6">Pending Approval</Typography>
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
            Bank Relationships & Strategic Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {allBanks.map((bankName) => {
              const stats = { totalJobs: 0, totalAmount: 0, lastWorkDate: "" }; // Mock stats
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

        {/* MD Approval Jobs Section */}
        <Box sx={{ mb: 4 }}>
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Reports Pending MD Approval
        </Typography>
        
          {mdJobs.length === 0 ? (
            <Alert severity="info">
              No reports pending MD approval. All QA-reviewed reports have been processed.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {mdJobs.map((job) => (
                <Card key={job.id} sx={{ 
                  p: 3, 
                  borderLeft: `6px solid #e53935`,
                  '&:hover': { boxShadow: 4 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                    bgcolor: '#e53935', 
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
                      <strong>QA Status:</strong> {job.qaChecklist?.completed ? '✅ QA Completed' : '❌ QA Pending'}
                    </Typography>
                    {job.qaNotes && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>QA Notes:</strong> {job.qaNotes}
                      </Typography>
                    )}
                  </Box>

                  {/* Property History Alert */}
                  {job.assetDetails.previousWorkHistory && job.assetDetails.previousWorkHistory.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      ⚠️ This property has been worked on before! 
                      Previous work: {job.assetDetails.previousWorkHistory.join(', ')}
                    </Alert>
                  )}

                  {/* Neighborhood History */}
                  {job.assetDetails.neighborhood && job.assetDetails.neighborhood.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Neighborhood:</strong> {job.assetDetails.neighborhood.join(', ')}
                      </Typography>
                      <Chip 
                        label={`${job.assetDetails.neighborhood.join(', ')} - ${job.assetDetails.location}`}
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
                      startIcon={<GavelIcon />}
                      onClick={() => handleMDApproval(job)}
                      size="small"
                    >
                      Review & Approve
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

        {/* MD Approval Dialog */}
        <Dialog 
          open={mdApprovalDialogOpen} 
          onClose={() => setMDApprovalDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GavelIcon color="primary" />
              MD Review: {selectedJob?.clientName}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {selectedJob && (
              <MDApprovalForm 
                job={selectedJob} 
                onSubmit={(approval) => handleMDSubmit(selectedJob, approval)}
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

        {/* Business Intelligence Section */}
        <BusinessIntelligenceTabs />
      </Box>
    </Box>
  );
}

// MD Approval Form Component
function MDApprovalForm({ job, onSubmit }: { job: Job; onSubmit: (approval: { overallApproved: boolean; notes: string }) => void }) {
  const [approval, setApproval] = useState({
    strategicValue: "high" as "low" | "medium" | "high" | "critical",
    riskAssessment: "low" as "low" | "medium" | "high" | "critical",
    marketConditions: "favorable" as "favorable" | "neutral" | "challenging",
    overallApproved: false,
    notes: ""
  });

  const handleSubmit = () => {
    onSubmit(approval);
  };

  return (
    <Box>
      <Typography variant="h6" mb={3}>Managing Director Review & Approval</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>Strategic Assessment</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Strategic Value</InputLabel>
          <Select
            value={approval.strategicValue}
            onChange={(e) => setApproval(prev => ({ ...prev, strategicValue: e.target.value as "low" | "medium" | "high" | "critical" }))}
            label="Strategic Value"
          >
            <MenuItem value="low">Low - Minimal strategic impact</MenuItem>
            <MenuItem value="medium">Medium - Moderate strategic value</MenuItem>
            <MenuItem value="high">High - Significant strategic value</MenuItem>
            <MenuItem value="critical">Critical - Essential for business</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Risk Assessment</InputLabel>
          <Select
            value={approval.riskAssessment}
            onChange={(e) => setApproval(prev => ({ ...prev, riskAssessment: e.target.value as "low" | "medium" | "high" | "critical" }))}
            label="Risk Assessment"
          >
            <MenuItem value="low">Low - Minimal risk exposure</MenuItem>
            <MenuItem value="medium">Medium - Moderate risk level</MenuItem>
            <MenuItem value="high">High - Significant risk factors</MenuItem>
            <MenuItem value="critical">Critical - High risk, requires attention</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Market Conditions</InputLabel>
          <Select
            value={approval.marketConditions}
            onChange={(e) => setApproval(prev => ({ ...prev, marketConditions: e.target.value as "favorable" | "neutral" | "challenging" }))}
            label="Market Conditions"
          >
            <MenuItem value="favorable">Favorable - Strong market conditions</MenuItem>
            <MenuItem value="neutral">Neutral - Stable market environment</MenuItem>
            <MenuItem value="challenging">Challenging - Difficult market conditions</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>QA Review Summary</Typography>
        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="body2" gutterBottom>
            <strong>QA Decision:</strong> {job.qaChecklist?.completed ? '✅ Approved' : '❌ Rejected'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Report Quality:</strong> {job.qaChecklist?.completed ? 'Completed' : 'Not assessed'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>QA Notes:</strong> {job.qaNotes || 'No notes provided'}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" mb={2}>MD Decision & Notes</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={approval.notes}
          onChange={(e) => setApproval(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Enter strategic considerations, risk factors, market analysis, or any other MD-level observations..."
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Final Decision</InputLabel>
          <Select
            value={approval.overallApproved ? "approved" : "rejected"}
            onChange={(e) => setApproval(prev => ({ ...prev, overallApproved: e.target.value === "approved" }))}
            label="Final Decision"
          >
            <MenuItem value="approved">✅ Approved - Forward to Accounts</MenuItem>
            <MenuItem value="rejected">❌ Rejected - Return to QA</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={() => setApproval(prev => ({ ...prev, overallApproved: false }))}
        >
          Reject & Return
        </Button>
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSubmit}
        >
          Submit MD Decision
                  </Button>
      </Box>
    </Box>
  );
}

// Property History View Component
function PropertyHistoryView({ job }: { job: Job }) {
  // Mock data since these methods don't exist in JobsContext
  const propertyJobs: Job[] = [];
  const neighborhoodJobs: Job[] = [];

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
              {propertyJobs.filter(j => j.id !== job.id).map((historyJob) => (
                <ListItem key={historyJob.id}>
                  <ListItemIcon>
                    <HistoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${historyJob.clientName} - ${historyJob.bankInfo.bankName}`}
                    secondary={`Date: ${new Date(historyJob.createdAt).toLocaleDateString()} | Value: KES ${historyJob.assetDetails.size || 'N/A'} | Status: ${historyJob.status}`}
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
                      secondary={`Location: ${neighborJob.assetDetails.location} | Date: ${new Date(neighborJob.createdAt).toLocaleDateString()} | Value: KES ${neighborJob.valuationRequirements?.value || 'N/A'}`}
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

// Business Intelligence Tabs
function BusinessIntelligenceTabs() {
  const [tabValue, setTabValue] = useState(0);
  const { jobs } = useJobs();

  // Mock data for business intelligence
  const completedJobs = jobs.filter(job => job.status === "pending payment").length;
  const businessMetrics = { totalRevenue: 250000000, totalJobs: jobs.length, completedJobs, successRate: 85.5 };
  const staffPerformance = [
    { name: "John Admin", role: "Admin", jobsCompleted: 45, avgTime: "2.3 days", rating: 4.8, mistakes: 2 },
    { name: "Sarah Field", role: "Field Team", jobsCompleted: 38, avgTime: "1.8 days", rating: 4.9, mistakes: 1 }
  ];
  const clientAnalytics = [
    { name: "ABC Bank", totalJobs: 15, totalValue: 85000000, reliability: 95, lastJob: "2024-01-15" },
    { name: "XYZ Bank", totalJobs: 12, totalValue: 72000000, reliability: 92, lastJob: "2024-01-20" }
  ];
  const locationPerformance = [
    { name: "Nakasero", totalJobs: 8, totalValue: 45000000, avgTime: 2.1, successRate: 87.5 },
    { name: "Kololo", totalJobs: 6, totalValue: 38000000, avgTime: 1.9, successRate: 83.3 }
  ];
  const qualityMetrics = { qaJobs: jobs.filter(j => j.status === "pending QA").length, returnedJobs: 2, avgQAReviewTime: "1.5 days", qualityScore: 92.3 };
  const financialOverview = { 
    monthlyRevenue: [12500000, 13800000, 14200000, 15600000, 14800000, 16200000, 17500000, 18900000, 20100000, 19800000, 21500000, 22800000],
    monthlyExpenses: [9800000, 10200000, 10800000, 11500000, 11200000, 11800000, 12500000, 13200000, 13800000, 13500000, 14200000, 14800000],
    profitMargins: [21.6, 26.1, 23.9, 26.3, 24.3, 27.2, 28.6, 30.2, 31.3, 31.8, 34.0, 35.1]
  };

  return (
    <Card sx={{ mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Business Overview" icon={<AnalyticsIcon />} />
          <Tab label="Staff Performance" icon={<PeopleIcon />} />
          <Tab label="Client Analytics" icon={<BusinessIcon />} />
          <Tab label="Location Performance" icon={<LocationCityIcon />} />
          <Tab label="Quality Metrics" icon={<AssessmentIcon />} />
          <Tab label="Financial Overview" icon={<AttachMoneyIcon />} />
        </Tabs>
      </Box>

      {/* Business Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Business Performance Overview
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>UGX {businessMetrics.totalRevenue.toLocaleString()}</Typography>
              <Typography variant="h6">Total Revenue</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{businessMetrics.totalJobs}</Typography>
              <Typography variant="h6">Total Jobs</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{businessMetrics.completedJobs}</Typography>
              <Typography variant="h6">Completed Jobs</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{businessMetrics.successRate.toFixed(1)}%</Typography>
              <Typography variant="h6">Success Rate</Typography>
            </CardContent>
          </Card>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">Business Insights</Typography>
          <Typography variant="body2">
            Your business is performing at {businessMetrics.successRate.toFixed(1)}% success rate with UGX {businessMetrics.totalRevenue.toLocaleString()} in total revenue.
            {businessMetrics.successRate > 80 ? ' Excellent performance!' : businessMetrics.successRate > 60 ? ' Good performance with room for improvement.' : ' Performance needs attention.'}
          </Typography>
        </Alert>
      </TabPanel>

      {/* Staff Performance Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Staff Performance Analysis
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Jobs Completed</TableCell>
                <TableCell>Avg Time</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Mistakes</TableCell>
                <TableCell>Performance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffPerformance.map((staff) => (
                <TableRow key={staff.name}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: staff.rating >= 4.5 ? 'success.main' : staff.rating >= 4.0 ? 'warning.main' : 'error.main' }}>
                        {staff.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>{staff.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={staff.role} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{staff.jobsCompleted}</TableCell>
                  <TableCell>{staff.avgTime}</TableCell>
                  <TableCell>
                    <Rating value={staff.rating} precision={0.1} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.mistakes} 
                      size="small" 
                      color={staff.mistakes <= 1 ? 'success' : staff.mistakes <= 3 ? 'warning' : 'error'} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={staff.rating * 20} 
                        size={24}
                        color={staff.rating >= 4.5 ? 'success' : staff.rating >= 4.0 ? 'warning' : 'error'}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {staff.rating >= 4.5 ? 'Excellent' : staff.rating >= 4.0 ? 'Good' : 'Needs Improvement'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="h6">Performance Insights</Typography>
          <Typography variant="body2">
            Staff with ratings below 4.5 may need additional training or support. Consider reviewing processes for staff with high mistake counts.
          </Typography>
        </Alert>
      </TabPanel>

      {/* Client Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Client Behavior & Reliability Analysis
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Total Jobs</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Reliability Score</TableCell>
                <TableCell>Last Job</TableCell>
                <TableCell>Client Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientAnalytics.slice(0, 10).map((client) => (
                <TableRow key={client.name}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{client.name}</Typography>
                  </TableCell>
                  <TableCell>{client.totalJobs}</TableCell>
                  <TableCell>UGX {client.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={client.reliability} 
                        sx={{ width: 60, height: 8 }}
                        color={client.reliability >= 80 ? 'success' : client.reliability >= 60 ? 'warning' : 'error'}
                      />
                      <Typography variant="body2">{client.reliability}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(client.lastJob).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={client.reliability >= 80 ? 'Premium' : client.reliability >= 60 ? 'Regular' : 'At Risk'} 
                      size="small" 
                      color={client.reliability >= 80 ? 'success' : client.reliability >= 60 ? 'warning' : 'error'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6">Client Insights</Typography>
          <Typography variant="body2">
            Focus on maintaining relationships with premium clients (80%+ reliability) and developing strategies for at-risk clients.
          </Typography>
        </Alert>
      </TabPanel>

      {/* Location Performance Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Geographic Performance Analysis
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          {locationPerformance.slice(0, 6).map((location) => (
            <Card key={location.name}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {location.name}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Jobs</Typography>
                    <Typography variant="h6" fontWeight={600}>{location.totalJobs}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Value</Typography>
                    <Typography variant="h6" fontWeight={600}>UGX {location.totalValue.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6">Location Insights</Typography>
          <Typography variant="body2">
            High-value locations may indicate market opportunities. Consider expanding operations in areas with strong performance.
          </Typography>
        </Alert>
      </TabPanel>

      {/* Quality Metrics Tab */}
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Quality Assurance Performance
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{qualityMetrics.qaJobs}</Typography>
              <Typography variant="h6">QA Reviewed Jobs</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{qualityMetrics.returnedJobs}</Typography>
              <Typography variant="h6">Returned to QA</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>{qualityMetrics.qualityScore.toFixed(1)}%</Typography>
              <Typography variant="h6">Quality Score</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>QA Review Time</Typography>
              <Typography variant="h4" color="primary">{qualityMetrics.avgQAReviewTime}</Typography>
              <Typography variant="body2" color="text.secondary">Average time for QA review</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Quality Trend</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {qualityMetrics.qualityScore > 90 ? (
                  <TrendingUpIcon color="success" />
                ) : qualityMetrics.qualityScore > 80 ? (
                  <TrendingUpIcon color="warning" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography variant="h6" color={qualityMetrics.qualityScore > 90 ? 'success.main' : qualityMetrics.qualityScore > 80 ? 'warning.main' : 'error.main'}>
                  {qualityMetrics.qualityScore > 90 ? 'Excellent' : qualityMetrics.qualityScore > 80 ? 'Good' : 'Needs Attention'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Alert severity={qualityMetrics.qualityScore > 90 ? 'success' : qualityMetrics.qualityScore > 80 ? 'info' : 'warning'} sx={{ mt: 3 }}>
          <Typography variant="h6">Quality Insights</Typography>
          <Typography variant="body2">
            {qualityMetrics.qualityScore > 90 ? 'Outstanding quality performance! Your QA team is delivering excellent results.' : 
             qualityMetrics.qualityScore > 80 ? 'Good quality performance with room for improvement.' : 
             'Quality performance needs immediate attention. Consider reviewing QA processes and staff training.'}
          </Typography>
        </Alert>
      </TabPanel>

      {/* Financial Overview Tab */}
      <TabPanel value={tabValue} index={5}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Financial Performance & Trends
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Monthly Revenue Trend</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="h6" color="success.main">
                  +{((financialOverview.monthlyRevenue[11] - financialOverview.monthlyRevenue[0]) / financialOverview.monthlyRevenue[0] * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">Year-over-year growth</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                UGX {financialOverview.monthlyRevenue[11].toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Latest month revenue</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Profit Margin Trend</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {financialOverview.profitMargins[11] > financialOverview.profitMargins[0] ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography variant="h6" color={financialOverview.profitMargins[11] > financialOverview.profitMargins[0] ? 'success.main' : 'error.main'}>
                  {financialOverview.profitMargins[11].toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">Current profit margin</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                UGX {(financialOverview.monthlyRevenue[11] - financialOverview.monthlyExpenses[11]).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Latest month profit</Typography>
            </CardContent>
          </Card>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6">Financial Insights</Typography>
          <Typography variant="body2">
            Your business shows strong revenue growth with {financialOverview.profitMargins[11].toFixed(1)}% profit margin. 
            {financialOverview.profitMargins[11] > 25 ? ' Excellent profitability!' : ' Consider reviewing cost structures for improved margins.'}
          </Typography>
        </Alert>
      </TabPanel>
    </Card>
  );
}