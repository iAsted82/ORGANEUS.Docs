import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Archive,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { DocumentStats } from '../../services/documentService';
import { documentService } from '../../services/documentService';
import { StatsCard } from './StatsCard';
import { RecentDocuments } from './RecentDocuments';
import { QuickActions } from './QuickActions';
import { ActivityFeed } from './ActivityFeed';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const documentStats = await documentService.getDocumentStats();
      setStats(documentStats);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = () => {
    // Cette fonction sera appelée depuis le parent
    console.log('Création d\'un nouveau document');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600">Impossible de charger les données du dashboard</p>
        <button 
          onClick={loadDashboardData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toString(),
      change: `+${stats.documentsThisMonth} ce mois`,
      trend: 'up' as const,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Favoris',
      value: stats.favoriteCount.toString(),
      change: 'Documents marqués',
      trend: 'neutral' as const,
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Cette semaine',
      value: stats.documentsThisWeek.toString(),
      change: `+${stats.documentsToday} aujourd'hui`,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Archivés',
      value: stats.archivedCount.toString(),
      change: 'Documents archivés',
      trend: 'neutral' as const,
      icon: Archive,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
        <p className="text-gray-600">Bienvenue dans votre espace de travail ORGANEUS Docs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <RecentDocuments />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions onCreateDocument={handleCreateDocument} />

          {/* Activity Feed */}
          <ActivityFeed activities={stats.recentActivity} />

          {/* Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État des documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Brouillons</span>
                <span className="text-sm font-medium text-yellow-600">{stats.draftCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Finalisés</span>
                <span className="text-sm font-medium text-green-600">{stats.finalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Envoyés</span>
                <span className="text-sm font-medium text-blue-600">{stats.sentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Archivés</span>
                <span className="text-sm font-medium text-gray-600">{stats.archivedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};