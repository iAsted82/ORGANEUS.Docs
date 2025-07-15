import React, { useState, useEffect } from 'react';
import { Users, FileText, Zap, HardDrive, TrendingUp, Settings, BookTemplate as Template, BarChart3, Brain, Clock, Target, Activity, Palette, Bell, Shield } from 'lucide-react';
import { OKATechMetrics, AIConfiguration, BranchSettings } from '../../services/okaTechService';
import { okaTechService } from '../../services/okaTechService';
import { MetricCard } from './MetricCard';
import { DashboardChart } from './DashboardChart';
import { OKATechUserManagement } from './OKATechUserManagement';
import { OKATechTemplateManager } from './OKATechTemplateManager';
import { OKATechAIConfig } from './OKATechAIConfig';
import { OKATechBranchSettings } from './OKATechBranchSettings';
import { OKATechAnalytics } from './OKATechAnalytics';

export const OKATechDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<OKATechMetrics | null>(null);
  const [aiChart, setAiChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, aiChartData] = await Promise.all([
        okaTechService.getMetrics(),
        okaTechService.getAIUsageChart()
      ]);
      
      setMetrics(metricsData);
      setAiChart(aiChartData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'templates', label: 'Templates OKA Tech', icon: Template },
    { id: 'ai-config', label: 'Configuration IA', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Paramètres Branche', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab metrics={metrics} aiChart={aiChart} />;
      case 'users':
        return <OKATechUserManagement />;
      case 'templates':
        return <OKATechTemplateManager />;
      case 'ai-config':
        return <OKATechAIConfig />;
      case 'analytics':
        return <OKATechAnalytics />;
      case 'settings':
        return <OKATechBranchSettings />;
      default:
        return <DashboardTab metrics={metrics} aiChart={aiChart} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Administration OKA Tech</h1>
              <p className="text-blue-100">Gestion de la branche technologique</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">OKA Tech Actif</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-300" />
              <span className="text-sm">IA Configurée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Utilisateurs OKA Tech"
            value={metrics.totalUsers}
            change={((metrics.activeUsers / metrics.totalUsers) * 100)}
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
            title="Appels IA"
            value={metrics.aiCallsToday.toLocaleString()}
            change={((metrics.aiCallsToday / metrics.aiCallsWeek) * 100)}
            trend="up"
            icon={Zap}
            color="bg-purple-500"
            subtitle={`${metrics.aiCallsWeek.toLocaleString()} cette semaine`}
          />
          <MetricCard
            title="Stockage"
            value={`${metrics.storageUsed} GB`}
            change={((metrics.storageUsed / metrics.storageLimit) * 100)}
            trend="up"
            icon={HardDrive}
            color="bg-amber-500"
            subtitle={`sur ${metrics.storageLimit} GB`}
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
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
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

const DashboardTab: React.FC<{ 
  metrics: OKATechMetrics | null;
  aiChart: any;
}> = ({ metrics, aiChart }) => {
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Usage IA par modèle (7 derniers jours)</h4>
          {aiChart && <DashboardChart data={aiChart} height={200} />}
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Métriques clés</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quota IA utilisé</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(metrics.aiQuotaUsed / metrics.aiQuotaLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((metrics.aiQuotaUsed / metrics.aiQuotaLimit) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Temps de réponse moyen</span>
              <span className="text-sm font-medium text-gray-900">{metrics.averageResponseTime}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Templates créés</span>
              <span className="text-sm font-medium text-gray-900">{metrics.templatesCreated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stockage utilisé</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.storageUsed}GB / {metrics.storageLimit}GB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Gestion Utilisateurs</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Gérer les membres de l'équipe OKA Tech, leurs rôles et permissions.
          </p>
          <button 
            onClick={() => {}} 
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Accéder
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Template className="h-6 w-6 text-amber-600" />
            <h4 className="font-semibold text-gray-900">Templates OKA Tech</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Créer et gérer les templates spécifiques à votre branche.
          </p>
          <button 
            onClick={() => {}} 
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Gérer
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-emerald-600" />
            <h4 className="font-semibold text-gray-900">Configuration IA</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configurer les paramètres IA pour votre équipe.
          </p>
          <button 
            onClick={() => {}} 
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Configurer
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Activité récente OKA Tech</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Nouveau document créé</p>
              <p className="text-xs text-gray-500">Marie Dubois - Contrat de développement - Il y a 2h</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Utilisateur ajouté</p>
              <p className="text-xs text-gray-500">Pierre Martin rejoint l'équipe - Il y a 1 jour</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Configuration IA mise à jour</p>
              <p className="text-xs text-gray-500">Modèle préféré changé vers Claude - Il y a 3 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};