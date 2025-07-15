import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Users, 
  Settings, 
  Key, 
  Image, 
  BarChart3, 
  Shield, 
  Activity,
  Database,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Server,
  Monitor,
  HardDrive,
  Cpu,
  Wifi
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { APIKeysManager } from './APIKeysManager';
import { LogoManager } from './LogoManager';
import { SystemSettings } from './SystemSettings';
import { SystemLogs } from './SystemLogs';
import { UserActivities } from './UserActivities';
import { AdminStats, SystemHealth } from '../../types/admin';
import { adminService } from '../../services/adminService';

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalDocuments: 45672,
    documentsToday: 234,
    apiCallsToday: 1456,
    storageUsed: 2.4,
    storageLimit: 100,
    activeCompanies: 5,
    totalUsers: 156,
    activeUsers: 142,
    newUsersToday: 8,
    systemHealth: 'healthy'
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'warning',
    memory: 'healthy',
    cpu: 'healthy'
  });

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const health = await adminService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Erreur lors du chargement des données système:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'apikeys', label: 'Clés API', icon: Key },
    { id: 'logo', label: 'Logo', icon: Image },
    { id: 'logs', label: 'Logs Système', icon: FileText },
    { id: 'activities', label: 'Activités', icon: Activity },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} systemHealth={systemHealth} />;
      case 'users':
        return <UserManagement />;
      case 'apikeys':
        return <APIKeysManager />;
      case 'logo':
        return <LogoManager />;
      case 'logs':
        return <SystemLogs />;
      case 'activities':
        return <UserActivities />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OverviewTab stats={stats} systemHealth={systemHealth} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Super Administration ORGANEUS</h1>
              <p className="text-purple-100">Gestion complète de la plateforme</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Système opérationnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-300" />
              <span className="text-sm">Sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documents totaux</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.documentsToday} aujourd'hui</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-blue-600">{stats.activeUsers} actifs</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appels API</p>
              <p className="text-2xl font-bold text-gray-900">{stats.apiCallsToday.toLocaleString()}</p>
              <p className="text-sm text-blue-600">Aujourd'hui</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stockage</p>
              <p className="text-2xl font-bold text-gray-900">{stats.storageUsed} GB</p>
              <p className="text-sm text-gray-600">sur {stats.storageLimit} GB</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <HardDrive className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ stats: AdminStats; systemHealth: SystemHealth }> = ({ stats, systemHealth }) => {
  const healthItems = [
    { name: 'Base de données', status: systemHealth.database, icon: Database },
    { name: 'API', status: systemHealth.api, icon: Wifi },
    { name: 'Stockage', status: systemHealth.storage, icon: HardDrive },
    { name: 'Mémoire', status: systemHealth.memory, icon: Monitor },
    { name: 'CPU', status: systemHealth.cpu, icon: Cpu }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Server className="h-5 w-5 text-blue-600" />
            <span>État du système</span>
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {healthItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getHealthBg(item.status)}`}>
                      <Icon className={`h-4 w-4 ${getHealthColor(item.status)}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'healthy' ? 'Sain' : 
                     item.status === 'warning' ? 'Attention' : 'Critique'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span>Activité récente</span>
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Nouveau utilisateur inscrit</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Il y a 5 min</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Document généré via API</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Il y a 12 min</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">Configuration mise à jour</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Il y a 1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Performances aujourd'hui</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
              <span className="text-sm font-medium text-green-600">+{stats.newUsersToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Documents créés</span>
              <span className="text-sm font-medium text-blue-600">+{stats.documentsToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Appels API</span>
              <span className="text-sm font-medium text-purple-600">{stats.apiCallsToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Usage des ressources</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Stockage</span>
                <span className="text-sm font-medium">{stats.storageUsed}GB / {stats.storageLimit}GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(stats.storageUsed / stats.storageLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                <span className="text-sm font-medium">{stats.activeUsers} / {stats.totalUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Actions rapides</h4>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Gérer les utilisateurs</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Key className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Configurer les API</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Paramètres système</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};