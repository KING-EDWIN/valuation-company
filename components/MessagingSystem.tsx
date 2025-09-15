'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useUser } from './UserContext';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject?: string;
  content: string;
  read: boolean;
  read_at?: string;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
  recipient_name?: string;
  recipient_role?: string;
}

interface MessagingSystemProps {
  open: boolean;
  onClose: () => void;
}

export default function MessagingSystem({ open, onClose }: MessagingSystemProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users for recipient selection
  useEffect(() => {
    if (open && user?.id) {
      fetchUsers();
    }
  }, [open, user?.id]);

  // Fetch messages when user changes
  useEffect(() => {
    if (open && user?.id) {
      fetchMessages();
    }
  }, [open, user?.id, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users.filter((u: any) => u.id !== user?.id));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const url = selectedUser 
        ? `/api/messages?user_id=${user.id}&conversation_with=${selectedUser}`
        : `/api/messages?user_id=${user.id}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newMessage.recipient_id || !newMessage.content) return;

    setLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user.id,
          recipient_id: parseInt(newMessage.recipient_id),
          subject: newMessage.subject,
          content: newMessage.content
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage({ recipient_id: '', subject: '', content: '' });
        fetchMessages(); // Refresh messages
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });
      
      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true, read_at: new Date().toISOString() } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const getConversationUsers = () => {
    const userIds = new Set(messages.map(msg => msg.sender_id).concat(messages.map(msg => msg.recipient_id)));
    return users.filter(u => userIds.has(u.id) && u.id !== user?.id);
  };

  const getMessagesWithUser = (userId: number) => {
    return messages.filter(msg => 
      (msg.sender_id === user?.id && msg.recipient_id === userId) ||
      (msg.sender_id === userId && msg.recipient_id === user?.id)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon />
            <Typography variant="h6">Messages</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', height: '500px' }}>
          {/* Users List */}
          <Box sx={{ width: '250px', borderRight: 1, borderColor: 'divider', pr: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Conversations
            </Typography>
            <List dense>
              {getConversationUsers().map((conversationUser) => {
                const userMessages = getMessagesWithUser(conversationUser.id);
                const unreadCount = userMessages.filter(msg => !msg.read && msg.recipient_id === user?.id).length;
                const lastMessage = userMessages[userMessages.length - 1];
                
                return (
                  <ListItem
                    key={conversationUser.id}
                    button
                    selected={selectedUser === conversationUser.id}
                    onClick={() => setSelectedUser(conversationUser.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {conversationUser.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={unreadCount > 0 ? 600 : 400}>
                            {conversationUser.name}
                          </Typography>
                          {unreadCount > 0 && (
                            <Chip label={unreadCount} size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {conversationUser.role}
                          </Typography>
                          {lastMessage && (
                            <Typography variant="caption" display="block" noWrap>
                              {lastMessage.content.substring(0, 50)}...
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
            {selectedUser ? (
              <>
                {/* Messages List */}
                <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {getMessagesWithUser(selectedUser).map((message) => (
                        <ListItem
                          key={message.id}
                          sx={{
                            flexDirection: message.sender_id === user?.id ? 'row-reverse' : 'row',
                            alignItems: 'flex-start'
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: message.sender_id === user?.id ? 'primary.main' : 'grey.500' }}>
                              {message.sender_name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <Paper
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              bgcolor: message.sender_id === user?.id ? 'primary.main' : 'grey.100',
                              color: message.sender_id === user?.id ? 'white' : 'text.primary',
                              borderRadius: 2
                            }}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {message.sender_name}
                            </Typography>
                            {message.subject && (
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {message.subject}
                              </Typography>
                            )}
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                              {new Date(message.created_at).toLocaleString()}
                            </Typography>
                          </Paper>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>

                {/* Send Message Form */}
                <Box component="form" onSubmit={sendMessage}>
                  <TextField
                    fullWidth
                    label="Subject (Optional)"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Message"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={loading || !newMessage.content}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <MessageIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}


