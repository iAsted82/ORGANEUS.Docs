import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Users, 
  FileText,
  Zap,
  Database,
  TrendingUp,
  DollarSign,
  Activity,
  Server,
  HardDrive,
  Settings,
  Key,
  Image,
  BarChart3
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { APIKeysManager } from './APIKeysManager';
import { LogoManager } from './LogoManager';
import { SystemSettings } from './SystemSettings';
import { SystemLogs } from './SystemLogs';
import { UserActivities } from './UserActivities';
import { MetricCard } from './MetricCard';
import { DashboardChart } from './DashboardChart';
import { SystemAlerts } from './SystemAlerts';
import { SystemMonitoring } from './SystemMonitoring';
import { APIKeysDashboard } from './APIKeysDashboard';
import { TopEntities } from './TopEntities';
import { DashboardMetrics, ChartData } from '../../services/dashboardService';
import { dashboardService } from '../../services/dashboardService';

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [documentsChart, setDocumentsChart] = useState<ChartData | null>(null);
  const [apiChart, setApiChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, docChart, apiChartData] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getDocumentsChart(),
        dashboardService.getApiUsageChart()
      ]);
      
      setMetrics(metricsData);
      setDocumentsChart(docChart);
      setApiChart(apiChartData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab metrics={metrics} documentsChart={documentsChart} apiChart={apiChart} />;
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
        return <OverviewTab metrics={metrics} documentsChart={documentsChart} apiChart={apiChart} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
              <p className="text-purple-100">Tableau de bord complet de la plateforme</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Système opérationnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-green-300" />
              <span className="text-sm">Sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Utilisateurs totaux"
            value={metrics.totalUsers}
            change={((metrics.newUsersToday / metrics.totalUsers) * 100)}
            trend="up"
            icon={Users}
            color="bg-blue-500"
            subtitle={`${metrics.activeUsers} actifs`}
          />
          <MetricCard
            title="Documents"
            value={metrics.totalDocuments.toLocaleString()}
            change={((metrics.documentsToday / metrics.totalDocuments) * 100)}
            trend="up"
            icon={FileText}
            color="bg-green-500"
            subtitle={`+${metrics.documentsToday} aujourd'hui`}
          />
          <MetricCard
            title="Appels API"
            value={metrics.apiCallsToday.toLocaleString()}
            change={15.3}
            trend="up"
            icon={Zap}
            color="bg-purple-500"
            subtitle="Aujourd'hui"
          />
          <MetricCard
            title="Stockage"
            value={`${metrics.storageUsed} GB`}
            change={((metrics.storageUsed / metrics.storageTotal) * 100)}
            trend="up"
            icon={HardDrive}
            color="bg-amber-500"
            subtitle={`sur ${metrics.storageTotal} GB`}
          />
        </div>
      )}

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

const OverviewTab: React.FC<{ 
  metrics: DashboardMetrics | null;
  documentsChart: ChartData | null;
  apiChart: ChartData | null;
}> = ({ metrics, documentsChart, apiChart }) => {
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Documents créés (7 derniers jours)</h4>
              {documentsChart && <DashboardChart data={documentsChart} height={200} />}
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Usage API (24h)</h4>
              {apiChart && <DashboardChart data={apiChart} height={200} />}
            </div>
          </div>

          {/* System Monitoring */}
          <SystemMonitoring />
        </div>

        {/* API Keys Dashboard */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vue d'ensemble des clés API</h4>
          <APIKeysDashboard />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Alerts */}
          <SystemAlerts />

          {/* Performance Overview */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Performance système</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temps de réponse</span>
                <span className="text-sm font-medium text-gray-900">{metrics.averageResponseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taux d'erreur</span>
                <span className="text-sm font-medium text-gray-900">{metrics.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-green-600">{metrics.uptime}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bande passante</span>
                <span className="text-sm font-medium text-gray-900">
                  {metrics.bandwidthUsed}GB / {metrics.bandwidthTotal}GB
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Revenus</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {metrics.revenue.toLocaleString()}€
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{metrics.revenueGrowth}%
                  </span>
                  <span className="text-xs text-gray-500">vs mois précédent</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${Math.min((metrics.revenue / 20000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Objectif mensuel: 20,000€
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Entities */}
      <TopEntities />
    </div>
  );
};