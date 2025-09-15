import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export interface NotificationData {
  user_id: number;
  from_user_id?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message';
  category: 'system' | 'job' | 'user' | 'communication' | 'approval';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string;
  metadata?: any;
}

export class NotificationService {
  // Create a notification
  static async createNotification(data: NotificationData) {
    try {
      const result = await pool.query(`
        INSERT INTO notifications (
          user_id, from_user_id, title, message, type, category, 
          priority, action_url, metadata, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `, [
        data.user_id,
        data.from_user_id || null,
        data.title,
        data.message,
        data.type,
        data.category,
        data.priority,
        data.action_url || null,
        data.metadata ? JSON.stringify(data.metadata) : null
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Notify all users with specific roles
  static async notifyRole(role: string, data: Omit<NotificationData, 'user_id'>) {
    try {
      const users = await pool.query(
        'SELECT id FROM users WHERE role = $1 AND approved = true',
        [role]
      );

      const notifications = [];
      for (const user of users.rows) {
        const notification = await this.createNotification({
          ...data,
          user_id: user.id
        });
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error notifying role:', error);
      throw error;
    }
  }

  // Job-related notifications
  static async notifyJobStatusChange(jobId: number, oldStatus: string, newStatus: string, userId: number) {
    try {
      // Get job details
      const job = await pool.query(
        'SELECT client_name, status FROM jobs WHERE id = $1',
        [jobId]
      );

      if (job.rows.length === 0) return;

      const jobData = job.rows[0];
      const statusMessages = {
        'pending fieldwork': 'Field work is pending',
        'fieldwork completed': 'Field work has been completed',
        'pending QA': 'Job is pending QA review',
        'QA completed': 'QA review has been completed',
        'pending MD approval': 'Job is pending MD approval',
        'approved': 'Job has been approved',
        'rejected': 'Job has been rejected',
        'completed': 'Job has been completed'
      };

      const title = `Job Status Update: ${jobData.client_name}`;
      const message = `Job status changed from "${oldStatus}" to "${newStatus}". ${statusMessages[newStatus as keyof typeof statusMessages] || ''}`;

      // Notify relevant users based on status
      let targetRoles: string[] = [];
      
      switch (newStatus) {
        case 'pending QA':
          targetRoles = ['qa_officer', 'admin'];
          break;
        case 'pending MD approval':
          targetRoles = ['md', 'admin'];
          break;
        case 'approved':
        case 'completed':
          targetRoles = ['admin', 'field_team', 'qa_officer'];
          break;
        case 'rejected':
          targetRoles = ['admin', 'field_team'];
          break;
        default:
          targetRoles = ['admin'];
      }

      // Create notifications for target roles
      for (const role of targetRoles) {
        await this.notifyRole(role, {
          title,
          message,
          type: newStatus === 'rejected' ? 'error' : 'info',
          category: 'job',
          priority: newStatus === 'rejected' ? 'high' : 'normal',
          action_url: `/jobs/${jobId}`,
          metadata: { job_id: jobId, old_status: oldStatus, new_status: newStatus }
        });
      }

    } catch (error) {
      console.error('Error notifying job status change:', error);
    }
  }

  // User approval notifications
  static async notifyUserApproval(userId: number, approved: boolean, approvedBy: number) {
    try {
      const user = await pool.query(
        'SELECT name, email, role FROM users WHERE id = $1',
        [userId]
      );

      if (user.rows.length === 0) return;

      const userData = user.rows[0];
      const approver = await pool.query(
        'SELECT name FROM users WHERE id = $1',
        [approvedBy]
      );

      const approverName = approver.rows[0]?.name || 'System Administrator';

      if (approved) {
        await this.createNotification({
          user_id: userId,
          from_user_id: approvedBy,
          title: 'Account Approved',
          message: `Your account has been approved by ${approverName}. You can now access the system.`,
          type: 'success',
          category: 'user',
          priority: 'high',
          action_url: '/dashboard'
        });
      } else {
        await this.createNotification({
          user_id: userId,
          from_user_id: approvedBy,
          title: 'Account Rejected',
          message: `Your account has been rejected by ${approverName}. Please contact support for more information.`,
          type: 'error',
          category: 'user',
          priority: 'high',
          action_url: '/signin'
        });
      }

    } catch (error) {
      console.error('Error notifying user approval:', error);
    }
  }

  // New user registration notification
  static async notifyNewUserRegistration(userId: number) {
    try {
      const user = await pool.query(
        'SELECT name, email, role FROM users WHERE id = $1',
        [userId]
      );

      if (user.rows.length === 0) return;

      const userData = user.rows[0];

      // Notify MD and QA officers about new registration
      await this.notifyRole('md', {
        title: 'New User Registration',
        message: `New user "${userData.name}" (${userData.email}) with role "${userData.role}" has registered and is pending approval.`,
        type: 'info',
        category: 'user',
        priority: 'normal',
        action_url: '/md-dashboard',
        metadata: { user_id: userId, user_name: userData.name, user_email: userData.email, user_role: userData.role }
      });

      await this.notifyRole('qa_officer', {
        title: 'New User Registration',
        message: `New user "${userData.name}" (${userData.email}) with role "${userData.role}" has registered and is pending approval.`,
        type: 'info',
        category: 'user',
        priority: 'normal',
        action_url: '/qa-dashboard',
        metadata: { user_id: userId, user_name: userData.name, user_email: userData.email, user_role: userData.role }
      });

    } catch (error) {
      console.error('Error notifying new user registration:', error);
    }
  }

  // Payment received notification
  static async notifyPaymentReceived(jobId: number, amount: number) {
    try {
      const job = await pool.query(
        'SELECT client_name FROM jobs WHERE id = $1',
        [jobId]
      );

      if (job.rows.length === 0) return;

      const jobData = job.rows[0];

      await this.notifyRole('accounts', {
        title: 'Payment Received',
        message: `Payment of $${amount} has been received for job: ${jobData.client_name}`,
        type: 'success',
        category: 'job',
        priority: 'normal',
        action_url: `/jobs/${jobId}`,
        metadata: { job_id: jobId, amount }
      });

      await this.notifyRole('admin', {
        title: 'Payment Received',
        message: `Payment of $${amount} has been received for job: ${jobData.client_name}`,
        type: 'success',
        category: 'job',
        priority: 'normal',
        action_url: `/jobs/${jobId}`,
        metadata: { job_id: jobId, amount }
      });

    } catch (error) {
      console.error('Error notifying payment received:', error);
    }
  }

  // Get unread notification count for a user
  static async getUnreadCount(userId: number) {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false',
        [userId]
      );

      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}


