import { User } from '../types/auth';
import { Document, Template } from '../types';

export interface OKATechMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  documentsToday: number;
  aiCallsToday: number;
  aiCallsWeek: number;
  storageUsed: number;
  storageLimit: number;
  aiQuotaUsed: number;
  aiQuotaLimit: number;
  templatesCreated: number;
  averageResponseTime: number;
}

export interface AIConfiguration {
  preferredModel: 'claude' | 'gpt4' | 'gemini';
  tokenLimit: number;
  temperature: number;
  enableAutoSuggestions: boolean;
  enableContextMemory: boolean;
}

export interface BranchSettings {
  branchName: string;
  displayName: string;
  color: string;
  logo?: string;
  description: string;
  contactEmail: string;
  enableNotifications: boolean;
  interfaceTheme: 'light' | 'dark' | 'auto';
  timezone: string;
}

export interface OKATechTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

class OKATechService {
  private metrics: OKATechMetrics = {
    totalUsers: 23,
    activeUsers: 18,
    totalDocuments: 1456,
    documentsToday: 34,
    aiCallsToday: 892,
    aiCallsWeek: 4567,
    storageUsed: 15.8,
    storageLimit: 100,
    aiQuotaUsed: 2340,
    aiQuotaLimit: 5000,
    templatesCreated: 12,
    averageResponseTime: 1.2
  };

  private aiConfig: AIConfiguration = {
    preferredModel: 'claude',
    tokenLimit: 4000,
    temperature: 0.7,
    enableAutoSuggestions: true,
    enableContextMemory: true
  };

  private branchSettings: BranchSettings = {
    branchName: 'OKA Tech',
    displayName: 'OKA Tech',
    color: '#2563eb',
    description: 'Société technologique spécialisée en solutions digitales',
    contactEmail: 'admin@okatech.com',
    enableNotifications: true,
    interfaceTheme: 'light',
    timezone: 'Europe/Paris'
  };

  private templates: OKATechTemplate[] = [
    {
      id: 'okatech-1',
      name: 'Contrat de développement',
      category: 'Juridique',
      description: 'Modèle de contrat pour projets de développement logiciel',
      content: 'Contrat de développement logiciel...',
      usageCount: 45,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      isActive: true
    },
    {
      id: 'okatech-2',
      name: 'Proposition technique',
      category: 'Commercial',
      description: 'Template pour propositions techniques clients',
      content: 'Proposition technique...',
      usageCount: 32,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      isActive: true
    },
    {
      id: 'okatech-3',
      name: 'Rapport d\'avancement',
      category: 'Gestion de projet',
      description: 'Rapport hebdomadaire d\'avancement projet',
      content: 'Rapport d\'avancement...',
      usageCount: 67,
      createdAt: '2024-01-05T08:30:00Z',
      updatedAt: '2024-01-22T11:20:00Z',
      isActive: true
    },
    {
      id: 'okatech-4',
      name: 'Documentation API',
      category: 'Technique',
      description: 'Template pour documentation d\'API REST',
      content: 'Documentation API...',
      usageCount: 23,
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-19T09:15:00Z',
      isActive: true
    },
    {
      id: 'okatech-5',
      name: 'Cahier des charges',
      category: 'Gestion de projet',
      description: 'Modèle de cahier des charges fonctionnel',
      content: 'Cahier des charges...',
      usageCount: 18,
      createdAt: '2024-01-08T16:30:00Z',
      updatedAt: '2024-01-21T13:45:00Z',
      isActive: true
    }
  ];

  private okaTechUsers: User[] = [
    {
      id: 'admin-oka',
      email: 'admin@okatech.com',
      name: 'Administrateur OKA Tech',
      role: 'admin',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: true,
      lastLogin: '2024-01-22T10:30:00Z'
    },
    {
      id: 'collab-oka-1',
      email: 'collaborateur@okatech.com',
      name: 'Marie Dubois',
      role: 'collaborator',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: true,
      lastLogin: '2024-01-21T16:45:00Z'
    },
    {
      id: 'collab-oka-2',
      email: 'pierre.martin@okatech.com',
      name: 'Pierre Martin',
      role: 'collaborator',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: true,
      lastLogin: '2024-01-22T08:20:00Z'
    },
    {
      id: 'collab-oka-3',
      email: 'sophie.bernard@okatech.com',
      name: 'Sophie Bernard',
      role: 'collaborator',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: false,
      lastLogin: '2024-01-15T12:10:00Z'
    }
  ];

  // Métriques et statistiques
  async getMetrics(): Promise<OKATechMetrics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.metrics;
  }

  async getAIUsageChart(): Promise<any> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Claude',
          data: [45, 52, 38, 67, 73, 58, 45],
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          fill: true
        },
        {
          label: 'GPT-4',
          data: [32, 41, 28, 45, 52, 38, 35],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        },
        {
          label: 'Gemini',
          data: [28, 35, 25, 38, 41, 32, 28],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        }
      ]
    };
  }

  // Gestion des utilisateurs OKA Tech
  async getOKATechUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.okaTechUsers;
  }

  async createOKATechUser(userData: Omit<User, 'id' | 'company'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      ...userData,
      id: `oka-user-${Date.now()}`,
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      }
    };
    this.okaTechUsers.push(newUser);
    return newUser;
  }

  async updateOKATechUser(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.okaTechUsers.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Utilisateur non trouvé');
    
    this.okaTechUsers[index] = { ...this.okaTechUsers[index], ...updates };
    return this.okaTechUsers[index];
  }

  async deleteOKATechUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.okaTechUsers.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Utilisateur non trouvé');
    this.okaTechUsers.splice(index, 1);
  }

  // Gestion des templates OKA Tech
  async getOKATechTemplates(): Promise<OKATechTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.templates;
  }

  async createOKATechTemplate(templateData: Omit<OKATechTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<OKATechTemplate> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTemplate: OKATechTemplate = {
      ...templateData,
      id: `okatech-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateOKATechTemplate(templateId: string, updates: Partial<OKATechTemplate>): Promise<OKATechTemplate> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.templates.findIndex(t => t.id === templateId);
    if (index === -1) throw new Error('Template non trouvé');
    
    this.templates[index] = { 
      ...this.templates[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.templates[index];
  }

  async deleteOKATechTemplate(templateId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.templates.findIndex(t => t.id === templateId);
    if (index === -1) throw new Error('Template non trouvé');
    this.templates.splice(index, 1);
  }

  // Configuration IA
  async getAIConfiguration(): Promise<AIConfiguration> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.aiConfig;
  }

  async updateAIConfiguration(config: Partial<AIConfiguration>): Promise<AIConfiguration> {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.aiConfig = { ...this.aiConfig, ...config };
    return this.aiConfig;
  }

  // Paramètres de branche
  async getBranchSettings(): Promise<BranchSettings> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.branchSettings;
  }

  async updateBranchSettings(settings: Partial<BranchSettings>): Promise<BranchSettings> {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.branchSettings = { ...this.branchSettings, ...settings };
    return this.branchSettings;
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      documentsByType: {
        'Contrat de développement': 45,
        'Proposition technique': 32,
        'Rapport d\'avancement': 67,
        'Documentation API': 23,
        'Cahier des charges': 18
      },
      aiModelUsage: {
        'Claude': 1250,
        'GPT-4': 890,
        'Gemini': 720
      },
      weeklyActivity: [
        { day: 'Lun', documents: 12, aiCalls: 145 },
        { day: 'Mar', documents: 18, aiCalls: 189 },
        { day: 'Mer', documents: 15, aiCalls: 156 },
        { day: 'Jeu', documents: 22, aiCalls: 223 },
        { day: 'Ven', documents: 19, aiCalls: 178 },
        { day: 'Sam', documents: 8, aiCalls: 89 },
        { day: 'Dim', documents: 5, aiCalls: 45 }
      ]
    };
  }
}

export const okaTechService = new OKATechService();