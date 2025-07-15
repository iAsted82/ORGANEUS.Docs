import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Brain, 
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { okaTechService } from '../../services/okaTechService';
import { DashboardChart } from './DashboardChart';

export const OKATechAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await okaTechService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analytics) return;
    
    const csvData = [
      ['Métrique', 'Valeur'],
      ...Object.entries(analytics.documentsByType).map(([key, value]) => [key, value]),
      ['', ''],
      ['Modèle IA', 'Utilisation'],
      ...Object.entries(analytics.aiModelUsage).map(([key, value]) => [key, value])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oka_tech_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const weeklyChart = analytics ? {
    labels: analytics.weeklyActivity.map((item: any) => item.day),
    datasets: [
      {
        label: 'Documents',
        data: analytics.weeklyActivity.map((item: any) => item.documents),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Appels IA',
        data: analytics.weeklyActivity.map((item: any) => item.aiCalls),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      }
    ]
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics OKA Tech</h2>
          <p className="text-gray-600">Métriques et performances de votre branche</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
          <button
            onClick={exportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Documents créés</p>
              <p className="text-2xl font-bold text-blue-900">
                {analytics ? Object.values(analytics.documentsByType).reduce((a: any, b: any) => a + b, 0) : 0}
              </p>
              <p className="text-xs text-blue-700">+15% vs semaine dernière</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Appels IA</p>
              <p className="text-2xl font-bold text-purple-900">
                {analytics ? Object.values(analytics.aiModelUsage).reduce((a: any, b: any) => a + b, 0) : 0}
              </p>
              <p className="text-xs text-purple-700">+8% vs semaine dernière</p>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Efficacité</p>
              <p className="text-2xl font-bold text-green-900">87%</p>
              <p className="text-xs text-green-700">+3% vs semaine dernière</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Temps moyen</p>
              <p className="text-2xl font-bold text-amber-900">1.2s</p>
              <p className="text-xs text-amber-700">-0.3s vs semaine dernière</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité hebdomadaire</h3>
          {weeklyChart && <DashboardChart data={weeklyChart} height={300} />}
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents par type</h3>
          <div className="space-y-3">
            {analytics && Object.entries(analytics.documentsByType).map(([type, count]: [string, any]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(analytics.documentsByType))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Usage */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des modèles IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics && Object.entries(analytics.aiModelUsage).map(([model, usage]: [string, any]) => (
            <div key={model} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{model}</h4>
                <span className="text-lg font-bold text-gray-900">{usage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    model === 'Claude' ? 'bg-orange-500' : 
                    model === 'GPT-4' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(usage / Math.max(...Object.values(analytics.aiModelUsage))) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((usage / Object.values(analytics.aiModelUsage).reduce((a: any, b: any) => a + b, 0)) * 100)}% du total
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};