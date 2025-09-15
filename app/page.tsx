'use client';

import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Container, Paper
} from "@mui/material";
import { useRouter } from 'next/navigation';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import Logo from "../components/Logo";

export default function LandingPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const services = [
    {
      icon: AssessmentIcon,
      title: "Valuation & Advisory Services",
      description: "Fast and cost-effective market-based valuations tailored to individual or multiple client needs.",
      color: "#1976d2"
    },
    {
      icon: MapIcon,
      title: "Physical Planning & Land Management",
      description: "Land surveying projects, titling services, mergers, subdivisions, and boundary verification.",
      color: "#388e3c"
    },
    {
      icon: SearchIcon,
      title: "Land Adjudication & Sites Acquisition",
      description: "Research, information gathering, and complete documentation for site development.",
      color: "#f57c00"
    },
    {
      icon: TrendingUpIcon,
      title: "Investment Advisory & Market Research",
      description: "Market studies on highest and best use, marketability, and project viability analysis.",
      color: "#7b1fa2"
    }
  ];

  const features = [
    {
      icon: SecurityIcon,
      title: "Secure & Compliant",
      description: "Bank-grade security with full audit trails and compliance management"
    },
    {
      icon: SpeedIcon,
      title: "Lightning Fast",
      description: "Streamlined workflows that reduce processing time by 70%"
    },
    {
      icon: VerifiedIcon,
      title: "Quality Assured",
      description: "Built-in QA checklists and approval workflows for accuracy"
    },
    {
      icon: BusinessIcon,
      title: "Bank Integration",
      description: "Seamless integration with major financial institutions"
    }
  ];

  const stats = [
    { number: "18+", label: "Years Experience" },
    { number: "500+", label: "Projects Completed" },
    { number: "50+", label: "Bank Partners" },
    { number: "99.9%", label: "Accuracy Rate" }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header with Logo and Sign In */}
      <Box sx={{ 
        bgcolor: 'white', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            {/* Logo */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Logo size="large" showText={true} />
            </Box>

            {/* Sign In and Sign Up Buttons */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant="outlined"
                onClick={handleSignUp}
                startIcon={<PersonAddIcon />}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderWidth: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: '#1565c0',
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                    borderWidth: 2,
                    '&::before': {
                      transform: 'scaleX(1)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                    zIndex: -1,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Create Account
              </Button>
              <Button
                variant="contained"
                onClick={handleSignIn}
                startIcon={<PersonIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                    '&::before': {
                      transform: 'scaleX(1)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                    zIndex: 1,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        py: 12
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, alignItems: 'center' }}>
            <Box>
              <Typography variant="h2" fontWeight={700} mb={3} sx={{ lineHeight: 1.2 }}>
                Professional Property Valuation Management System
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                Streamline your valuation workflow with our comprehensive digital platform. 
                From client onboarding to final approval, manage everything in one secure system.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSignIn}
                  startIcon={<PersonIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: 8,
                    py: 2.5,
                    borderRadius: 4,
                    textTransform: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                      zIndex: -1,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Get Started Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<AssessmentIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.6)',
                    color: 'white',
                    px: 8,
                    py: 2.5,
                    borderRadius: 4,
                    textTransform: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderWidth: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(255,255,255,0.2)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                      zIndex: -1,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
            <Box>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: 4, 
                p: 4,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" fontWeight={600} mb={3} textAlign="center">
                  System Overview
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {['Admin', 'Field Team', 'QA Officer', 'MD', 'Accounts'].map((role) => (
                    <Box key={role}>
                      <Paper sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" fontWeight={600}>
                          {role}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 4 }}>
            {stats.map((stat) => (
              <Box key={stat.label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight={700} color="#1976d2" mb={1}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={6} color="text.primary">
            Our Core Services
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {services.map((service) => (
              <Box key={service.title}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: service.color, 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      <service.icon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={600} mb={2} color="text.primary">
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* System Features */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={6} color="text.primary">
            System Features
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 4 }}>
            {features.map((feature) => (
              <Box key={feature.title}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#e3f2fd', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <feature.icon sx={{ color: '#1976d2', fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        py: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} mb={3}>
              Ready to Transform Your Valuation Process?
        </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Join leading financial institutions and property professionals who trust our system
        </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleSignIn}
              startIcon={<PersonIcon />}
              sx={{
                bgcolor: 'white',
                color: '#1976d2',
                px: 10,
                py: 3,
                borderRadius: 4,
                textTransform: 'none',
                fontSize: '1.3rem',
                fontWeight: 700,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
                  '&::before': {
                    transform: 'scaleX(1)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                  zIndex: -1,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Access System Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Logo size="medium" showText={true} color="light" />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                An independent limited liability company with over 18 years of combined property experience. 
                We maintain supreme levels of service for financial institutions, public organizations, 
                and private companies.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Contact Information
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                📧 info@otic.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                📱 +256 XXX XXX XXX
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                🏢 Kampala, Uganda
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Partners
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Uganda Banking Institute', 'Uganda Land Commission', 'Uganda Institute Of Physical Planners', 'Uganda Law Society'].map((partner) => (
                  <Chip
                    key={partner}
                    label={partner}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  />
          ))}
        </Box>
            </Box>
          </Box>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 Otic. All rights reserved. | 
              Professional Property Valuation Management System
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
