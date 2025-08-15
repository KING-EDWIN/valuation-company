'use client';

import { 
  Box, Typography, Button, Card, CardContent, 
  Paper
} from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useEffect } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';

const roles = [
  { 
    key: "admin", 
    label: "Admin", 
    icon: BusinessIcon,
    description: "Manage clients, assign jobs, and oversee the entire workflow",
    color: "#1976d2"
  },
  { 
    key: "field_team", 
    label: "Field Team", 
    icon: AssignmentIcon,
    description: "Conduct field inspections and submit detailed reports",
    color: "#388e3c"
  },
  { 
    key: "qa_officer", 
    label: "QA Officer", 
    icon: AssessmentIcon,
    description: "Review and quality assure all field reports and documents",
    color: "#7c3aed"
  },
  { 
    key: "md", 
    label: "Managing Director", 
    icon: CheckCircleIcon,
    description: "Final approval and strategic oversight of all valuations",
    color: "#e53935"
  },
  { 
    key: "accounts", 
    label: "Accounts", 
    icon: PaymentIcon,
    description: "Process payments and manage financial aspects",
    color: "#6d4c41"
  },
];

const processSteps = [
  {
    step: 1,
    title: "Client Instruction",
    description: "Client submits valuation request",
    icon: PersonAddIcon,
    color: "#1976d2"
  },
  {
    step: 2,
    title: "Admin Assignment",
    description: "Admin assigns inspection and field team",
    icon: AssignmentIcon,
    color: "#2196f3"
  },
  {
    step: 3,
    title: "Field Inspection",
    description: "Field team conducts site inspection",
    icon: ReportIcon,
    color: "#00897b"
  },
  {
    step: 4,
    title: "Report Writing",
    description: "Field team writes detailed report",
    icon: ReportIcon,
    color: "#26a69a"
  },
  {
    step: 5,
    title: "Quality Assurance",
    description: "QA officer reviews and validates",
    icon: AssessmentIcon,
    color: "#7c3aed"
  },
  {
    step: 6,
    title: "MD Approval",
    description: "Managing Director final approval",
    icon: CheckCircleIcon,
    color: "#e53935"
  },
  {
    step: 7,
    title: "Payment & Billing",
    description: "Accounts processes payment",
    icon: PaymentIcon,
    color: "#6d4c41"
  }
];

export default function SignIn() {
  const { login, user } = useUser();

  const handleLogin = (role: string) => {
    console.log('=== LOGIN PROCESS START ===');
    console.log('Current user state before login:', user);
    console.log('Attempting to login as:', role);
    
    // First set the user state
    login(role as "admin" | "field_team" | "qa_officer" | "md" | "accounts");
    
    console.log('Login function called, waiting for state update...');
    
    // Wait for the next render cycle to ensure state is updated
    setTimeout(() => {
      console.log('Checking user state after login:', user);
      console.log('Navigating to dashboard...');
      
      // Force a page reload to ensure the dashboard gets the updated state
      window.location.href = "/dashboard";
    }, 100);
  };

  // Debug: Show current user state
  useEffect(() => {
    console.log('SignIn page mounted, current user:', user);
  }, [user]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #f6f7fb 0%, #e3f0ff 100%)' }}>
      {/* Header with Logo */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bgcolor: 'white', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          py: 2, 
          px: 4,
          maxWidth: 1200,
          mx: 'auto'
        }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
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
              bgcolor: '#1976d2', 
              borderRadius: 2,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              SP
            </Box>
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Stanfield Property Partners
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ mt: 8, textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome to Stanfield System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          Property Valuation Workflow Management
        </Typography>
      </Box>

      {/* Role Selection */}
      <Paper sx={{ p: 5, borderRadius: 4, mb: 4, minWidth: 340, textAlign: 'center', maxWidth: 800, width: '100%', mx: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={4} color="text.primary">
          Select Your Role
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          {roles.map(role => {
            const IconComponent = role.icon;
            return (
              <Button
                key={role.key}
                variant="contained"
                size="large"
                sx={{ 
                  fontSize: 18, 
                  py: 2.5, 
                  borderRadius: 2, 
                  fontWeight: 600, 
                  background: `linear-gradient(90deg, ${role.color} 0%, ${role.color}dd 100%)`,
                  textTransform: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${role.color}40`
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleLogin(role.key)}
                fullWidth
                startIcon={<IconComponent />}
              >
                {role.label}
              </Button>
            );
          })}
        </Box>
      </Paper>

      {/* Process Flow Visualization */}
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 1200, width: '100%', mx: 2 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom color="primary">
          Complete Workflow Process
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
          End-to-end property valuation workflow from client instruction to final payment
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, justifyContent: 'center' }}>
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Box key={step.step}>
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${step.color}40`
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Typography variant="h6" fontWeight={700}>
                          {step.step}
                        </Typography>
                      </Box>
                      <IconComponent sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <Box sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    color: 'text.secondary'
                  }}>
                    <ArrowForwardIcon sx={{ fontSize: 24 }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
