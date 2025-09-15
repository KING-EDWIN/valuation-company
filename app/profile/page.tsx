'use client';

import React, { useState } from 'react';
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from '../../components/UserContext';

export default function ProfilePage() {
  const { user } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || undefined, current_password: password ? currentPassword : undefined })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        setPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => history.back()}>Return</Button>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>My Profile</Typography>
            <Box />
          </Box>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
          )}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth />
            <TextField label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button onClick={handleSave} variant="contained" disabled={saving}>Save Changes</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}


