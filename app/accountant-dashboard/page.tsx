"use client";
import { useState } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert, Divider, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, InputAdornment
} from "@mui/material";
import { useJobs, Job } from "../../components/JobsContext";
import { useUser } from "../../components/UserContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ClientPaymentStats {
  totalValue: number;
  paidAmount: number;
  outstandingAmount: number;
  totalJobs: number;
  lastPayment: string | null;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`accountant-tabpanel-${index}`}
      aria-labelledby={`accountant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountantDashboard() {
  const { user } = useUser();
  const { jobs, updateJob } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [tabValue, setTabValue] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);


  // Filter jobs for accountant (pending payment and completed)
  const accountantJobs = jobs.filter(job => 
    job.status === "pending payment" || job.status === "completed"
  );

  // Payment tracking data
  const getPaymentMetrics = () => {
    const totalJobs = accountantJobs.length;
    const fullyPaidJobs = accountantJobs.filter(job => job.paymentReceived === true).length;
    const partiallyPaidJobs = accountantJobs.filter(job => job.paymentReceived === false && job.status === "completed").length;
    const unpaidJobs = accountantJobs.filter(job => job.paymentReceived === false && job.status !== "completed").length;
    
    const totalRevenue = accountantJobs.reduce((sum, job) => sum + (job.valuationRequirements?.value || 0), 0);
    const collectedRevenue = accountantJobs.reduce((sum, job) => {
      if (job.paymentReceived) return sum + (job.valuationRequirements?.value || 0);
      if (job.status === "completed") return sum + ((job.valuationRequirements?.value || 0) * 0.6);
      return sum;
    }, 0);
    
    const collectionRate = totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0;
    
    return {
      totalJobs,
      fullyPaidJobs,
      partiallyPaidJobs,
      unpaidJobs,
      totalRevenue,
      collectedRevenue,
      collectionRate
    };
  };

  const getClientPaymentHistory = () => {
    const clientPayments = accountantJobs.reduce((acc, job) => {
      const client = job.clientName;
      if (!acc[client]) {
        acc[client] = {
          totalJobs: 0,
          totalValue: 0,
          paidAmount: 0,
          outstandingAmount: 0,
          lastPayment: null
        };
      }
      
      const jobValue = job.valuationRequirements?.value || 0;
      acc[client].totalJobs++;
      acc[client].totalValue += jobValue;
      
      if (job.paymentReceived) {
        acc[client].paidAmount += jobValue;
      } else if (job.status === "completed") {
        acc[client].paidAmount += jobValue * 0.6;
        acc[client].outstandingAmount += jobValue * 0.4;
      } else {
        acc[client].outstandingAmount += jobValue;
      }
      
      return acc;
    }, {} as Record<string, ClientPaymentStats>);

    return Object.entries(clientPayments)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.outstandingAmount - a.outstandingAmount);
  };

  const getPaymentMethods = () => {
    const methods = {
      bank_transfer: 0,
      mobile_money: 0,
      cash: 0,
      cheque: 0,
      credit_card: 0
    };
    
    // For now, assume most payments are bank transfers since we don't have detailed payment history
    accountantJobs.forEach(job => {
      if (job.paymentReceived) {
        methods.bank_transfer++;
      }
    });
    
    return methods;
  };

  const handlePaymentRecord = (job: Job) => {
    setSelectedJob(job);
    setPaymentDialogOpen(true);
    setPaymentAmount("");
    setPaymentMethod("bank_transfer");
    setPaymentNotes("");
  };

  const submitPayment = () => {
    if (selectedJob && paymentAmount && parseFloat(paymentAmount) > 0) {
      const amount = parseFloat(paymentAmount);
      const jobValue = selectedJob.valuationRequirements?.value || 0;
      
      // For now, mark as fully paid if payment amount is sufficient
      const updatedJob = {
        ...selectedJob,
        paymentReceived: amount >= jobValue,
        updatedAt: new Date().toISOString()
      };
      
      updateJob(selectedJob.id, updatedJob);
      
      addNotification("admin", {
        title: "Payment Recorded",
        message: `Payment of UGX ${amount.toLocaleString()} recorded for ${selectedJob.clientName}`,
        type: "success",
        priority: "medium"
      });
      
      setPaymentDialogOpen(false);
      setSelectedJob(null);
    }
  };

  const generateReceipt = (job: Job) => {
    setSelectedJob(job);
    setReceiptDialogOpen(true);
  };

  const sendPaymentReminder = (job: Job) => {
    addNotification("admin", {
      title: "Payment Reminder Sent",
      message: `Payment reminder sent to ${job.clientName}`,
      type: "info",
      priority: "medium"
    });
  };

  const paymentMetrics = getPaymentMetrics();
  const clientPayments = getClientPaymentHistory();
  const paymentMethods = getPaymentMethods();

  if (!user || user.role !== "accounts") {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Access Denied - Accountant Only
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
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
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
        </Box>
        <Typography variant="h4" fontWeight={600} mb={1}>
          Accountant Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Financial Management & Payment Tracking System
        </Typography>
      </Box>

      <Box maxWidth={1400} mx="auto" px={2}>
        {/* Payment Overview Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CheckCircleIcon />
                <Typography variant="h6">Fully Paid</Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>{paymentMetrics.fullyPaidJobs}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {paymentMetrics.totalJobs > 0 ? Math.round((paymentMetrics.fullyPaidJobs / paymentMetrics.totalJobs) * 100) : 0}% of total jobs
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <WarningIcon />
                <Typography variant="h6">Partially Paid</Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>{paymentMetrics.partiallyPaidJobs}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {paymentMetrics.totalJobs > 0 ? Math.round((paymentMetrics.partiallyPaidJobs / paymentMetrics.totalJobs) * 100) : 0}% of total jobs
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MoneyOffIcon />
                <Typography variant="h6">Unpaid</Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>{paymentMetrics.unpaidJobs}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {paymentMetrics.totalJobs > 0 ? Math.round((paymentMetrics.unpaidJobs / paymentMetrics.totalJobs) * 100) : 0}% of total jobs
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AttachMoneyIcon />
                <Typography variant="h6">Collection Rate</Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>{paymentMetrics.collectionRate.toFixed(1)}%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                UGX {paymentMetrics.collectedRevenue.toLocaleString()} / {paymentMetrics.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Business Intelligence Tabs */}
        <Card sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Payment Tracking" icon={<ReceiptIcon />} />
              <Tab label="Client Payments" icon={<BusinessIcon />} />
              <Tab label="Payment Methods" icon={<CreditCardIcon />} />
              <Tab label="Collections Analytics" icon={<BarChartIcon />} />
              <Tab label="Financial Reports" icon={<AssessmentIcon />} />
            </Tabs>
          </Box>

          {/* Payment Tracking Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Payment Tracking & Management
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Job Details</TableCell>
                    <TableCell>Total Value</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountantJobs.map((job) => {
                    const totalValue = job.valuationRequirements?.value || 0;
                    const paymentStatus = job.paymentReceived ? "Fully Paid" : "Unpaid";
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{job.clientName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.assetDetails.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{job.assetType}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            UGX {totalValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={paymentStatus}
                            color={job.paymentReceived ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PaymentIcon />}
                              onClick={() => handlePaymentRecord(job)}
                              disabled={job.paymentReceived}
                            >
                              Record Payment
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ReceiptIcon />}
                              onClick={() => generateReceipt(job)}
                            >
                              Receipt
                            </Button>
                            {!job.paymentReceived && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EmailIcon />}
                                onClick={() => sendPaymentReminder(job)}
                              >
                                Reminder
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Client Payments Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Client Payment Analysis
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Total Jobs</TableCell>
                    <TableCell>Total Value</TableCell>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell>Outstanding</TableCell>
                    <TableCell>Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientPayments.map((client) => (
                    <TableRow key={client.name}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{client.name}</Typography>
                      </TableCell>
                      <TableCell>{client.totalJobs}</TableCell>
                      <TableCell>UGX {client.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main">
                          UGX {client.paidAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={client.outstandingAmount > 0 ? "error.main" : "success.main"}>
                          UGX {client.outstandingAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={client.outstandingAmount === 0 ? "Fully Paid" : 
                                 client.paidAmount > 0 ? "Partially Paid" : "Unpaid"}
                          color={client.outstandingAmount === 0 ? "success" : 
                                 client.paidAmount > 0 ? "warning" : "error"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Payment Methods Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Payment Method Analysis
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              {Object.entries(paymentMethods).map(([method, count]) => (
                <Card key={method}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {method === 'bank_transfer' && <AccountBalanceIcon color="primary" />}
                      {method === 'mobile_money' && <PaymentIcon color="primary" />}
                      {method === 'cash' && <AttachMoneyIcon color="primary" />}
                      {method === 'cheque' && <ReceiptIcon color="primary" />}
                      {method === 'credit_card' && <CreditCardIcon color="primary" />}
                      <Typography variant="h6" fontWeight={600}>
                        {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      transactions
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Alert severity="info">
              <Typography variant="h6">Payment Method Insights</Typography>
              <Typography variant="body2">
                Bank transfers and mobile money are the most popular payment methods. Consider offering incentives for preferred payment methods.
              </Typography>
            </Alert>
          </TabPanel>

          {/* Collections Analytics Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Collections Analytics & Trends
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>Collection Performance</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={paymentMetrics.collectionRate} 
                      size={60}
                      color={paymentMetrics.collectionRate >= 80 ? 'success' : 
                             paymentMetrics.collectionRate >= 60 ? 'warning' : 'error'}
                    />
                    <Box>
                      <Typography variant="h4" color="primary">
                        {paymentMetrics.collectionRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Collection Rate
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>Revenue Overview</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                    <Typography variant="h5" color="success.main">
                      UGX {paymentMetrics.totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Collected Revenue</Typography>
                    <Typography variant="h5" color="primary.main">
                      UGX {paymentMetrics.collectedRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Alert severity="success">
              <Typography variant="h6">Collection Insights</Typography>
              <Typography variant="body2">
                Your collection rate is {paymentMetrics.collectionRate.toFixed(1)}%. 
                {paymentMetrics.collectionRate >= 80 ? ' Excellent performance!' : 
                 paymentMetrics.collectionRate >= 60 ? ' Good performance with room for improvement.' : 
                 ' Focus on improving collection processes and follow-up procedures.'}
              </Typography>
            </Alert>
          </TabPanel>

          {/* Financial Reports Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Financial Reports & Export
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                fullWidth
                sx={{ p: 2 }}
              >
                Export Payment Report
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                fullWidth
                sx={{ p: 2 }}
              >
                Print Financial Summary
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                fullWidth
                sx={{ p: 2 }}
              >
                Send to Management
              </Button>
            </Box>

            <Alert severity="info">
              <Typography variant="h6">Financial Reporting</Typography>
              <Typography variant="body2">
                Generate comprehensive financial reports for management review, tax purposes, and business analysis.
              </Typography>
            </Alert>
          </TabPanel>
        </Card>
      </Box>

      {/* Payment Recording Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          color: 'white'
        }}>
          Record Payment
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedJob && (
            <Box>
              <Typography variant="h6" mb={2}>
                {selectedJob.clientName} - {selectedJob.assetType}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Total Value: UGX {(selectedJob.valuationRequirements?.value || 0).toLocaleString()}
              </Typography>
              
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="mobile_money">Mobile Money</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Payment Notes"
                multiline
                rows={3}
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Enter payment details, reference numbers, etc."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={submitPayment}
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog 
        open={receiptDialogOpen} 
        onClose={() => setReceiptDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Payment Receipt
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h5" fontWeight={600} mb={3}>
                STANFIELD PARTNERS
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="h6">Client Information</Typography>
                  <Typography variant="body2">{selectedJob.clientName}</Typography>
                  <Typography variant="body2">{selectedJob.clientInfo.address}</Typography>
                  <Typography variant="body2">{selectedJob.clientInfo.email}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6">Job Information</Typography>
                  <Typography variant="body2">{selectedJob.assetType}</Typography>
                  <Typography variant="body2">{selectedJob.assetDetails.location}</Typography>
                  <Typography variant="body2">Date: {new Date(selectedJob.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6">Summary</Typography>
                <Typography variant="body2">
                  Total Value: UGX {(selectedJob.valuationRequirements?.value || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Payment Status: {selectedJob.paymentReceived ? "Fully Paid" : "Unpaid"}
                </Typography>
                <Typography variant="body2">
                  Job Status: {selectedJob.status}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
