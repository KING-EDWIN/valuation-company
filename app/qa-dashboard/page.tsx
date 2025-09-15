"use client";
import { useState } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert,
  Accordion, AccordionSummary, AccordionDetails, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress,
  List, ListItem, ListItemIcon, ListItemText, FormControlLabel, Checkbox
} from "@mui/material";
import { useJobs, Job } from "../../components/JobsContext";
import { useUser } from "../../components/UserContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportIcon from '@mui/icons-material/Report';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DocumentIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import BlockIcon from '@mui/icons-material/Block';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

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
      id={`qa-tabpanel-${index}`}
      aria-labelledby={`qa-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function QADashboard() {
  const { user } = useUser();
  const { jobs, updateJob, getAllBanks } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [qaDialogOpen, setQADialogOpen] = useState(false);
  const [propertyHistoryDialogOpen, setPropertyHistoryDialogOpen] = useState(false);
  const [bankHistoryDialogOpen, setBankHistoryDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [revocationDialogOpen, setRevocationDialogOpen] = useState(false);
  const [revocationReason, setRevocationReason] = useState("");

  // Filter jobs for QA
  const qaJobs = jobs.filter(job => job.status === "pending QA");
  const total = qaJobs.length;
  const pending = qaJobs.filter(j => j.status === "pending QA").length;
  const completed = jobs.filter(j => j.status === "pending MD approval").length;
  
  // For QA officers, also show jobs they can review
  const allPendingQA = jobs.filter(j => j.status === "pending QA").length;
  const allAwaitingReview = jobs.filter(j => j.status === "pending QA").length;
  const allCompletedReviews = jobs.filter(j => j.status === "pending MD approval").length;
  const allActiveBanks = getAllBanks().length;

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

  const handleRevokeJob = (job: Job) => {
    setSelectedJob(job);
    setRevocationDialogOpen(true);
  };

  const confirmRevocation = () => {
    if (selectedJob && revocationReason) {
      const updatedJob = {
        ...selectedJob,
        status: "revoked" as const,
        revocationReason,
        updatedAt: new Date().toISOString()
      };

      updateJob(selectedJob.id, updatedJob);

      addNotification("admin", {
        title: "Job Revoked",
        message: `Job revoked for ${selectedJob.clientName} - Reason: ${revocationReason}`,
        type: "error",
        priority: "high"
      });

      setRevocationDialogOpen(false);
      setRevocationReason("");
      setSelectedJob(null);
    }
  };

  const handleQASubmit = (job: Job, checklist: { overallApproved: boolean; notes: string; completed: boolean; items: string[] }) => {
    const updatedJob = {
      ...job,
      status: checklist.overallApproved ? "pending MD approval" as const : "pending fieldwork" as const,
      qaChecklist: checklist,
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

  // QA Checklist Standards
  const qaChecklistStandards = {
    documentVerification: [
      "All required documents uploaded and legible",
      "Document authenticity verified",
      "Document dates are current and valid",
      "All signatures and stamps are present"
    ],
    fieldReportReview: [
      "Site inspection completed thoroughly",
      "Measurements are accurate and documented",
      "Photos are clear and comprehensive",
      "Site conditions properly assessed"
    ],
    valueAssessment: [
      "Valuation methodology is appropriate",
      "Comparable properties analyzed",
      "Market conditions considered",
      "Final value is reasonable and justified"
    ],
    complianceCheck: [
      "All regulatory requirements met",
      "Bank policies followed",
      "Risk assessment completed",
      "Legal compliance verified"
    ]
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
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      pb: 4
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        p: 3,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/client-onboarding')}
            sx={{ bgcolor: 'white', color: '#1e3a8a', '&:hover': { bgcolor: '#eef2ff' } }}
          >
            Add New Client
          </Button>
        </Box>
        <Typography variant="h4" fontWeight={600} mb={1}>
          QA Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Quality Assurance & Final Review System
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight={600}>{allPendingQA}</Typography>
              <Typography variant="h6">Total Pending QA</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight={600}>{allAwaitingReview}</Typography>
              <Typography variant="h6">Awaiting Review</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight={600}>{allCompletedReviews}</Typography>
              <Typography variant="h6">Completed Reviews</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight={600}>{allActiveBanks}</Typography>
              <Typography variant="h6">Active Banks</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content with Tabs */}
      <Box sx={{ px: 3 }}>
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Review Reports" icon={<AssignmentIcon />} />
              <Tab label="Analysis & Analytics" icon={<AnalyticsIcon />} />
              <Tab label="Bank Performance" icon={<BusinessIcon />} />
              <Tab label="Client Management" icon={<BusinessIcon />} />
              <Tab label="Quality Standards" icon={<CheckBoxIcon />} />
            </Tabs>
          </Box>

          {/* Review Reports Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Pending QA Reviews
              </Typography>
              
              {qaJobs.length === 0 ? (
                <Alert severity="info">
                  No jobs pending QA review at this time.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {qaJobs.map((job) => (
                    <Card key={job.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {job.clientName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.assetType} - {job.assetDetails.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bank: {job.bankInfo.bankName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handlePropertyHistory(job)}
                          >
                            View History
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleQAReview(job)}
                          >
                            Review
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<BlockIcon />}
                            onClick={() => handleRevokeJob(job)}
                          >
                            Revoke
                          </Button>
                        </Box>
                      </Box>
                      
                      {job.fieldReportData && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Field Report Summary:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Inspection Date: {job.fieldReportData.inspectionDate}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Site Conditions: {job.fieldReportData.siteConditions}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* Analysis & Analytics Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              QA Analytics & Performance Metrics
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Review Completion Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={total > 0 ? ((total - pending) / total) * 100 : 0} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="h6">
                      {total > 0 ? Math.round(((total - pending) / total) * 100) : 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Average Review Time
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight={600}>
                    2.5 days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 30 days average
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Top Issues Found in Reviews
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Issue Type</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Severity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Missing Documents</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>
                          <Chip label="High" color="error" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Incomplete Field Reports</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>
                          <Chip label="Medium" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Valuation Methodology Issues</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          <Chip label="High" color="error" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Bank Performance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Bank Performance Analysis
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              {allBanks.map((bankName) => {
                const bankJobs = jobs.filter(job => job.bankInfo.bankName === bankName);
                const totalJobs = bankJobs.length;
                const pendingJobs = bankJobs.filter(job => job.status === "pending QA").length;
                const completedJobs = bankJobs.filter(job => job.status === "pending MD approval").length;
                
                return (
                  <Card key={bankName} sx={{ cursor: 'pointer' }} onClick={() => handleBankHistory(bankName)}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {bankName}
                      </Typography>
                      <Typography variant="h4" color="primary" fontWeight={600}>
                        {totalJobs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Total Jobs
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Pending QA:</Typography>
                        <Typography variant="body2" fontWeight={600}>{pendingJobs}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Completed:</Typography>
                        <Typography variant="body2" fontWeight={600}>{completedJobs}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </TabPanel>

          {/* Client Management Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Client Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<BusinessIcon />}
                onClick={() => router.push('/admin/client-database')}
              >
                View Client Database
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="h6">Client Management Access</Typography>
              <Typography variant="body2">
                As a QA Officer, you have access to client onboarding and database management features. 
                You can add new clients and view the complete client database to ensure quality control throughout the process.
              </Typography>
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                  Quick Client Stats
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Clients:</Typography>
                  <Typography variant="body2" fontWeight={600}>{jobs?.length || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Active Jobs:</Typography>
                  <Typography variant="body2" fontWeight={600}>{jobs.filter(j => j.status !== 'complete').length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Completed Jobs:</Typography>
                  <Typography variant="body2" fontWeight={600}>{jobs.filter(j => j.status === 'complete').length}</Typography>
                </Box>
              </Card>

              <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                  Recent Client Activity
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {jobs.slice(0, 5).map((job) => (
                    <Box key={job.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="body2">{job.clientName}</Typography>
                      <Chip 
                        label={job.status} 
                        size="small" 
                        color={job.status === 'pending QA' ? 'warning' : job.status === 'complete' ? 'success' : 'default'}
                      />
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          </TabPanel>

          {/* Quality Standards Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              QA Standards & Checklist System
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="h6">Quality Assurance Standards</Typography>
              <Typography variant="body2">
                These are the mandatory standards that all reports must meet before approval.
                Use the checklist system to ensure compliance with all requirements.
              </Typography>
            </Alert>

            <Box sx={{ display: 'grid', gap: 3 }}>
              {Object.entries(qaChecklistStandards).map(([category, items]) => (
                <Card key={category}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2} sx={{ textTransform: 'capitalize' }}>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <List dense>
                      {items.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>
        </Card>
      </Box>

      {/* QA Review Dialog */}
      <Dialog 
        open={qaDialogOpen} 
        onClose={() => setQADialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <CheckCircleIcon />
          QA Review - {selectedJob?.clientName}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedJob && (
            <Box>
              {/* Job Information */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Job Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Client:</Typography>
                      <Typography variant="body1" fontWeight={600}>{selectedJob.clientName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Asset Type:</Typography>
                      <Typography variant="body1" fontWeight={600}>{selectedJob.assetType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Location:</Typography>
                      <Typography variant="body1" fontWeight={600}>{selectedJob.assetDetails.location}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Bank:</Typography>
                      <Typography variant="body1" fontWeight={600}>{selectedJob.bankInfo.bankName}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Documents Review
                  </Typography>
                  
                  {selectedJob.fieldReportData?.documents && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Admin Uploaded Documents:
                      </Typography>
                      <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
                        {Object.entries(selectedJob.fieldReportData.documents).map(([docType, docName]) => (
                          docName && (
                            <Box key={docType} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <DocumentIcon color="primary" />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {docType.replace(/([A-Z])/g, ' $1').trim()}: {docName}
                              </Typography>
                              <Button size="small" startIcon={<DownloadIcon />}>
                                View
                              </Button>
                            </Box>
                          )
                        ))}
                      </Box>
                    </Box>
                  )}

                  {selectedJob.fieldReportData?.photos && selectedJob.fieldReportData.photos.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Field Team Photos:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                        {selectedJob.fieldReportData.photos.map((photo, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                            <DocumentIcon color="primary" />
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              Photo {index + 1}: {photo}
                            </Typography>
                            <Button size="small" startIcon={<VisibilityIcon />}>
                              View
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* QA Checklist */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    QA Checklist
                  </Typography>
                  
                  {Object.entries(qaChecklistStandards).map(([category, items]) => (
                    <Accordion key={category} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'grid', gap: 1 }}>
                          {items.map((item, index) => (
                            <FormControlLabel
                              key={index}
                                                              control={<Checkbox />}
                              label={item}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>

              {/* QA Notes */}
              <TextField
                label="QA Review Notes"
                multiline
                rows={4}
                fullWidth
                placeholder="Enter detailed review notes, findings, and recommendations..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setQADialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => handleQASubmit(selectedJob!, { 
              overallApproved: false, 
              notes: "Returned for corrections",
              completed: true,
              items: ["Document Verification", "Field Report Review", "Value Assessment", "Compliance Check"]
            })}
          >
            Return for Corrections
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleQASubmit(selectedJob!, { 
              overallApproved: true, 
              notes: "Approved for MD review",
              completed: true,
              items: ["Document Verification", "Field Report Review", "Value Assessment", "Compliance Check"]
            })}
          >
            Approve for MD
          </Button>
        </DialogActions>
      </Dialog>

      {/* Property History Dialog */}
      <Dialog 
        open={propertyHistoryDialogOpen} 
        onClose={() => setPropertyHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Property History - {selectedJob?.clientName}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h6" mb={2}>Job Timeline</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Job Created" 
                    secondary={new Date(selectedJob.createdAt).toLocaleDateString()}
                  />
                </ListItem>
                {selectedJob.adminReviewed && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Admin Review Completed" 
                      secondary={selectedJob.adminReviewDate ? new Date(selectedJob.adminReviewDate).toLocaleDateString() : 'N/A'}
                    />
                  </ListItem>
                )}
                {selectedJob.fieldReportData && (
                  <ListItem>
                    <ListItemIcon>
                      <ReportIcon color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Field Report Submitted" 
                      secondary={selectedJob.fieldReportData.inspectionDate}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPropertyHistoryDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bank History Dialog */}
      <Dialog 
        open={bankHistoryDialogOpen} 
        onClose={() => setBankHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Bank History - {selectedBank}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" mb={2}>Recent Jobs</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.filter(job => job.bankInfo.bankName === selectedBank).slice(0, 10).map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.clientName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={job.status} 
                        color={job.status === "pending QA" ? "warning" : job.status === "pending MD approval" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankHistoryDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revocation Dialog */}
      <Dialog 
        open={revocationDialogOpen} 
        onClose={() => setRevocationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <BlockIcon />
          Revoke Job
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6">Warning: Job Revocation</Typography>
            <Typography variant="body2">
              Revoking a job will immediately stop all processing and return it to the initial state.
              This action cannot be undone and will require the job to be resubmitted from the beginning.
            </Typography>
          </Alert>
          
          <Typography variant="h6" mb={2}>
            Revoking: {selectedJob?.clientName}
          </Typography>
          
          <TextField
            label="Reason for Revocation"
            multiline
            rows={4}
            fullWidth
            value={revocationReason}
            onChange={(e) => setRevocationReason(e.target.value)}
            placeholder="Please provide a detailed reason for revoking this job..."
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setRevocationDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmRevocation}
            disabled={!revocationReason.trim()}
          >
            Confirm Revocation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 