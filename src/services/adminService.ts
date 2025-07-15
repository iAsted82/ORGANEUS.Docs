import { User, Company } from '../types/auth';
import { CreateUserRequest, UpdateUserRequest, SystemLog, UserActivity } from '../types/admin';

class AdminService {
  private users: User[] = [];
  private logs: SystemLog[] = [];
  private activities: UserActivity[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    this.logs = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        action: 'User Login',
        userId: 'super-admin-organeus',
        userName: 'Super Administrateur ORGANEUS',
        details: 'Successful login from admin panel',
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'warning',
        action: 'API Key Usage',
        details: 'OpenAI API key approaching limit (80%)',
        ipAddress: '192.168.1.100'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: 'info',
        action: 'System Configuration',
        userId: 'super-admin-organeus',
        userName: 'Super Administrateur ORGANEUS',
        details: 'Logo updated successfully',
        ipAddress: '192.168.1.100'
      }
    ];

    this.activities = [
      {
        id: '1',
        userId: 'admin-oka',
        userName: 'Administrateur OKA Tech',
        action: 'Document Created',
        timestamp: new Date().toISOString(),
        resource: 'Contract Template',
        details: 'Created new contract template',
        ipAddress: '192.168.1.101'
      },
      {
        id: '2',
        userId: 'collab-oka',
        userName: 'Collaborateur OKA Tech',
        action: 'Document Generated',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resource: 'Invoice #2024-001',
        details: 'Generated invoice using AI',
        ipAddress: '192.168.1.102'
      }
    ];
  }

  // User Management
  async createUser(userData: CreateUserRequest): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      company: {} as Company, // Would be populated from company service
      isActive: userData.isActive,
      lastLogin: undefined
    };

    this.users.push(newUser);
    this.addLog('info', 'User Created', `Created user ${userData.name}`, newUser.id);
    return newUser;
  }

  async updateUser(userData: UpdateUserRequest): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === userData.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...this.users[userIndex], ...userData };
    this.users[userIndex] = updatedUser;
    this.addLog('info', 'User Updated', `Updated user ${updatedUser.name}`, updatedUser.id);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.users[userIndex];
    this.users.splice(userIndex, 1);
    this.addLog('warning', 'User Deleted', `Deleted user ${user.name}`, userId);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    this.addLog('info', 'User Status Changed', 
      `User ${user.name} ${user.isActive ? 'activated' : 'deactivated'}`, userId);
    return user;
  }

  // Logs and Activities
  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return this.logs.slice(0, limit).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getUserActivities(limit: number = 100): Promise<UserActivity[]> {
    return this.activities.slice(0, limit).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private addLog(level: SystemLog['level'], action: string, details: string, userId?: string) {
    const log: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      action,
      userId,
      details,
      ipAddress: '192.168.1.100'
    };
    this.logs.unshift(log);
  }

  // System Health
  async getSystemHealth() {
    return {
      database: 'healthy' as const,
      api: 'healthy' as const,
      storage: 'warning' as const,
      memory: 'healthy' as const,
      cpu: 'healthy' as const
    };
  }

  // Permissions
  async validatePermission(userId: string, action: string, resource?: string): Promise<boolean> {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    // Other role-based permissions would be implemented here
    return false;
  }
}

export const adminService = new AdminService();