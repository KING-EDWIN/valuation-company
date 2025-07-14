"use client";
import { Box, Typography, Stepper, Step, StepLabel, Paper, Avatar } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';

const steps = [
  { label: 'Client Instruction Received', icon: <AssignmentIcon /> },
  { label: 'Schedule Inspection', icon: <GroupIcon /> },
  { label: 'Admin Reporting', icon: <ReportIcon /> },
  { label: 'Report Writing', icon: <EditNoteIcon /> },
  { label: 'Quality Assurance', icon: <VerifiedIcon /> },
  { label: 'Managing Director Approval', icon: <CheckCircleIcon /> },
  { label: 'Accounts Department', icon: <PaidIcon /> },
];

const stepDetails = [
  'Verbal/email instruction on asset + client needs. Sent to admin or survey manager.',
  'Field team assigned. Tools: GPS, measurements, camera, inspection form. Cross checks details against information client shared on survey form.',
  'Admin gathers details from field. Informs 3rd-party info like Banks or top management on system progress.',
  'Field team drafts the report. Sent to QA.',
  'Validate accuracy, completeness, signatures. Push to MD.',
  'Managing Director reviews and approves.',
  'Final payment and billing.',
];

const stepColors = [
  '#00897b', '#7c3aed', '#1976d2', '#ffd600', '#43a047', '#e53935', '#6d4c41'
];

export default function ProcessFlowPage() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f6f7fb 0%, #e3f0ff 100%)', py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
        Process Flow
      </Typography>
      <Stepper orientation="vertical" activeStep={-1} sx={{ maxWidth: 700, mx: 'auto', background: 'transparent', p: 0 }}>
        {steps.map((step, index) => (
          <Step key={step.label} sx={{ mb: 3 }}>
            <StepLabel
              icon={
                <Avatar sx={{ bgcolor: stepColors[index], color: '#fff', width: 40, height: 40 }}>
                  {step.icon}
                </Avatar>
              }
            >
              <Typography variant="h6" fontWeight={600} color={stepColors[index]}>{step.label}</Typography>
            </StepLabel>
            <Paper elevation={3} sx={{ p: 3, mb: 2, borderLeft: `6px solid ${stepColors[index]}`, borderRadius: 3, background: '#fff' }}>
              <Typography>{stepDetails[index]}</Typography>
            </Paper>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
} 