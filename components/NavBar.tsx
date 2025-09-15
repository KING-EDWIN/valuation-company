"use client";
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  List,
  ListItem,
  Chip
} from "@mui/material";
import { 
  Notifications as NotificationsIcon, 
  AccountCircle, 
  Logout, 
  Message as MessageIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import Link from "next/link";
import { useUser } from "./UserContext";
import { useNotifications } from "./NotificationsContext";
import MessagingSystem from "./MessagingSystem";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const { user, logout } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();
  
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [messagingOpen, setMessagingOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Org Chart", href: "/org-chart" },
    { label: "Process Flow", href: "/process-flow" },
  ];

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationItemClick = (notificationId: number) => {
    markAsRead(notificationId);
    handleNotificationClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    handleNotificationClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <NotificationsIcon color="warning" />;
      case 'error':
        return <NotificationsIcon color="error" />;
      default:
        return <NotificationsIcon color="info" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'normal':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Otic
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {navLinks.map(link => (
              <Button
                key={link.href}
                color="inherit"
                component={Link}
                href={link.href}
                sx={{ 
                  fontWeight: pathname === link.href ? 700 : 400, 
                  borderBottom: pathname === link.href ? '2px solid #fff' : 'none',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                {link.label}
              </Button>
            ))}
            
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  href="/dashboard" 
                  sx={{ 
                    fontWeight: pathname === "/dashboard" ? 700 : 400, 
                    borderBottom: pathname === "/dashboard" ? '2px solid #fff' : 'none',
                    minWidth: 'auto',
                    px: 2
                  }}
                >
                  Dashboard
                </Button>

                {/* Messages Button */}
                <IconButton 
                  color="inherit" 
                  onClick={() => setMessagingOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <MessageIcon />
                </IconButton>

                {/* Notifications Button */}
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationClick}
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* User Menu */}
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <AccountCircle />
                </IconButton>

                <Button 
                  color="inherit" 
                  onClick={() => { logout(); router.push("/"); }}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                href="/signin" 
                sx={{ 
                  fontWeight: pathname === "/signin" ? 700 : 400, 
                  borderBottom: pathname === "/signin" ? '2px solid #fff' : 'none',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllAsRead}>
                Mark All Read
              </Button>
            )}
            <IconButton size="small" onClick={handleNotificationClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Divider />
        
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List dense>
              {notifications.slice(0, 10).map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationItemClick(notification.id)}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderLeft: notification.read ? 'none' : '3px solid',
                    borderLeftColor: 'primary.main'
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={notification.read ? 400 : 600}>
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={getPriorityColor(notification.priority) as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Menu>

      {/* Messaging System */}
      <MessagingSystem 
        open={messagingOpen} 
        onClose={() => setMessagingOpen(false)} 
      />
    </>
  );
}