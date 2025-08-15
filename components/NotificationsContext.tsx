'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

type Role = 'admin' | 'field_team' | 'qa_officer' | 'md' | 'accounts';

interface NotificationsContextType {
  notifications: Record<Role, Notification[]>;
  addNotification: (role: Role, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (role: Role, notificationId: string) => void;
  markAllAsRead: (role: Role) => void;
  deleteNotification: (role: Role, notificationId: string) => void;
  getUnreadCount: (role: Role) => number;
  clearAllNotifications: (role: Role) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Record<Role, Notification[]>>({
    admin: [
      {
        id: 'admin-1',
        title: 'New Client Onboarded',
        message: 'XYZ Development Company has been added to the system. Field team has been notified.',
        type: 'success',
        timestamp: '2024-01-24T14:30:00Z',
        read: false,
        actionUrl: '/admin/client-database',
        priority: 'medium'
      },
      {
        id: 'admin-2',
        title: 'Field Report Ready for Review',
        message: 'ABC Bank Limited field inspection report is ready for your review.',
        type: 'info',
        timestamp: '2024-01-21T09:15:00Z',
        read: false,
        actionUrl: '/admin/report-review',
        priority: 'high'
      },
      {
        id: 'admin-3',
        title: 'Payment Received',
        message: 'MNO Real Estate project payment has been confirmed by accounts.',
        type: 'success',
        timestamp: '2024-01-30T16:45:00Z',
        read: true,
        actionUrl: '/admin/client-database',
        priority: 'low'
      },
      {
        id: 'admin-4',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance will occur tonight at 2:00 AM.',
        type: 'warning',
        timestamp: '2024-01-24T10:00:00Z',
        read: false,
        priority: 'medium'
      }
    ],
    field_team: [
      {
        id: 'field-1',
        title: 'New Assignment',
        message: 'You have been assigned to inspect GHI Savings Cooperative property in Makindye.',
        type: 'info',
        timestamp: '2024-01-23T11:30:00Z',
        read: false,
        actionUrl: '/field-dashboard',
        priority: 'high'
      },
      {
        id: 'field-2',
        title: 'Assignment Reminder',
        message: 'JKL Investment Group warehouse inspection is due in 2 days.',
        type: 'warning',
        timestamp: '2024-01-24T08:00:00Z',
        read: false,
        actionUrl: '/field-dashboard',
        priority: 'medium'
      },
      {
        id: 'field-3',
        title: 'Report Approved',
        message: 'Your field report for ABC Bank Limited has been approved by admin.',
        type: 'success',
        timestamp: '2024-01-21T10:00:00Z',
        read: true,
        actionUrl: '/field-dashboard',
        priority: 'low'
      }
    ],
    qa_officer: [
      {
        id: 'qa-1',
        title: 'Report Ready for QA',
        message: 'ABC Bank Limited report is ready for quality assurance review.',
        type: 'info',
        timestamp: '2024-01-21T14:00:00Z',
        read: false,
        actionUrl: '/qa-dashboard',
        priority: 'high'
      },
      {
        id: 'qa-2',
        title: 'QA Review Completed',
        message: 'DEF Microfinance report has been reviewed and forwarded to MD.',
        type: 'success',
        timestamp: '2024-01-25T16:30:00Z',
        read: true,
        actionUrl: '/qa-dashboard',
        priority: 'low'
      },
      {
        id: 'qa-3',
        title: 'Document Verification Required',
        message: 'Additional documents needed for MNO Real Estate project.',
        type: 'warning',
        timestamp: '2024-01-28T11:15:00Z',
        read: false,
        actionUrl: '/qa-dashboard',
        priority: 'medium'
      }
    ],
    md: [
      {
        id: 'md-1',
        title: 'Approval Required',
        message: 'DEF Microfinance project is pending your final approval.',
        type: 'info',
        timestamp: '2024-01-25T17:00:00Z',
        read: false,
        actionUrl: '/md-dashboard',
        priority: 'high'
      },
      {
        id: 'md-2',
        title: 'Project Approved',
        message: 'MNO Real Estate project has been approved and completed.',
        type: 'success',
        timestamp: '2024-01-30T15:00:00Z',
        read: true,
        actionUrl: '/md-dashboard',
        priority: 'low'
      },
      {
        id: 'md-3',
        title: 'Monthly Report',
        message: 'January 2024 performance report is ready for review.',
        type: 'info',
        timestamp: '2024-01-31T09:00:00Z',
        read: false,
        actionUrl: '/md-dashboard',
        priority: 'medium'
      }
    ],
    accounts: [
      {
        id: 'accounts-1',
        title: 'Payment Received',
        message: 'Payment of UGX 850,000,000 received for MNO Real Estate project.',
        type: 'success',
        timestamp: '2024-01-30T14:30:00Z',
        read: false,
        actionUrl: '/accounts-dashboard',
        priority: 'medium'
      },
      {
        id: 'accounts-2',
        title: 'Invoice Generated',
        message: 'Invoice for ABC Bank Limited project has been generated.',
        type: 'info',
        timestamp: '2024-01-22T10:15:00Z',
        read: true,
        actionUrl: '/accounts-dashboard',
        priority: 'low'
      },
      {
        id: 'accounts-3',
        title: 'Payment Due',
        message: 'Payment for DEF Microfinance project is due in 5 days.',
        type: 'warning',
        timestamp: '2024-01-26T12:00:00Z',
        read: false,
        actionUrl: '/accounts-dashboard',
        priority: 'high'
      }
    ]
  });

  const addNotification = (role: Role, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${role}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => ({
      ...prev,
      [role]: [newNotification, ...prev[role]]
    }));
  };

  const markAsRead = (role: Role, notificationId: string) => {
    setNotifications(prev => ({
      ...prev,
      [role]: prev[role].map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    }));
  };

  const markAllAsRead = (role: Role) => {
    setNotifications(prev => ({
      ...prev,
      [role]: prev[role].map(notification => ({ ...notification, read: true }))
    }));
  };

  const deleteNotification = (role: Role, notificationId: string) => {
    setNotifications(prev => ({
      ...prev,
      [role]: prev[role].filter(notification => notification.id !== notificationId)
    }));
  };

  const getUnreadCount = (role: Role) => {
    return notifications[role].filter(notification => !notification.read).length;
  };

  const clearAllNotifications = (role: Role) => {
    setNotifications(prev => ({
      ...prev,
      [role]: []
    }));
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getUnreadCount,
      clearAllNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}; 