export interface APIKey {
  id: string;
  name: string;
  service: 'anthropic' | 'openai' | 'gemini';
  key: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usage: number;
  limit: number;
}

export interface SystemSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  emailNotifications: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  sessionTimeout: number;
  apiRateLimit: number;
  enableAnalytics: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  action: string;
  userId?: string;
  userName?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  resource?: string;
  details?: string;
  ipAddress?: string;
}

export interface AdminStats {
  totalDocuments: number;
  documentsToday: number;
  apiCallsToday: number;
  storageUsed: number;
  storageLimit: number;
  activeCompanies: number;
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  api: 'healthy' | 'warning' | 'critical';
  storage: 'healthy' | 'warning' | 'critical';
  memory: 'healthy' | 'warning' | 'critical';
  cpu: 'healthy' | 'warning' | 'critical';
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: 'super_admin' | 'admin' | 'collaborator';
  companyId: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  name?: string;
  role?: 'super_admin' | 'admin' | 'collaborator';
  companyId?: string;
  isActive?: boolean;
}