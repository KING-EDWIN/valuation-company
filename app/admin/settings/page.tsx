'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Fade,
  Grow,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

export default function AdminSettings() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    companyName: 'Stanfield Valuers',
    companyEmail: 'admin@stanfieldvaluers.com',
    companyPhone: '+256 414 123 456',
    companyAddress: 'Kampala, Uganda',
    timezone: 'Africa/Kampala',
    currency: 'UGX',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#1976d2',
      fontSize: 'medium'
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate saving
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'appearance', label: 'Appearance', icon: <PaletteIcon /> },
    { id: 'language', label: 'Language', icon: <LanguageIcon /> }
  ];

  const renderGeneralSettings = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Company Information</Typography>
        <TextField
          fullWidth
          label="Company Name"
          value={settings.companyName}
          onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Company Email"
          value={settings.companyEmail}
          onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Company Phone"
          value={settings.companyPhone}
          onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Company Address"
          value={settings.companyAddress}
          onChange={(e) => setSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
          multiline
          rows={2}
        />
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>System Settings</Typography>
        <TextField
          fullWidth
          select
          label="Timezone"
          value={settings.timezone}
          onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
          sx={{ mb: 2 }}
        >
          <option value="Africa/Kampala">Africa/Kampala</option>
          <option value="UTC">UTC</option>
          <option value="Europe/London">Europe/London</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="Currency"
          value={settings.currency}
          onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
          sx={{ mb: 2 }}
        >
          <option value="UGX">UGX (Uganda Shilling)</option>
          <option value="USD">USD (US Dollar)</option>
          <option value="EUR">EUR (Euro)</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="Language"
          value={settings.language}
          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="lg">Luganda</option>
        </TextField>
      </Card>
    </Box>
  );

  const renderSecuritySettings = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Authentication</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.security.twoFactor}
              onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
            />
          }
          label="Two-Factor Authentication"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          select
          label="Session Timeout (minutes)"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
          sx={{ mb: 2 }}
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="Password Policy"
          value={settings.security.passwordPolicy}
          onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
        >
          <option value="basic">Basic</option>
          <option value="strong">Strong</option>
          <option value="very-strong">Very Strong</option>
        </TextField>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Access Control</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Admin Access" 
              secondary="Full system access and configuration"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="User Management" 
              secondary="Create, edit, and manage user accounts"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Audit Logs" 
              secondary="Track all system activities and changes"
            />
          </ListItem>
        </List>
      </Card>
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Notification Preferences</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.email}
              onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
            />
          }
          label="Email Notifications"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.sms}
              onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
            />
          }
          label="SMS Notifications"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.push}
              onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
            />
          }
          label="Push Notifications"
        />
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Notification Types</Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Job Updates" 
              secondary="When job status changes or new assignments are received"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="System Alerts" 
              secondary="Important system maintenance and security notifications"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Client Communications" 
              secondary="New client inquiries and message notifications"
            />
          </ListItem>
        </List>
      </Card>
    </Box>
  );

  const renderAppearanceSettings = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Theme Settings</Typography>
        <TextField
          fullWidth
          select
          label="Theme"
          value={settings.appearance.theme}
          onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
          sx={{ mb: 2 }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (System)</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="Font Size"
          value={settings.appearance.fontSize}
          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </TextField>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Color Scheme</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'].map((color) => (
            <Box
              key={color}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: color,
                cursor: 'pointer',
                border: settings.appearance.primaryColor === color ? '3px solid #000' : '1px solid #ddd',
                '&:hover': { transform: 'scale(1.1)' }
              }}
              onClick={() => handleSettingChange('appearance', 'primaryColor', color)}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Click to select primary color
        </Typography>
      </Card>
    </Box>
  );

  const renderLanguageSettings = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Language Preferences</Typography>
        <TextField
          fullWidth
          select
          label="Interface Language"
          value={settings.language}
          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
          sx={{ mb: 2 }}
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="lg">Luganda</option>
        </TextField>
        <Typography variant="body2" color="text.secondary">
          Changes will take effect after page refresh
        </Typography>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Regional Settings</Typography>
        <TextField
          fullWidth
          select
          label="Date Format"
          value="DD/MM/YYYY"
          sx={{ mb: 2 }}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </TextField>
        <TextField
          fullWidth
          select
          label="Time Format"
          value="24-hour"
        >
          <option value="12-hour">12-hour</option>
          <option value="24-hour">24-hour</option>
        </TextField>
      </Card>
    </Box>
  );

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return renderGeneralSettings();
      case 1:
        return renderSecuritySettings();
      case 2:
        return renderNotificationSettings();
      case 3:
        return renderAppearanceSettings();
      case 4:
        return renderLanguageSettings();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button 
            onClick={() => router.back()}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Admin Settings
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Configure system settings and preferences
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grow in timeout={800}>
          <Box>
            {/* Success Message */}
            {saveSuccess && (
              <Fade in timeout={500}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Settings saved successfully!
                </Alert>
              </Fade>
            )}

            {/* Tabs */}
            <Paper sx={{ mb: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
                {tabs.map((tab, index) => (
                  <Tab key={tab.id} label={tab.label} />
                ))}
              </Tabs>
            </Paper>

            {/* Tab Content */}
            {renderTabContent(tabValue)}

            {/* Save Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ px: 4, py: 1.5 }}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </Grow>
      </Box>
    </Box>
  );
}
