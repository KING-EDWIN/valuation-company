'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  AccountBalance as AccountIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Reviews as ReviewIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,

  TrendingDown as TrendingDownIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Factory as FactoryIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';
import { useUser } from '../../components/UserContext';
import { useJobs } from '../../components/JobsContext';
import { useNotifications } from '../../components/NotificationsContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useUser();
  const { jobs } = useJobs();
  const { notifications, markAsRead, getUnreadCount, deleteNotification } = useNotifications();
  const router = useRouter();


  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  // Debug logging
  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    console.log('Jobs:', jobs);
    console.log('User role:', user?.role);
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('stanfield_user');
      console.log('localStorage content:', storedUser);
    }
  }, [user, jobs]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };



  const handleNotificationClick = (notificationId: string) => {
    if (user) {
      markAsRead(user.role, notificationId);
      setNotificationDrawerOpen(false);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(user.role, notificationId);
    setShowNotification(true);
    setNotificationMessage('Notification deleted successfully');
    setNotificationType('success');
  };



  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" mb={2}>
            Please Sign In
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/signin')}
            size="large"
          >
            Go to Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  // Calculate common variables for admin role
  const pendingQA = user?.role === 'admin' ? jobs.filter(j => j.status === 'pending QA').length : 0;
  const pendingFieldwork = user?.role === 'admin' ? jobs.filter(j => j.status === 'pending fieldwork').length : 0;
  const pendingMD = user?.role === 'admin' ? jobs.filter(j => j.status === 'pending MD approval').length : 0;
  const pendingPayment = user?.role === 'admin' ? jobs.filter(j => j.status === 'pending payment').length : 0;
  const completed = user?.role === 'admin' ? jobs.filter(j => j.status === 'complete').length : 0;
  const overdue = user?.role === 'admin' ? jobs.filter(j => {
    if (j.valuationRequirements?.deadline) {
      return new Date(j.valuationRequirements.deadline) < new Date();
    }
    return false;
  }).length : 0;





  // Enhanced statistics with more detailed metrics
  const getEnhancedStats = () => {
    if (user?.role === 'admin') {
      const totalJobs = jobs.length;
      
      return [
        { 
          label: 'Total Jobs', 
          value: totalJobs, 
          color: '#1976d2', 
          icon: AssignmentIcon,
          trend: '+12%',
          trendUp: true,
          subtitle: 'Active projects'
        },
        { 
          label: 'Pending Fieldwork', 
          value: pendingFieldwork, 
          color: '#ff9800', 
          icon: ScheduleIcon,
          trend: '+5%',
          trendUp: true,
          subtitle: 'Awaiting inspection'
        },
        { 
          label: 'Pending QA', 
          value: pendingQA, 
          color: '#f57c00', 
          icon: AssessmentIcon,
          trend: '-3%',
          trendUp: false,
          subtitle: 'Under review'
        },
        { 
          label: 'Pending MD Approval', 
          value: pendingMD, 
          color: '#e91e63', 
          icon: BusinessIcon,
          trend: '+2%',
          trendUp: true,
          subtitle: 'Final review'
        },
        { 
          label: 'Pending Payment', 
          value: pendingPayment, 
          color: '#9c27b0', 
          icon: PaymentIcon,
          trend: '+8%',
          trendUp: true,
          subtitle: 'Awaiting payment'
        },
        { 
          label: 'Completed', 
          value: completed, 
          color: '#4caf50', 
          icon: CheckIcon,
          trend: '+15%',
          trendUp: true,
          subtitle: 'Successfully delivered'
        },
        { 
          label: 'Overdue', 
          value: overdue, 
          color: '#f44336', 
          icon: WarningIcon,
          trend: '-5%',
          trendUp: false,
          subtitle: 'Past deadline'
        }
      ];
    }
    
    return getBasicStats();
  };

  const getBasicStats = () => {
    if (user.role === 'field_team') {
      const assignedJobs = jobs.filter(j => j.status === 'pending fieldwork').length;
      const submittedReports = jobs.filter(j => j.status === 'pending QA').length;
      
      return [
        { 
          label: 'Assigned Jobs', 
          value: assignedJobs, 
          color: '#1976d2', 
          icon: AssignmentIcon,
          trend: '+3%',
          trendUp: true,
          subtitle: 'Active assignments'
        },
        { 
          label: 'Submitted Reports', 
          value: submittedReports, 
          color: '#4caf50', 
          icon: CheckIcon,
          trend: '+7%',
          trendUp: true,
          subtitle: 'Completed inspections'
        }
      ];
    } else if (user.role === 'qa_officer') {
      const pendingReview = jobs.filter(j => j.status === 'pending QA').length;
      const reviewed = jobs.filter(j => j.status === 'pending MD approval').length;
      
      return [
        { 
          label: 'Pending Review', 
          value: pendingReview, 
          color: '#ff9800', 
          icon: AssessmentIcon,
          trend: '+2%',
          trendUp: true,
          subtitle: 'Awaiting QA'
        },
        { 
          label: 'Reviewed', 
          value: reviewed, 
          color: '#4caf50', 
          icon: CheckIcon,
          trend: '+12%',
          trendUp: true,
          subtitle: 'QA completed'
        }
      ];
    } else if (user.role === 'md') {
      const pendingApproval = jobs.filter(j => j.status === 'pending MD approval').length;
      const approved = jobs.filter(j => j.status === 'pending payment').length;
      
      return [
        { 
          label: 'Pending Approval', 
          value: pendingApproval, 
          color: '#ff9800', 
          icon: AssessmentIcon,
          trend: '+4%',
          trendUp: true,
          subtitle: 'Awaiting MD'
        },
        { 
          label: 'Approved', 
          value: approved, 
          color: '#4caf50', 
          icon: CheckIcon,
          trend: '+18%',
          trendUp: true,
          subtitle: 'MD approved'
        }
      ];
    } else if (user.role === 'accounts') {
      const pendingPayment = jobs.filter(j => j.status === 'pending payment').length;
      const paid = jobs.filter(j => j.paymentReceived).length;
      
      return [
        { 
          label: 'Pending Payment', 
          value: pendingPayment, 
          color: '#ff9800', 
          icon: AssessmentIcon,
          trend: '+6%',
          trendUp: true,
          subtitle: 'Awaiting payment'
        },
        { 
          label: 'Paid', 
          value: paid, 
          color: '#4caf50', 
          icon: CheckIcon,
          trend: '+22%',
          trendUp: true,
          subtitle: 'Payment received'
        }
      ];
    }
    
    return [];
  };

  // Enhanced quick actions with more admin features
  const getEnhancedQuickActions = () => {
    if (user.role === 'admin') {
      return [
        {
          title: 'Add New Client',
          description: 'Create new client and job assignments',
          icon: AddIcon,
          color: '#1976d2',
          action: () => router.push('/admin/add-client'),
          badge: 'New'
        },
        {
          title: 'Review Reports',
          description: 'Review and approve field reports',
          icon: ReviewIcon,
          color: '#ff9800',
          action: () => router.push('/admin/report-review'),
          badge: pendingQA > 0 ? `${pendingQA}` : undefined
        },
        {
          title: 'Client Database',
          description: 'View all clients and job history',
          icon: StorageIcon,
          color: '#4caf50',
          action: () => router.push('/admin/client-database'),
          badge: 'View All'
        },
        {
          title: 'Analytics Dashboard',
          description: 'Performance metrics and insights',
          icon: AnalyticsIcon,
          color: '#9c27b0',
          action: () => router.push('/admin/analytics'),
          badge: 'Pro'
        },
        {
          title: 'Team Management',
          description: 'Manage field teams and assignments',
          icon: PeopleIcon,
          color: '#e91e63',
          action: () => router.push('/admin/team-management'),
          badge: 'New'
        },
        {
          title: 'System Settings',
          description: 'Configure system parameters',
          icon: SettingsIcon,
          color: '#607d8b',
          action: () => router.push('/admin/settings'),
          badge: 'Admin'
        }
      ];
    }
    
    return getBasicQuickActions();
  };

  const getBasicQuickActions = () => {
    if (user.role === 'field_team') {
      return [
        {
          title: 'Field Dashboard',
          description: 'Access field reporting tools',
          icon: AssignmentIcon,
          color: '#1976d2',
          action: () => router.push('/field-dashboard'),
          badge: 'Active'
        },
        {
          title: 'Schedule Inspection',
          description: 'Schedule property inspections',
          icon: ScheduleIcon,
          color: '#ff9800',
          action: () => router.push('/schedule-inspection'),
          badge: 'New'
        }
      ];
    } else if (user.role === 'qa_officer') {
      return [
        {
          title: 'QA Dashboard',
          description: 'Review and quality check reports',
          icon: AssessmentIcon,
          color: '#1976d2',
          action: () => router.push('/qa-dashboard'),
          badge: 'Review'
        }
      ];
    } else if (user.role === 'md') {
      return [
        {
          title: 'MD Dashboard',
          description: 'Final approval and oversight',
          icon: BusinessIcon,
          color: '#1976d2',
          action: () => router.push('/md-dashboard'),
          badge: 'Approval'
        }
      ];
    } else if (user.role === 'accounts') {
      return [
        {
          title: 'Accounts Dashboard',
          description: 'Financial management and billing',
          icon: AccountIcon,
          color: '#1976d2',
          action: () => router.push('/accounts-dashboard'),
          badge: 'Finance'
        }
      ];
    }
    
    return [];
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrator',
      'field_team': 'Field Team',
      'qa_officer': 'Quality Assurance Officer',
      'md': 'Managing Director',
      'accounts': 'Accounts Officer'
    };
    return roleNames[role] || role;
  };

  const getAssetTypeIcon = (assetType: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ sx?: object }> } = {
      'Residential': HomeIcon,
      'Commercial': BusinessIcon,
      'Industrial': FactoryIcon,
      'Agricultural': AgricultureIcon,
      'Mixed Use': ApartmentIcon,
      'Land': BusinessIcon,
      'default': BusinessIcon
    };
    return iconMap[assetType] || iconMap.default;
  };

  const stats = getEnhancedStats();
  const quickActions = getEnhancedQuickActions();
  const userNotifications = notifications[user?.role] || [];
  const unreadCount = getUnreadCount(user?.role);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%),
        linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)
      `,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50c0 27.614-22.386 50-50 50s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M30 30c0 16.569-13.431 30-30 30s-30-13.431-30-30 13.431-30 30-30 30 13.431 30 30z'/%3E%3C/g%3E%3C/svg%3E")
        `,
        pointerEvents: 'none'
      }
    }}>
      {/* Enhanced Header with Professional Design */}
      <AppBar position="static" elevation={0} sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Enhanced Logo */}
            <Box sx={{ 
              width: 50, 
              height: 50, 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                SP
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Stanfield Property Partners
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label={getRoleDisplayName(user?.role || 'guest')} 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600
              }}
              size="small"
            />
            
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                size="large"
                onClick={() => setNotificationDrawerOpen(true)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Professional Navigation Breadcrumb */}
      <Box sx={{ 
        px: 3, 
        py: 2, 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Chip 
          icon={<DashboardIcon />} 
          label="Dashboard" 
          color="primary" 
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Chip 
          label={getRoleDisplayName(user?.role || 'guest')} 
          variant="outlined"
          color="secondary"
        />
        {user?.role === 'admin' && (
          <>
            <Typography variant="body2" color="text.secondary">
              /
            </Typography>
            <Chip 
              label="Admin Panel" 
              variant="outlined"
              color="info"
            />
          </>
        )}
      </Box>



      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome back, {getRoleDisplayName(user.role)}!
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Manage your valuation workflow efficiently with our professional tools
          </Typography>
          
          {/* Quick Status Overview */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            mt: 3
          }}>
            <Chip 
              icon={<TrendingIcon />} 
              label={`${jobs.length} Total Projects`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<ScheduleIcon />} 
              label={`${pendingQA} Pending Review`} 
              color="warning" 
              variant="outlined"
            />
            <Chip 
              icon={<CheckIcon />} 
              label={`${jobs.filter(j => j.status === 'complete').length} Completed`} 
              color="success" 
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Enhanced Statistics Cards */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
            Performance Overview
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(7, 1fr)'
            }
          }}>
            {stats.map((stat, index) => (
              <Card key={index} sx={{ 
                height: '100%', 
                background: 'rgba(255, 255, 255, 0.95)',
                border: `2px solid ${stat.color}30`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}40`
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <stat.icon sx={{ fontSize: 30, color: stat.color }} />
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1f2937' }}>
                    {stat.value}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    {stat.subtitle}
                  </Typography>
                  
                  {/* Trend Indicator */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mt: 1,
                    gap: 0.5
                  }}>
                    {stat.trendUp ? (
                      <TrendingIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />
                    )}
                    <Typography variant="caption" sx={{ 
                      color: stat.trendUp ? '#4caf50' : '#f44336',
                      fontWeight: 600
                    }}>
                      {stat.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>



        {/* Enhanced Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
            Quick Actions & Tools
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)'
            }
          }}>
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={action.action}
              >
                {/* Badge */}
                {action.badge && (
                  <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1
                  }}>
                    <Chip 
                      label={action.badge} 
                      size="small" 
                      color="primary"
                      sx={{ 
                        bgcolor: action.color,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                )}
                
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: `${action.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}>
                    <action.icon sx={{ fontSize: 40, color: action.color }} />
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1a237e' }}>
                    {action.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>



        {/* Recent Activity with Enhanced Data */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
            Recent Activity & Updates
          </Typography>
          
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Recent Jobs" />
                <Tab label="Notifications" />
                <Tab label="Performance" />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {selectedTab === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Latest Job Updates
                    </Typography>
                    {jobs.slice(0, 5).map((job) => (
                      <Box key={job.id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        border: '1px solid #f0f0f0',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: '#f8f9fa' }
                      }}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          bgcolor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {(() => {
                            const IconComponent = getAssetTypeIcon(job.assetType);
                            return IconComponent ? <IconComponent sx={{ fontSize: 20, color: '#1976d2' }} /> : null;
                          })()}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {job.clientName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {job.assetType} • {job.status}
                          </Typography>
                        </Box>
                        
                        <Chip 
                          label={job.status} 
                          size="small"
                          color={
                            job.status === 'complete' ? 'success' :
                            job.status === 'pending QA' ? 'warning' :
                            job.status === 'pending fieldwork' ? 'info' : 'default'
                          }
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                
                {selectedTab === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Recent Notifications
                    </Typography>
                    {userNotifications.slice(0, 5).map((notification: Notification) => (
                      <Box key={notification.id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        border: '1px solid #f0f0f0',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: notification.read ? 'transparent' : '#f3e5f5'
                      }}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          bgcolor: `${notification.type === 'success' ? '#4caf50' : 
                                   notification.type === 'warning' ? '#ff9800' : 
                                   notification.type === 'error' ? '#f44336' : '#2196f3'}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {notification.type === 'success' ? <CheckIcon /> :
                           notification.type === 'warning' ? <WarningIcon /> :
                           notification.type === 'error' ? <CloseIcon /> : <InfoIcon />}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleNotificationClick(notification.id)}
                            color={notification.read ? 'default' : 'primary'}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteNotification(notification.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {selectedTab === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Performance Metrics
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                      <Card sx={{ bgcolor: '#f8f9fa' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Completion Rate
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={jobs.length > 0 ? (jobs.filter(j => j.status === 'complete').length / jobs.length) * 100 : 0}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {jobs.length > 0 ? Math.round((jobs.filter(j => j.status === 'complete').length / jobs.length) * 100) : 0}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                      
                      <Card sx={{ bgcolor: '#f8f9fa' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Average Processing Time
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            3.2 days
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            From assignment to completion
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications ({userNotifications.length})
            </Typography>
            <IconButton onClick={() => setNotificationDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {userNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List>
              {userNotifications.map((notification: Notification) => (
                <ListItem key={notification.id} sx={{ 
                  border: '1px solid #f0f0f0',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: notification.read ? 'transparent' : '#f3e5f5'
                }}>
                  <ListItemIcon>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: `${notification.type === 'success' ? '#4caf50' : 
                               notification.type === 'warning' ? '#ff9800' : 
                               notification.type === 'error' ? '#f44336' : '#2196f3'}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {notification.type === 'success' ? <CheckIcon /> :
                       notification.type === 'warning' ? <WarningIcon /> :
                       notification.type === 'error' ? <CloseIcon /> : <InfoIcon />}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleNotificationClick(notification.id)}
                      color={notification.read ? 'default' : 'primary'}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteNotification(notification.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

      {/* Success/Error Notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity={notificationType}
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 