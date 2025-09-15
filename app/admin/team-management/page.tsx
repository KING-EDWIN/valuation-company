'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Avatar,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Container
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,

} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

type ChipColor = 'success' | 'error' | 'warning' | 'info' | 'default';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  lastActive: string;
  avatar: string;
  location: string;
  joinDate: string;
  supervisor: string;
  projects: number;
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'John Mukisa',
    email: 'john.mukisa@valuationcompany.com',
    phone: '+256 701 234 567',
    role: 'Senior Valuer',
    department: 'Valuation',
    status: 'active',
    permissions: ['read', 'write', 'approve', 'admin'],
    lastActive: '2 hours ago',
    avatar: 'JM',
    location: 'Kampala',
    joinDate: '2022-03-15',
    supervisor: 'Sarah Nalukenge',
    projects: 15,
    performance: 'excellent'
  },
  {
    id: '2',
    name: 'Sarah Nalukenge',
    email: 'sarah.nalukenge@valuationcompany.com',
    phone: '+256 702 345 678',
    role: 'Team Lead',
    department: 'Valuation',
    status: 'active',
    permissions: ['read', 'write', 'approve', 'admin'],
    lastActive: '1 hour ago',
    avatar: 'SN',
    location: 'Kampala',
    joinDate: '2021-08-20',
    supervisor: 'David Ochieng',
    projects: 28,
    performance: 'excellent'
  },
  {
    id: '3',
    name: 'David Ochieng',
    email: 'david.ochieng@valuationcompany.com',
    phone: '+256 703 456 789',
    role: 'Managing Director',
    department: 'Executive',
    status: 'active',
    permissions: ['read', 'write', 'approve', 'admin', 'super_admin'],
    lastActive: '30 minutes ago',
    avatar: 'DO',
    location: 'Kampala',
    joinDate: '2020-01-10',
    supervisor: 'Board',
    projects: 45,
    performance: 'excellent'
  },
  {
    id: '4',
    name: 'Mary Nakato',
    email: 'mary.nakato@valuationcompany.com',
    phone: '+256 704 567 890',
    role: 'QA Officer',
    department: 'Quality Assurance',
    status: 'active',
    permissions: ['read', 'write', 'approve'],
    lastActive: '3 hours ago',
    avatar: 'MN',
    location: 'Kampala',
    joinDate: '2022-06-12',
    supervisor: 'Sarah Nalukenge',
    projects: 12,
    performance: 'good'
  },
  {
    id: '5',
    name: 'Peter Ssemwanga',
    email: 'peter.ssemwanga@valuationcompany.com',
    phone: '+256 705 678 901',
    role: 'Field Agent',
    department: 'Field Operations',
    status: 'active',
    permissions: ['read', 'write'],
    lastActive: '5 hours ago',
    avatar: 'PS',
    location: 'Jinja',
    joinDate: '2023-01-08',
    supervisor: 'John Mukisa',
    projects: 8,
    performance: 'good'
  },
  {
    id: '6',
    name: 'Grace Namukasa',
    email: 'grace.namukasa@valuationcompany.com',
    phone: '+256 706 789 012',
    role: 'Accounts Officer',
    department: 'Finance',
    status: 'active',
    permissions: ['read', 'write', 'approve'],
    lastActive: '1 day ago',
    avatar: 'GN',
    location: 'Kampala',
    joinDate: '2022-09-03',
    supervisor: 'David Ochieng',
    projects: 20,
    performance: 'excellent'
  }
];

export default function TeamManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPerformanceColor = (performance: string): ChipColor => {
    switch (performance) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'average': return 'warning';
      case 'needs_improvement': return 'error';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'managing director':
      case 'team lead':
        return <BusinessIcon />;
      case 'senior valuer':
      case 'valuer':
        return <WorkIcon />;
      case 'qa officer':
        return <CheckIcon />;
      case 'field agent':
        return <LocationIcon />;
      case 'accounts officer':
        return <SecurityIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const handleAddStaff = () => {
    setAddStaffDialogOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditStaffDialogOpen(true);
  };

  const handleDeleteStaff = () => {
    // In a real app, this would call an API
    setNotificationMessage('Staff member deleted successfully');
    setNotificationType('success');
    setShowNotification(true);
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    // In a real app, this would navigate to a detailed view
    setNotificationMessage(`Viewing details for ${staff.name}`);
    setNotificationType('info');
    setShowNotification(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        color: 'white',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton 
            color="inherit" 
            onClick={() => router.back()}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Team Management
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Manage your team members, roles, and permissions
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Statistics Cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            }
          }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {mockStaff.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Staff
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {mockStaff.filter(s => s.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Members
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
              border: '1px solid rgba(255, 152, 0, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WorkIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                      {mockStaff.filter(s => s.performance === 'excellent').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Top Performers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: '#9c27b0' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                      {mockStaff.filter(s => s.permissions.includes('admin')).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admin Users
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
                gap: 3,
                alignItems: 'center'
              }}>
                <TextField
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  fullWidth
                />
                
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="Valuation">Valuation</MenuItem>
                    <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
                    <MenuItem value="Field Operations">Field Operations</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddStaff}
                  sx={{ height: 56 }}
                >
                  Add Staff
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Staff Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
            >
              <Tab label="All Staff" />
              <Tab label="Active Members" />
              <Tab label="Pending Approval" />
              <Tab label="Performance Review" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {selectedTab === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff Member</TableCell>
                        <TableCell>Role & Department</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>Last Active</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: '#1a237e' }}>
                                {staff.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {staff.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {staff.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {staff.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {getRoleIcon(staff.role)}
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {staff.role}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {staff.department}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {staff.location}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Chip 
                              label={staff.status} 
                              color={getStatusColor(staff.status)}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Chip 
                                label={staff.performance.replace('_', ' ')} 
                                color={getPerformanceColor(staff.performance)}
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary" display="block">
                                {staff.projects} projects
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {staff.lastActive}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Joined {new Date(staff.joinDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleViewStaff(staff)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Staff">
                                <IconButton 
                                  size="small" 
                                  color="warning"
                                  onClick={() => handleEditStaff(staff)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Staff">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteStaff()}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {selectedTab === 1 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Active Members: {mockStaff.filter(s => s.status === 'active').length}
                  </Typography>
                </Box>
              )}
              
              {selectedTab === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Pending Approvals: {mockStaff.filter(s => s.status === 'pending').length}
                  </Typography>
                </Box>
              )}
              
              {selectedTab === 3 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Performance Review Dashboard
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Add Staff Dialog */}
      <Dialog 
        open={addStaffDialogOpen} 
        onClose={() => setAddStaffDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details to add a new staff member to your team.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Full Name" fullWidth />
            <TextField label="Email Address" type="email" fullWidth />
            <TextField label="Phone Number" fullWidth />
            <TextField label="Location" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role">
                <MenuItem value="valuer">Valuer</MenuItem>
                <MenuItem value="senior_valuer">Senior Valuer</MenuItem>
                <MenuItem value="qa_officer">QA Officer</MenuItem>
                <MenuItem value="field_agent">Field Agent</MenuItem>
                <MenuItem value="accounts_officer">Accounts Officer</MenuItem>
                <MenuItem value="team_lead">Team Lead</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select label="Department">
                <MenuItem value="valuation">Valuation</MenuItem>
                <MenuItem value="quality_assurance">Quality Assurance</MenuItem>
                <MenuItem value="field_operations">Field Operations</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="executive">Executive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStaffDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddStaffDialogOpen(false)}>
            Add Staff Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog 
        open={editStaffDialogOpen} 
        onClose={() => setEditStaffDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Staff Member</DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Full Name" defaultValue={selectedStaff.name} fullWidth />
              <TextField label="Email Address" defaultValue={selectedStaff.email} fullWidth />
              <TextField label="Phone Number" defaultValue={selectedStaff.phone} fullWidth />
              <TextField label="Location" defaultValue={selectedStaff.location} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select defaultValue={selectedStaff.role} label="Role">
                  <MenuItem value="valuer">Valuer</MenuItem>
                  <MenuItem value="senior_valuer">Senior Valuer</MenuItem>
                  <MenuItem value="qa_officer">QA Officer</MenuItem>
                  <MenuItem value="field_agent">Field Agent</MenuItem>
                  <MenuItem value="accounts_officer">Accounts Officer</MenuItem>
                  <MenuItem value="team_lead">Team Lead</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedStaff.status} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStaffDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditStaffDialogOpen(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
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
