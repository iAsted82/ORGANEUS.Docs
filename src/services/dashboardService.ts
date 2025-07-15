import { AdminStats, SystemHealth, UserActivity, SystemLog } from '../types/admin';

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalDocuments: number;
  documentsToday: number;
  documentsThisWeek: number;
  documentsThisMonth: number;
  apiCallsToday: number;
  apiCallsThisWeek: number;
  apiCallsThisMonth: number;
  storageUsed: number;
  storageTotal: number;
  bandwidthUsed: number;
  bandwidthTotal: number;
  activeCompanies: number;
  totalCompanies: number;
  errorRate: number;
  averageResponseTime: number;
  uptime: number;
  revenue: number;
  revenueGrowth: number;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface TopCompany {
  id: string;
  name: string;
  users: number;
  documents: number;
  apiCalls: number;
  revenue: number;
  growth: number;
}

export interface TopUser {
  id: string;
  name: string;
  email: string;
  company: string;
  documentsCreated: number;
  lastActive: string;
  role: string;
}

class DashboardService {
  private metrics: DashboardMetrics = {
    totalUsers: 234,
    activeUsers: 189,
    newUsersToday: 12,
    totalDocuments: 15678,
    documentsToday: 45,
    documentsThisWeek: 312,
    documentsThisMonth: 1245,
    apiCallsToday: 2340,
    apiCallsThisWeek: 15620,
    apiCallsThisMonth: 68450,
    storageUsed: 2.4,
    storageTotal: 100,
    bandwidthUsed: 145.6,
    bandwidthTotal: 1000,
    activeCompanies: 8,
    totalCompanies: 12,
    errorRate: 0.02,
    averageResponseTime: 245,
    uptime: 99.98,
    revenue: 15750.00,
    revenueGrowth: 23.5
  };

  private alerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Usage API élevé',
      message: 'L\'API OpenAI approche de la limite quotidienne (85% utilisée)',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouvelle mise à jour',
      message: 'Une nouvelle version est disponible avec des améliorations de performance',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Sauvegarde réussie',
      message: 'Sauvegarde automatique des données terminée avec succès',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true
    }
  ];

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Simulation d'API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.metrics;
  }

  async getSystemHealth(): Promise<SystemHealth> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      database: Math.random() > 0.1 ? 'healthy' : 'warning',
      api: Math.random() > 0.05 ? 'healthy' : 'warning',
      storage: this.metrics.storageUsed > 80 ? 'warning' : 'healthy',
      memory: Math.random() > 0.1 ? 'healthy' : 'warning',
      cpu: Math.random() > 0.15 ? 'healthy' : 'warning'
    };
  }

  async getSystemAlerts(): Promise<SystemAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.alerts;
  }

  async getDocumentsChart(): Promise<ChartData> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Documents créés',
          data: [45, 52, 38, 67, 73, 58, 45],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        }
      ]
    };
  }

  async getApiUsageChart(): Promise<ChartData> {
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      return `${i}h`;
    });

    return {
      labels: last24Hours,
      datasets: [
        {
          label: 'Appels API',
          data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200) + 50),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ]
    };
  }

  async getTopCompanies(): Promise<TopCompany[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 'organeus',
        name: 'ORGANEUS',
        users: 45,
        documents: 2340,
        apiCalls: 12500,
        revenue: 5200.00,
        growth: 34.5
      },
      {
        id: 'oka-tech',
        name: 'OKA Tech',
        users: 38,
        documents: 1890,
        apiCalls: 9800,
        revenue: 3800.00,
        growth: 28.2
      },
      {
        id: 'coursi',
        name: 'COURSI',
        users: 29,
        documents: 1456,
        apiCalls: 7200,
        revenue: 2900.00,
        growth: 15.8
      }
    ];
  }

  async getTopUsers(): Promise<TopUser[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [
      {
        id: '1',
        name: 'Alice Dupont',
        email: 'alice@organeus.com',
        company: 'ORGANEUS',
        documentsCreated: 156,
        lastActive: new Date().toISOString(),
        role: 'admin'
      },
      {
        id: '2',
        name: 'Bob Martin',
        email: 'bob@okatech.com',
        company: 'OKA Tech',
        documentsCreated: 132,
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        role: 'collaborator'
      },
      {
        id: '3',
        name: 'Claire Rousseau',
        email: 'claire@coursi.com',
        company: 'COURSI',
        documentsCreated: 98,
        lastActive: new Date(Date.now() - 7200000).toISOString(),
        role: 'admin'
      }
    ];
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  async dismissAlert(alertId: string): Promise<void> {
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  // Méthodes pour simuler des actions d'administration
  async restartService(serviceName: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.1; // 90% de succès
  }

  async clearCache(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async backupDatabase(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return Math.random() > 0.05; // 95% de succès
  }

  async optimizeDatabase(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return Math.random() > 0.1; // 90% de succès
  }
}

export const dashboardService = new DashboardService();