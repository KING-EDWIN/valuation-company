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

export default function LandingPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
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

              </Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Stanfield Property Partners
              </Typography>
            </Box>

            {/* Sign In Button */}
            <Button
              variant="contained"
              onClick={handleSignIn}
              sx={{
                bgcolor: '#1976d2',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Sign In to System
            </Button>
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSignIn}
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
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
              sx={{
                bgcolor: 'white',
                color: '#1976d2',
                px: 8,
                py: 2.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
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
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Stanfield Property Partners
                </Typography>
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
                📧 info@stanfieldpp.com
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
              © 2024 Stanfield Property Partners. All rights reserved. | 
              Professional Property Valuation Management System
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
