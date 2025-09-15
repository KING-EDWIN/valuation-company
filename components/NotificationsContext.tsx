'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

interface Notification {
  id: number;
  user_id: number;
  from_user_id?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message';
  category: 'system' | 'job' | 'user' | 'communication' | 'approval';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  read_at?: string;
  action_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  from_user_name?: string;
  from_user_role?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/notifications?user_id=${user.id}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load notifications when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notification,
          user_id: user.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev => [data.notification, ...prev]);
      } else {
        setError(data.error || 'Failed to create notification');
      }
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Failed to create notification');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true, read_at: new Date().toISOString() } : notification
          )
        );
      } else {
        setError(data.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  };

  const removeNotification = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      } else {
        setError(data.error || 'Failed to delete notification');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    if (!user?.id) return;

    try {
      // Delete all notifications for the user
      const deletePromises = notifications.map(notification => 
        fetch(`/api/notifications/${notification.id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
      setError('Failed to clear all notifications');
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}