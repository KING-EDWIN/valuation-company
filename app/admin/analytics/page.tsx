'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [locationFilter, setLocationFilter] = useState('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for analytics
  const performanceData = {
    revenue: { current: 1250000, previous: 980000, change: '+27.6%' },
    jobs: { current: 156, previous: 128, change: '+21.9%' },
    efficiency: { current: 94.2, previous: 89.1, change: '+5.7%' },
    clientSatisfaction: { current: 4.8, previous: 4.6, change: '+4.3%' }
  };

  const locationPerformance = [
    { name: 'Kampala Central', jobs: 45, revenue: 320000, efficiency: 96.2, trend: 'up' },
    { name: 'Entebbe', jobs: 32, revenue: 280000, efficiency: 93.8, trend: 'up' },
    { name: 'Jinja', jobs: 28, revenue: 195000, efficiency: 91.5, trend: 'up' },
    { name: 'Mbarara', jobs: 22, revenue: 165000, efficiency: 88.9, trend: 'down' },
    { name: 'Gulu', jobs: 18, revenue: 125000, efficiency: 85.2, trend: 'stable' },
    { name: 'Arua', jobs: 11, revenue: 65000, efficiency: 82.1, trend: 'down' }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 98000, jobs: 12, efficiency: 89.2 },
    { month: 'Feb', revenue: 112000, jobs: 14, efficiency: 91.1 },
    { month: 'Mar', revenue: 135000, jobs: 17, efficiency: 92.8 },
    { month: 'Apr', revenue: 128000, jobs: 16, efficiency: 91.9 },
    { month: 'May', revenue: 156000, jobs: 19, efficiency: 93.5 },
    { month: 'Jun', revenue: 142000, jobs: 18, efficiency: 92.1 },
    { month: 'Jul', revenue: 168000, jobs: 21, efficiency: 94.2 },
    { month: 'Aug', revenue: 175000, jobs: 22, efficiency: 94.8 },
    { month: 'Sep', revenue: 189000, jobs: 24, efficiency: 95.1 },
    { month: 'Oct', revenue: 203000, jobs: 26, efficiency: 95.6 },
    { month: 'Nov', revenue: 218000, jobs: 28, efficiency: 96.2 },
    { month: 'Dec', revenue: 235000, jobs: 30, efficiency: 96.8 }
  ];

  const riskAssessment = [
    { category: 'Market Volatility', risk: 'High', impact: 'High', mitigation: 'Diversification' },
    { category: 'Regulatory Changes', risk: 'Medium', impact: 'Medium', mitigation: 'Compliance monitoring' },
    { category: 'Economic Downturn', risk: 'Medium', impact: 'High', mitigation: 'Cash reserves' },
    { category: 'Competition', risk: 'Low', impact: 'Medium', mitigation: 'Service differentiation' },
    { category: 'Technology Disruption', risk: 'Low', impact: 'Low', mitigation: 'Continuous innovation' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(57, 73, 171, 0.05) 100%)',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        color: 'white',
        py: 3,
        px: 4,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Business Intelligence & Analytics
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Deep insights for strategic decision making
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ p: 3, background: 'rgba(255, 255, 255, 0.8)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationFilter}
              label="Location"
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <MenuItem value="all">All Locations</MenuItem>
              <MenuItem value="kampala">Kampala Central</MenuItem>
              <MenuItem value="entebbe">Entebbe</MenuItem>
              <MenuItem value="jinja">Jinja</MenuItem>
              <MenuItem value="mbarara">Mbarara</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Key Performance Indicators */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
            Key Performance Indicators
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <MoneyIcon sx={{ fontSize: 30, color: '#4caf50' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                  ${(performanceData.revenue.current / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Revenue
                </Typography>
                <Chip 
                  icon={<TrendingIcon />} 
                  label={performanceData.revenue.change} 
                  color="success" 
                  size="small"
                />
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <AssessmentIcon sx={{ fontSize: 30, color: '#2196f3' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 1 }}>
                  {performanceData.jobs.current}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Jobs
                </Typography>
                <Chip 
                  icon={<TrendingIcon />} 
                  label={performanceData.jobs.change} 
                  color="success" 
                  size="small"
                />
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <CheckIcon sx={{ fontSize: 30, color: '#ff9800' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
                  {performanceData.efficiency.current}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Efficiency Rate
                </Typography>
                <Chip 
                  icon={<TrendingIcon />} 
                  label={performanceData.efficiency.change} 
                  color="success" 
                  size="small"
                />
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)' }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(156, 39, 176, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <PeopleIcon sx={{ fontSize: 30, color: '#9c27b0' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0', mb: 1 }}>
                  {performanceData.clientSatisfaction.current}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Client Satisfaction
                </Typography>
                <Chip 
                  icon={<TrendingIcon />} 
                  label={performanceData.clientSatisfaction.change} 
                  color="success" 
                  size="small"
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Tabs for different analytics views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Location Performance" />
            <Tab label="Monthly Trends" />
            <Tab label="Risk Assessment" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {locationPerformance.map((location, index) => (
              <Card key={index} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: location.trend === 'up' ? 'success.main' : location.trend === 'down' ? 'error.main' : 'warning.main' }}>
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{location.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.jobs} jobs • ${(location.revenue / 1000).toFixed(0)}K revenue
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={location.efficiency} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {location.efficiency}% efficiency
                </Typography>
              </Card>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Revenue Trends</Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 1 }}>
                {monthlyTrends.map((month, index) => (
                  <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: '100%',
                        height: `${(month.revenue / 250000) * 200}px`,
                        bgcolor: 'primary.main',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }} 
                    />
                    <Typography variant="caption" sx={{ mt: 1, transform: 'rotate(-45deg)' }}>
                      {month.month}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Efficiency Trends</Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 1 }}>
                {monthlyTrends.map((month, index) => (
                  <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: '100%',
                        height: `${month.efficiency * 2}px`,
                        bgcolor: 'success.main',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'success.dark' }
                      }} 
                    />
                    <Typography variant="caption" sx={{ mt: 1, transform: 'rotate(-45deg)' }}>
                      {month.month}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {riskAssessment.map((risk, index) => (
              <Card key={index} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: risk.risk === 'High' ? 'error.main' : risk.risk === 'Medium' ? 'warning.main' : 'success.main' 
                  }}>
                    <WarningIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{risk.category}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk: {risk.risk} • Impact: {risk.impact}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Mitigation: {risk.mitigation}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={risk.risk === 'High' ? 80 : risk.risk === 'Medium' ? 50 : 20} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Card>
            ))}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
