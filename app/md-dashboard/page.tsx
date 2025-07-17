"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Alert, Stack, Card, CardContent, Avatar, Chip, Fade, Grow, TextField } from "@mui/material";
import { useJobs } from "../../components/JobsContext";
import { useNotifications } from "../../components/NotificationsContext";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import { format, parseISO } from "date-fns";

export default function MDDashboard() {
  const { jobs, updateJob } = useJobs();
  const { notifications, clearNotifications, addNotification } = useNotifications();
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [revokeReason, setRevokeReason] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showSummary, setShowSummary] = useState(true);

  // --- Employee Performance ---
  const employeeStats = jobs.reduce((acc, job) => {
    if (job.chain.surveyor) acc.surveyor[job.chain.surveyor] = (acc.surveyor[job.chain.surveyor] || 0) + 1;
    if (job.chain.qa) acc.qa[job.chain.qa] = (acc.qa[job.chain.qa] || 0) + 1;
    if (job.chain.md) acc.md[job.chain.md] = (acc.md[job.chain.md] || 0) + 1;
    return acc;
  }, { surveyor: {}, qa: {}, md: {} } as { surveyor: Record<string, number>, qa: Record<string, number>, md: Record<string, number> });
  const topSurveyor = Object.entries(employeeStats.surveyor).sort((a, b) => b[1] - a[1])[0];
  const topQA = Object.entries(employeeStats.qa).sort((a, b) => b[1] - a[1])[0];
  const topMD = Object.entries(employeeStats.md).sort((a, b) => b[1] - a[1])[0];

  // --- Client Insights ---
  const clientStats = jobs.reduce((acc, job) => {
    acc[job.clientName] = (acc[job.clientName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pendingByClient = jobs.filter(j => j.status !== "complete").reduce((acc, job) => {
    acc[job.clientName] = (acc[job.clientName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostPendingClient = Object.entries(pendingByClient).sort((a, b) => b[1] - a[1])[0];

  // --- Business Health ---
  const now = new Date();
  const jobsThisMonth = jobs.filter(j => j.clientForm?.createdAt && new Date(j.clientForm.createdAt).getMonth() === now.getMonth() && new Date(j.clientForm.createdAt).getFullYear() === now.getFullYear());
  const jobsLastMonth = jobs.filter(j => j.clientForm?.createdAt && new Date(j.clientForm.createdAt).getMonth() === now.getMonth() - 1 && new Date(j.clientForm.createdAt).getFullYear() === now.getFullYear());
  const completed = jobs.filter(j => j.status === "complete").length;
  const total = jobs.length;
  const percentComplete = total ? Math.round((completed / total) * 100) : 0;
  const jobsByStatus = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // --- Past Reports Search & Filter ---
  const filteredJobs = jobs.filter(j =>
    (statusFilter === "all" || j.status === statusFilter) &&
    (j.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (j.assetDetails?.landTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.assetDetails?.regNo || "").toLowerCase().includes(search.toLowerCase()))
  );
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  useEffect(() => { clearNotifications("md"); }, [clearNotifications]);

  const pendingJobs = jobs.filter(j => j.status === "pending MD approval");

  const handleApprove = (id: string) => {
    updateJob(id, {
      status: "pending payment",
      chain: { md: "Managing Director" },
      revocationReason: undefined
    });
    addNotification("accounts", "New job ready for payment!", id);
    setSubmitted(s => ({ ...s, [id]: true }));
  };
  const handleRevoke = (id: string) => {
    updateJob(id, {
      status: "pending QA",
      revocationReason: revokeReason[id] || "No reason provided."
    });
    addNotification("qa_officer", "Job sent back for QA review.", id);
    setSubmitted(s => ({ ...s, [id]: true }));
    setRevokeReason(r => ({ ...r, [id]: "" }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      py: 4
    }}>
      <Box sx={{ px: 4 }}>
        {showSummary && (
          <Alert severity="info" onClose={() => setShowSummary(false)} sx={{ mb: 3, borderRadius: 2 }}>
            <b>MD Dashboard Features:</b><br/>
            - Advanced employee performance (top surveyor, QA, MD)<br/>
            - Client insights (top clients, most pending jobs by client)<br/>
            - Business health (jobs this month/last month, % completed, jobs by status)<br/>
            - Enhanced past report retrieval (filter by status, see more details including creation date, payment, revocation reason)<br/>
            <br/>
            The date formatting error is resolved by installing <code>date-fns</code>.<br/>
            You can now see richer business statistics and retrieve any past report with detailed info, helping the MD make better decisions.<br/>
            <b>If you want even more analytics or visualizations (like charts), let your developer know!</b>
          </Alert>
        )}
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)',
          color: 'white',
          py: 6,
          px: 4,
          borderRadius: 4,
          mb: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          <Fade in timeout={1000}>
            <Box>
              <GavelIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Managing Director Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Final approval and oversight of valuation reports
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Stats Cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} justifyContent="center">
          <Grow in timeout={800}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, color: '#e53935', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Pending Approvals</Typography>
                <Typography variant="h3" fontWeight={700} color="error.main">{pendingJobs.length}</Typography>
              </CardContent>
            </Card>
          </Grow>
          <Grow in timeout={1000}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>Approved Reports</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">{jobs.filter(j => j.chain.md).length}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>

        {/* Notifications */}
        {notifications.md.length > 0 && (
          <Fade in timeout={1200}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {notifications.md.map(n => <div key={n.id}>{n.message}</div>)}
            </Alert>
          </Fade>
        )}

        {/* --- Business Health & Performance Stats --- */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} mb={2}><BarChartIcon sx={{ mr: 1, mb: -0.5 }} />Business & Employee Statistics</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={2}>
            <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6">Total Jobs</Typography>
                <Typography variant="h4">{jobs.length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 180, bgcolor: '#fffde7' }}>
              <CardContent>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="h4">{jobs.filter(j => j.status === "complete").length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 180, bgcolor: '#fce4ec' }}>
              <CardContent>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h4">{jobs.filter(j => j.status !== "complete").length}</Typography>
              </CardContent>
            </Card>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={2}>
            <Card sx={{ minWidth: 220, bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="h6">Surveyor Performance</Typography>
                {Object.entries(employeeStats.surveyor).length === 0 ? <Typography variant="body2">No data</Typography> :
                  Object.entries(employeeStats.surveyor).map(([name, count]) => (
                    <Typography key={name} variant="body2">{name}: {count} jobs</Typography>
                  ))}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#ede7f6' }}>
              <CardContent>
                <Typography variant="h6">QA Performance</Typography>
                {Object.entries(employeeStats.qa).length === 0 ? <Typography variant="body2">No data</Typography> :
                  Object.entries(employeeStats.qa).map(([name, count]) => (
                    <Typography key={name} variant="body2">{name}: {count} jobs</Typography>
                  ))}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6">MD Approvals</Typography>
                {Object.entries(employeeStats.md).length === 0 ? <Typography variant="body2">No data</Typography> :
                  Object.entries(employeeStats.md).map(([name, count]) => (
                    <Typography key={name} variant="body2">{name}: {count} jobs</Typography>
                  ))}
              </CardContent>
            </Card>
          </Stack>
          <Card sx={{ minWidth: 220, bgcolor: '#e1f5fe', mt: 2 }}>
            <CardContent>
              <Typography variant="h6">Top Clients</Typography>
              {Object.entries(clientStats).length === 0 ? <Typography variant="body2">No data</Typography> :
                Object.entries(clientStats).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
                  <Typography key={name} variant="body2">{name}: {count} jobs</Typography>
                ))}
            </CardContent>
          </Card>
        </Box>
        {/* --- Advanced Business & Employee Statistics --- */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} mb={2}><BarChartIcon sx={{ mr: 1, mb: -0.5 }} />Advanced Business Insights</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={2}>
            <Card sx={{ minWidth: 220, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6">Top Surveyor</Typography>
                {topSurveyor ? <Typography variant="body2">{topSurveyor[0]}: {topSurveyor[1]} jobs</Typography> : <Typography variant="body2">No data</Typography>}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#ede7f6' }}>
              <CardContent>
                <Typography variant="h6">Top QA</Typography>
                {topQA ? <Typography variant="body2">{topQA[0]}: {topQA[1]} jobs</Typography> : <Typography variant="body2">No data</Typography>}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6">Top MD</Typography>
                {topMD ? <Typography variant="body2">{topMD[0]}: {topMD[1]} jobs</Typography> : <Typography variant="body2">No data</Typography>}
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#e1f5fe' }}>
              <CardContent>
                <Typography variant="h6">Most Pending Client</Typography>
                {mostPendingClient ? <Typography variant="body2">{mostPendingClient[0]}: {mostPendingClient[1]} pending</Typography> : <Typography variant="body2">No data</Typography>}
              </CardContent>
            </Card>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={2}>
            <Card sx={{ minWidth: 220, bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="h6">Jobs This Month</Typography>
                <Typography variant="body2">{jobsThisMonth.length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#fffde7' }}>
              <CardContent>
                <Typography variant="h6">Jobs Last Month</Typography>
                <Typography variant="body2">{jobsLastMonth.length}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#fce4ec' }}>
              <CardContent>
                <Typography variant="h6">% Completed</Typography>
                <Typography variant="body2">{percentComplete}%</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 220, bgcolor: '#e1f5fe' }}>
              <CardContent>
                <Typography variant="h6">Jobs by Status</Typography>
                {Object.entries(jobsByStatus).map(([status, count]) => (
                  <Typography key={status} variant="body2">{status}: {count}</Typography>
                ))}
              </CardContent>
            </Card>
          </Stack>
        </Box>
        {/* --- Enhanced Past Reports Retrieval --- */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} mb={2}><SearchIcon sx={{ mr: 1, mb: -0.5 }} />Retrieve Past Reports</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <TextField
              label="Search by client, land title, or reg. number"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ maxWidth: 400 }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              sx={{ minWidth: 180 }}
              SelectProps={{ native: true }}
            >
              <option value="all">All</option>
              {Array.from(new Set(jobs.map(j => j.status))).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </TextField>
          </Stack>
          <Paper sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
            {filteredJobs.length === 0 ? (
              <Typography sx={{ p: 2 }} color="text.secondary">No matching jobs found.</Typography>
            ) : (
              filteredJobs.map(job => (
                <Box
                  key={job.id}
                  sx={{ p: 2, borderBottom: '1px solid #eee', cursor: 'pointer', bgcolor: selectedJobId === job.id ? '#fce4ec' : undefined }}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <Typography fontWeight={600}>{job.clientName} ({job.assetType.toUpperCase()})</Typography>
                  <Typography variant="body2" color="text.secondary">Land Title: {job.assetDetails.landTitle || '-'} | Reg No: {job.assetDetails.regNo || '-'}</Typography>
                  <Typography variant="caption" color="text.secondary">Status: {job.status} | Created: {job.clientForm?.createdAt ? format(parseISO(job.clientForm.createdAt), 'yyyy-MM-dd') : '-'}</Typography>
                </Box>
              ))
            )}
          </Paper>
          {selectedJob && (
            <Paper sx={{ p: 3, mb: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={1}>Report Details</Typography>
              <Typography variant="subtitle2" fontWeight={700}>Client Form</Typography>
              <Typography variant="body2">Client Name: {selectedJob.clientName}</Typography>
              <Typography variant="body2">Asset Type: {selectedJob.assetType.toUpperCase()}</Typography>
              {Object.entries(selectedJob.assetDetails).map(([k, v]) => v && (
                <Typography key={k} variant="body2">{k.charAt(0).toUpperCase() + k.slice(1)}: {v}</Typography>
              ))}
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {selectedJob.clientForm?.createdBy || 'Admin'}</Typography>
              <Typography variant="body2">Created: {selectedJob.clientForm?.createdAt ? format(parseISO(selectedJob.clientForm.createdAt), 'yyyy-MM-dd HH:mm') : '-'}</Typography>
              {selectedJob.fieldReport && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Field Report</Typography>
                  <Typography variant="body2">{selectedJob.fieldReport}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {selectedJob.fieldReportBy || selectedJob.chain.surveyor || 'Field Team'}</Typography>
                </Box>
              )}
              {selectedJob.qaNotes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>QA Notes</Typography>
                  <Typography variant="body2">{selectedJob.qaNotes}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {selectedJob.chain.qa || 'QA Officer'}</Typography>
                </Box>
              )}
              {selectedJob.mdApproval && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>MD Approval</Typography>
                  <Typography variant="body2">{selectedJob.mdApproval}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {selectedJob.chain.md || 'Managing Director'}</Typography>
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Payment Received: {selectedJob.paymentReceived ? 'Yes' : 'No'}</Typography>
              {selectedJob.revocationReason && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>Revocation Reason: {selectedJob.revocationReason}</Typography>
              )}
            </Paper>
          )}
        </Box>

        {/* Jobs List */}
        <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
          Pending MD Approvals
        </Typography>
        
        {pendingJobs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No jobs pending MD approval.
            </Typography>
          </Paper>
        )}
        
        <Stack spacing={3}>
          {pendingJobs.map((job, index) => (
            <Grow in timeout={1400 + index * 200} key={job.id}>
              <Paper sx={{ 
                p: 4, 
                borderLeft: '6px solid #e53935', 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                }
              }}>
                <Stack direction="row" alignItems="center" spacing={3} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: '#e53935', 
                    color: '#fff',
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}>
                    {job.clientName[0]}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                      {job.clientName} ({job.assetType.toUpperCase()})
                    </Typography>
                    <Chip 
                      label="PENDING MD APPROVAL" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e53935',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </Stack>
                {/* Always show all job details inline */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Client Form</Typography>
                  <Typography variant="body2">Client Name: {job.clientName}</Typography>
                  <Typography variant="body2">Asset Type: {job.assetType.toUpperCase()}</Typography>
                  {Object.entries(job.assetDetails).map(([k, v]) => v && (
                    <Typography key={k} variant="body2">{k.charAt(0).toUpperCase() + k.slice(1)}: {v}</Typography>
                  ))}
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.clientForm?.createdBy || 'Admin'}</Typography>
                </Box>
                {job.fieldReport && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>Field Report</Typography>
                    <Typography variant="body2">{job.fieldReport}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.fieldReportBy || job.chain.surveyor || 'Field Team'}</Typography>
                  </Box>
                )}
                {job.qaNotes && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#ede7f6', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>QA Notes</Typography>
                    <Typography variant="body2">{job.qaNotes}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.chain.qa || 'QA Officer'}</Typography>
                  </Box>
                )}
                {job.mdApproval && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>MD Approval</Typography>
                    <Typography variant="body2">{job.mdApproval}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Prepared by: {job.chain.md || 'Managing Director'}</Typography>
                  </Box>
                )}
                {/* Approve and revoke buttons remain as before */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    disabled={submitted[job.id]}
                    onClick={() => handleApprove(job.id)}
                    sx={{
                      background: 'linear-gradient(135deg, #e53935 0%, #ef5350 100%)',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Approve for Payment
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={submitted[job.id]}
                    onClick={() => handleRevoke(job.id)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Revoke & Return to QA
                  </Button>
                  <TextField
                    label="Revocation Reason"
                    value={revokeReason[job.id] || ""}
                    onChange={e => setRevokeReason(r => ({ ...r, [job.id]: e.target.value }))}
                    size="small"
                    sx={{ minWidth: 200 }}
                    disabled={submitted[job.id]}
                  />
                </Stack>
                
                {submitted[job.id] && (
                  <Fade in timeout={500}>
                    <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                      Approved and sent to Accounts for payment processing!
                    </Alert>
                  </Fade>
                )}
              </Paper>
            </Grow>
          ))}
        </Stack>
      </Box>
    </Box>
  );
} 