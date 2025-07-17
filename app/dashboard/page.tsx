"use client";
import { Box, Typography, Button, Paper, Stack, Card, CardContent, Avatar, Chip, Fade, Grow, TextField } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useJobs } from "../../components/JobsContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRef, useState } from "react";

const rolePages: Record<string, { label: string; path: string }[]> = {
  admin: [
    { label: "Admin Dashboard", path: "/dashboard" },
  ],
  field_team: [
    { label: "Field Team Dashboard", path: "/dashboard" },
  ],
  qa_officer: [
    { label: "QA Dashboard", path: "/dashboard" },
  ],
  md: [
    { label: "MD Dashboard", path: "/dashboard" },
  ],
  accounts: [
    { label: "Accounts Dashboard", path: "/dashboard" },
  ],
};

const roleColors: Record<string, string> = {
  admin: '#1976d2',
  field_team: '#00897b',
  qa_officer: '#7c3aed',
  md: '#e53935',
  accounts: '#6d4c41',
};

const cardColors: Record<string, string[]> = {
  admin: ['#2196f3', '#ff9800', '#43a047'],
  field_team: ['#26a69a', '#ffa726', '#66bb6a'],
  qa_officer: ['#7c3aed', '#ffd600', '#43a047'],
  md: ['#e53935', '#ffb300', '#43a047'],
  accounts: ['#6d4c41', '#ffb300', '#43a047'],
};

export default function Dashboard() {
  // Move all hooks to the top
  const { user, logout } = useUser();
  const { jobs, updateJob, addJob } = useJobs();
  const router = useRouter();
  // HOOKS MUST BE HERE
  const [showClientForm, setShowClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    ourRef: '',
    date: '',
    purpose: '',
    owner: {
      name: '',
      signature: '', // can be a string or file upload in future
      plotNo: '',
      address: '',
      contact: '',
      propertyUse: '',
      description: '',
    },
    representative: {
      name: '',
      plotNo: '',
      address: '',
      contact: '',
      propertyUse: '',
      description: '',
    },
    companyOfficial: {
      name: '',
      signature: '',
      branch: '',
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingJobId, setUploadingJobId] = useState<string | null>(null);
  const [fieldReportFile, setFieldReportFile] = useState<File | null>(null);

  if (!user) return null;
  const pages = rolePages[user.role] || [];

  // Job stats for summary cards
  const total = jobs.length;
  const pending = jobs.filter(j => j.status !== "complete").length;
  const completed = jobs.filter(j => j.status === "complete").length;

  // Jobs relevant to this role
  let relevantJobs = jobs;
  if (user.role === "field_team") relevantJobs = jobs.filter(j => j.status === "pending fieldwork");
  if (user.role === "qa_officer") relevantJobs = jobs.filter(j => j.status === "pending QA");
  if (user.role === "md") relevantJobs = jobs.filter(j => j.status === "pending MD approval");
  if (user.role === "accounts") relevantJobs = jobs.filter(j => j.status === "pending payment");

  const [primary, warning, success] = cardColors[user.role] || ['#1976d2', '#ff9800', '#43a047'];

  // Remove the old renderClientFormFields function and any references to newClient.assetDetails

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" px={4} mb={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => { logout(); router.push("/"); }}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
      {/* Vibrant Hero Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${roleColors[user.role]} 0%, #42a5f5 100%)`,
        color: 'white',
        py: 6,
        px: 4,
        borderRadius: 4,
        mb: 4,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)'
      }}>
        <Fade in timeout={1000}>
          <Box>
            <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
              Welcome, {user.role.toUpperCase()}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              Manage your valuation workflow efficiently
            </Typography>
          </Box>
        </Fade>
      </Box>
      <Box sx={{ px: 4 }}>
        {/* Vibrant Stats Cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} justifyContent="center">
          <Grow in timeout={800}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: primary,
              borderRadius: 4,
              color: 'white',
              boxShadow: '0 4px 24px rgba(33,150,243,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(33,150,243,0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>Total Jobs</Typography>
                <Typography variant="h3" fontWeight={900}>{total}</Typography>
              </CardContent>
            </Card>
          </Grow>
          <Grow in timeout={1000}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: warning,
              borderRadius: 4,
              color: 'white',
              boxShadow: '0 4px 24px rgba(255,152,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(255,152,0,0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>Pending</Typography>
                <Typography variant="h3" fontWeight={900}>{pending}</Typography>
              </CardContent>
            </Card>
          </Grow>
          <Grow in timeout={1200}>
            <Card sx={{ 
              minHeight: 140,
              minWidth: 200,
              background: success,
              borderRadius: 4,
              color: 'white',
              boxShadow: '0 4px 24px rgba(67,160,71,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(67,160,71,0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>Completed</Typography>
                <Typography variant="h3" fontWeight={900}>{completed}</Typography>
              </CardContent>
            </Card>
          </Grow>
        </Stack>
        {/* Quick Actions and Jobs remain unchanged */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h5" gutterBottom fontWeight={600} color="text.primary">
            Quick Actions
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            {/* Admin: Add new client */}
            {user.role === 'admin' && (
              <Button variant="contained" color="primary" onClick={() => setShowClientForm(v => !v)}>
                {showClientForm ? 'Hide Client Form' : 'Add New Client'}
              </Button>
            )}
            {/* Field Team: See notification for new job */}
            {user.role === 'field_team' && (
              <Typography color="info.main" fontWeight={600}>Check for new jobs assigned!</Typography>
            )}
            {/* QA: See jobs pending QA */}
            {user.role === 'qa_officer' && (
              <Typography color="secondary.main" fontWeight={600}>Review jobs pending QA</Typography>
            )}
            {/* MD: See jobs pending approval */}
            {user.role === 'md' && (
              <Typography color="error.main" fontWeight={600}>Review jobs pending MD approval</Typography>
            )}
            {/* Accounts: See jobs pending payment */}
            {user.role === 'accounts' && (
              <Typography color="success.main" fontWeight={600}>Track and mark payments</Typography>
            )}
            {/* Dashboard button always enabled */}
            {pages.map((page: { label: string; path: string }, index: number) => (
              <Grow in timeout={1400 + index * 200} key={page.path}>
                <Button 
                  variant="contained" 
                  onClick={() => router.push(page.path)}
                  sx={{
                    background: roleColors[user.role],
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
                  fullWidth
                >
                  {page.label}
                </Button>
              </Grow>
            ))}
          </Stack>
          {/* Admin: Show client form */}
          {user.role === 'admin' && showClientForm && (
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Client Request Valuation Form</Typography>
              <Stack spacing={2}>
                <TextField label="Our Ref" value={newClient.ourRef} onChange={e => setNewClient(n => ({ ...n, ourRef: e.target.value }))} fullWidth />
                <TextField label="Date" type="date" value={newClient.date} onChange={e => setNewClient(n => ({ ...n, date: e.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
                <TextField label="Purpose of Report" value={newClient.purpose} onChange={e => setNewClient(n => ({ ...n, purpose: e.target.value }))} fullWidth />
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Client’s Details (Owner of the Property)</Typography>
                <TextField label="Name" value={newClient.owner.name} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, name: e.target.value } }))} fullWidth />
                <TextField label="Signature" value={newClient.owner.signature} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, signature: e.target.value } }))} fullWidth />
                <TextField label="Plot No. & Address" value={newClient.owner.plotNo} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, plotNo: e.target.value } }))} fullWidth />
                <TextField label="Contact" value={newClient.owner.contact} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, contact: e.target.value } }))} fullWidth />
                <TextField label="Property Use" select value={newClient.owner.propertyUse} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, propertyUse: e.target.value } }))} fullWidth SelectProps={{ native: true }}>
                  <option value="">Select</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                </TextField>
                <TextField label="Brief Property Description" value={newClient.owner.description} onChange={e => setNewClient(n => ({ ...n, owner: { ...n.owner, description: e.target.value } }))} fullWidth multiline rows={2} />
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Client’s Details (Client’s Representative)</Typography>
                <TextField label="Name" value={newClient.representative.name} onChange={e => setNewClient(n => ({ ...n, representative: { ...n.representative, name: e.target.value } }))} fullWidth />
                <TextField label="Plot No. & Address" value={newClient.representative.plotNo} onChange={e => setNewClient(n => ({ ...n, representative: { ...n.representative, plotNo: e.target.value } }))} fullWidth />
                <TextField label="Contact" value={newClient.representative.contact} onChange={e => setNewClient(n => ({ ...n, representative: { ...n.representative, contact: e.target.value } }))} fullWidth />
                <TextField label="Property Use" select value={newClient.representative.propertyUse} onChange={e => setNewClient(n => ({ ...n, representative: { ...n.representative, propertyUse: e.target.value } }))} fullWidth SelectProps={{ native: true }}>
                  <option value="">Select</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                </TextField>
                <TextField label="Brief Property Description" value={newClient.representative.description} onChange={e => setNewClient(n => ({ ...n, representative: { ...n.representative, description: e.target.value } }))} fullWidth multiline rows={2} />
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Company Official Present</Typography>
                <TextField label="Name" value={newClient.companyOfficial.name} onChange={e => setNewClient(n => ({ ...n, companyOfficial: { ...n.companyOfficial, name: e.target.value } }))} fullWidth />
                <TextField label="Signature" value={newClient.companyOfficial.signature} onChange={e => setNewClient(n => ({ ...n, companyOfficial: { ...n.companyOfficial, signature: e.target.value } }))} fullWidth />
                <TextField label="Branch/Head Office" value={newClient.companyOfficial.branch} onChange={e => setNewClient(n => ({ ...n, companyOfficial: { ...n.companyOfficial, branch: e.target.value } }))} fullWidth />
                <Typography variant="body2" color="text.secondary" mt={2}><b>Note:</b> The Photograph of the Client/Client’s representative taken while on site Must be in the report.</Typography>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" color="success" onClick={() => {
                    // Map newClient fields to the expected job structure
                    addJob({
                      clientName: newClient.owner.name || newClient.representative.name,
                      assetType: 'land', // or 'car' if you want to add a selector
                      assetDetails: {
                        location: newClient.owner.address || newClient.representative.address,
                        landTitle: newClient.ourRef,
                        plotNo: newClient.owner.plotNo || newClient.representative.plotNo,
                        size: '',
                        make: '',
                        model: '',
                        regNo: '',
                        year: '',
                        // You can add more mappings as needed
                      },
                      createdBy: user.role,
                    });
                    setShowClientForm(false);
                  }}>
                    Submit Client
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => setShowClientForm(false)}>Cancel</Button>
                </Stack>
              </Stack>
            </Paper>
          )}
        </Paper>
        {/* Relevant Jobs section: role-specific actions */}
        <Box>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Relevant Jobs
          </Typography>
          <Stack spacing={3}>
            {relevantJobs.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No jobs for this stage.
                </Typography>
              </Paper>
            )}
            {relevantJobs.map((job, index) => (
              <Grow in timeout={1600 + index * 200} key={job.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderLeft: `6px solid ${roleColors[user.role]}`, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                  }
                }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Avatar sx={{ 
                      bgcolor: roleColors[user.role], 
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
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Asset: {Object.values(job.assetDetails).filter(Boolean).join(", ")}
                      </Typography>
                      <Chip 
                        label={job.status.replace('_', ' ').toUpperCase()} 
                        size="small" 
                        sx={{ 
                          bgcolor: roleColors[user.role],
                          color: 'white',
                          fontWeight: 600,
                          mb: 1
                        }} 
                      />
                      {/* Admin: Cross-check field report */}
                      {user.role === 'admin' && job.fieldReport && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>Field Report:</Typography>
                          <Typography variant="body2" color="text.primary">{job.fieldReport}</Typography>
                        </Box>
                      )}
                      {/* Field Team: Upload field report */}
                      {user.role === 'field_team' && (
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            component="label"
                            color="primary"
                            sx={{ mb: 1 }}
                            onClick={() => setUploadingJobId(job.id)}
                          >
                            Upload Field Report (Word/PDF)
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              hidden
                              ref={fileInputRef}
                              onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                  setFieldReportFile(e.target.files[0]);
                                }
                              }}
                            />
                          </Button>
                          {fieldReportFile && uploadingJobId === job.id && (
                            <Button
                              variant="contained"
                              color="success"
                              sx={{ ml: 2 }}
                              onClick={() => {
                                updateJob(job.id, { fieldReport: fieldReportFile.name });
                                setFieldReportFile(null);
                                setUploadingJobId(null);
                              }}
                            >
                              Submit Report
                            </Button>
                          )}
                        </Box>
                      )}
                      {/* QA: Approve or revoke */}
                      {user.role === 'qa_officer' && (
                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ mr: 2 }}
                            onClick={() => updateJob(job.id, { status: 'pending MD approval' })}
                          >
                            Approve & Forward to MD
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => updateJob(job.id, { status: 'pending fieldwork' })}
                          >
                            Revoke & Return to Field Team
                          </Button>
                        </Box>
                      )}
                      {/* MD: Approve for payment */}
                      {user.role === 'md' && (
                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => updateJob(job.id, { status: 'pending payment' })}
                          >
                            Approve for Payment
                          </Button>
                        </Box>
                      )}
                      {/* Accounts: Mark payment received */}
                      {user.role === 'accounts' && (
                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => updateJob(job.id, { status: 'complete', paymentReceived: true })}
                          >
                            Mark Payment Received
                          </Button>
                        </Box>
                      )}
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Chain of Custody:
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                          {job.chain.surveyor && (
                            <Chip 
                              label={`Surveyor: ${job.chain.surveyor}`} 
                              size="small" 
                              color="info" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                          {job.chain.qa && (
                            <Chip 
                              label={`QA: ${job.chain.qa}`} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                          {job.chain.md && (
                            <Chip 
                              label={`MD: ${job.chain.md}`} 
                              size="small" 
                              color="error" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                          {job.chain.accounts && (
                            <Chip 
                              label={`Accounts: ${job.chain.accounts}`} 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Grow>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
} 