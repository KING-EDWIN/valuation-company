"use client";
import { useState } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent,
  TextField, MenuItem,
  Alert, Grid, IconButton,
  Stepper, Step, StepLabel, StepContent, FormControlLabel,
  Checkbox, FormGroup
} from "@mui/material";
import { useJobs, Job } from "../../components/JobsContext";
import { useUser } from "../../components/UserContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InspectionSchedule {
  id: string;
  jobId: string;
  clientName: string;
  assetType: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  fieldTeamMember: string;
  specialRequirements: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

const mockSchedules: InspectionSchedule[] = [
  {
    id: '1',
    jobId: 'job-001',
    clientName: 'ABC Bank Limited',
    assetType: 'Commercial Property',
    location: '123 Main Street, Downtown',
    scheduledDate: '2024-01-15',
    scheduledTime: '09:00',
    estimatedDuration: '2 hours',
    fieldTeamMember: 'John Smith',
    specialRequirements: ['Security clearance required', 'High-visibility vest'],
    status: 'scheduled',
    notes: 'Client requested morning inspection. Building access through main entrance.',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    jobId: 'job-002',
    clientName: 'XYZ Development Company',
    assetType: 'Residential Property',
    location: '456 Oak Avenue, Suburbia',
    scheduledDate: '2024-01-16',
    scheduledTime: '14:00',
    estimatedDuration: '1.5 hours',
    fieldTeamMember: 'Sarah Johnson',
    specialRequirements: ['Owner will be present', 'Parking available on street'],
    status: 'scheduled',
    notes: 'Residential inspection. Owner requested afternoon time slot.',
    createdAt: '2024-01-10T11:30:00Z'
  }
];



const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const durationOptions = ['30 minutes', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours', '4 hours'];

const specialRequirements = [
  'Security clearance required',
  'High-visibility vest',
  'Hard hat required',
  'Safety boots required',
  'Owner will be present',
  'Agent will accompany',
  'Parking available',
  'Access restrictions',
  'Photography allowed',
  'Drone inspection needed'
];

export default function ScheduleInspection() {
  const { user } = useUser();
  const { jobs } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [schedules, setSchedules] = useState<InspectionSchedule[]>(mockSchedules);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<InspectionSchedule | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: '',
    fieldTeamMember: user?.role || 'Unassigned',
    specialRequirements: [] as string[],
    notes: ''
  });

  // Filter jobs that need scheduling
  const availableJobs = jobs.filter(job => 
    job.status === "pending fieldwork" && 
    !schedules.some(s => s.jobId === job.id)
  );

  const handleScheduleInspection = (job: Job) => {
    setSelectedJob(job);
    setScheduleForm({
      scheduledDate: '',
      scheduledTime: '',
      estimatedDuration: '',
      fieldTeamMember: user?.role || 'Unassigned',
      specialRequirements: [],
      notes: ''
    });
    setActiveStep(0);
    setScheduleDialogOpen(true);
  };

  const handleEditSchedule = (schedule: InspectionSchedule) => {
    setEditSchedule(schedule);
    setSelectedJob(jobs.find(j => j.id === schedule.jobId) || null);
    setScheduleForm({
      scheduledDate: schedule.scheduledDate,
      scheduledTime: schedule.scheduledTime,
      estimatedDuration: schedule.estimatedDuration,
      fieldTeamMember: schedule.fieldTeamMember,
      specialRequirements: schedule.specialRequirements,
      notes: schedule.notes
    });
    setActiveStep(0);
    setScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = () => {
    if (!selectedJob) return;

    const newSchedule: InspectionSchedule = {
      id: editSchedule?.id || Date.now().toString(),
      jobId: selectedJob.id,
      clientName: selectedJob.clientName || 'Unknown Client',
      assetType: selectedJob.assetType || 'Unknown Asset',
      location: selectedJob.assetDetails?.location || 'Location not specified',
      scheduledDate: scheduleForm.scheduledDate,
      scheduledTime: scheduleForm.scheduledTime,
      estimatedDuration: scheduleForm.estimatedDuration,
      fieldTeamMember: scheduleForm.fieldTeamMember,
      specialRequirements: scheduleForm.specialRequirements,
      status: 'scheduled',
      notes: scheduleForm.notes,
      createdAt: editSchedule?.createdAt || new Date().toISOString()
    };

    if (editSchedule) {
      setSchedules(prev => prev.map(s => s.id === editSchedule.id ? newSchedule : s));
      addNotification({
        message: `Inspection schedule updated for ${selectedJob.clientName}`,
        type: "success",
        timestamp: new Date().toISOString()
      });
    } else {
      setSchedules(prev => [...prev, newSchedule]);
      addNotification({
        message: `Inspection scheduled for ${selectedJob.clientName}`,
        type: "success",
        timestamp: new Date().toISOString()
      });
    }

    setScheduleDialogOpen(false);
    setSelectedJob(null);
    setEditSchedule(null);
    setScheduleForm({
      scheduledDate: '',
      scheduledTime: '',
      estimatedDuration: '',
      fieldTeamMember: user?.role || 'Unassigned',
      specialRequirements: [],
      notes: ''
    });
  };

  const handleRequirementToggle = (requirement: string) => {
    setScheduleForm(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <ScheduleIcon />;
      case 'in-progress': return <AccessTimeIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'cancelled': return <NotificationsIcon />;
      default: return <ScheduleIcon />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 3,
        mb: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton 
            color="inherit" 
            onClick={() => router.back()}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <ScheduleIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={600}>
            Schedule Inspection
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Schedule and manage property inspections for field teams
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Statistics Overview */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={600} color="primary">
                {schedules.filter(s => s.status === 'scheduled').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled Inspections
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTimeIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {schedules.filter(s => s.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={600} color="success.main">
                {schedules.filter(s => s.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Today
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Available Jobs for Scheduling */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color="text.primary">
            Available Jobs for Scheduling
          </Typography>
          
          {availableJobs.length === 0 ? (
            <Alert severity="info">
              All jobs have been scheduled or are in progress.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {availableJobs.map((job) => (
                <Card key={job.id} sx={{ 
                  p: 3, 
                  borderLeft: '6px solid #1976d2',
                  '&:hover': { boxShadow: 4 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      bgcolor: '#1976d2',
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
                        {job.assetType} - {job.assetDetails?.location || 'Location not specified'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ScheduleIcon />}
                    onClick={() => handleScheduleInspection(job)}
                    fullWidth
                  >
                    Schedule Inspection
                  </Button>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Current Schedules */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} color="text.primary">
            Current Schedules
          </Typography>
          
          {schedules.length === 0 ? (
            <Alert severity="info">
              No inspections scheduled yet.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
              {schedules.map((schedule) => (
                <Card key={schedule.id} sx={{ 
                  p: 3, 
                  borderLeft: `6px solid ${schedule.status === 'scheduled' ? '#1976d2' : 
                    schedule.status === 'in-progress' ? '#ff9800' : 
                    schedule.status === 'completed' ? '#4caf50' : '#f44336'}`,
                  '&:hover': { boxShadow: 4 }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {schedule.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {schedule.assetType}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {schedule.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={schedule.status.toUpperCase()} 
                      color={getStatusColor(schedule.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                      size="small"
                      icon={getStatusIcon(schedule.status)}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Date</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {new Date(schedule.scheduledDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Time</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {schedule.scheduledTime}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Duration</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {schedule.estimatedDuration}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Field Team</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {schedule.fieldTeamMember}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {schedule.specialRequirements.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Special Requirements</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {schedule.specialRequirements.map((req, index) => (
                          <Chip key={index} label={req} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {schedule.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Notes</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {schedule.notes}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      Edit Schedule
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Schedule Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScheduleIcon color="primary" />
            {editSchedule ? 'Edit Inspection Schedule' : 'Schedule New Inspection'}
            {selectedJob && ` - ${selectedJob.clientName}`}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Basic Information</StepLabel>
              <StepContent>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Scheduled Date"
                        type="date"
                        value={scheduleForm.scheduledDate}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Scheduled Time"
                        select
                        value={scheduleForm.scheduledTime}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        fullWidth
                        required
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>{time}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Estimated Duration"
                        select
                        value={scheduleForm.estimatedDuration}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                        fullWidth
                        required
                      >
                        {durationOptions.map((duration) => (
                          <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Field Team Member"
                        value={scheduleForm.fieldTeamMember}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, fieldTeamMember: e.target.value }))}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      disabled={!scheduleForm.scheduledDate || !scheduleForm.scheduledTime || !scheduleForm.estimatedDuration}
                    >
                      Next
                    </Button>
                    <Button onClick={() => setScheduleDialogOpen(false)}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Special Requirements & Notes</StepLabel>
              <StepContent>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" mb={2}>Special Requirements</Typography>
                  <FormGroup>
                    <Grid container spacing={2}>
                      {specialRequirements.map((requirement) => (
                        <Grid item xs={12} sm={6} key={requirement}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={scheduleForm.specialRequirements.includes(requirement)}
                                onChange={() => handleRequirementToggle(requirement)}
                              />
                            }
                            label={requirement}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                  
                  <TextField
                    label="Additional Notes"
                    multiline
                    rows={4}
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                    fullWidth
                    sx={{ mt: 3 }}
                    placeholder="Any additional information about the inspection..."
                  />
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleScheduleSubmit}
                    >
                      {editSchedule ? 'Update Schedule' : 'Schedule Inspection'}
                    </Button>
                    <Button onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 