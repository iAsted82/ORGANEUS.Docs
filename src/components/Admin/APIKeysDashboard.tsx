import React, { useState, useEffect } from 'react';
import { 
  Key, 
  TrendingUp, 
  Shield, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Globe,
  Clock,
  BarChart3
} from 'lucide-react';
import { apiKeyService } from '../../services/apiKeyService';

export const APIKeysDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const usageStats = await apiKeyService.getUsageStats();
      setStats(usageStats);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600">Impossible de charger les statistiques</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total des clés</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalKeys}</p>
              <p className="text-xs text-blue-700">{stats.activeKeys} actives</p>
            </div>
            <Key className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Utilisation totale</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalUsage.toLocaleString()}</p>
              <p className="text-xs text-green-700">appels API</p>
            </div>
            <Zap className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Ce mois</p>
              <p className="text-2xl font-bold text-purple-900">{stats.monthlyUsage.toLocaleString()}</p>
              <p className="text-xs text-purple-700">appels API</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Statut</p>
              <p className="text-2xl font-bold text-amber-900">
                {Math.round((stats.activeKeys / stats.totalKeys) * 100)}%
              </p>
              <p className="text-xs text-amber-700">clés actives</p>
            </div>
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Providers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par fournisseur
          </h3>
          <div className="space-y-3">
            {stats.topProviders.map((provider: any, index: number) => (
              <div key={provider.provider} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    provider.provider === 'anthropic' ? 'bg-orange-100' :
                    provider.provider === 'openai' ? 'bg-green-100' :
                    provider.provider === 'gemini' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-sm font-medium">
                      {provider.provider === 'anthropic' ? '🤖' :
                       provider.provider === 'openai' ? '🧠' :
                       provider.provider === 'gemini' ? '💎' : '🔑'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{provider.provider}</h4>
                    <p className="text-sm text-gray-500">{provider.count} clé{provider.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        provider.provider === 'anthropic' ? 'bg-orange-500' :
                        provider.provider === 'openai' ? 'bg-green-500' :
                        provider.provider === 'gemini' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(provider.count / stats.totalKeys) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {Math.round((provider.count / stats.totalKeys) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité récente
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.success 
                    ? activity.action === 'created' ? 'bg-green-100 text-green-600' :
                      activity.action === 'updated' ? 'bg-blue-100 text-blue-600' :
                      activity.action === 'used' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {activity.action === 'created' && <Key className="h-4 w-4" />}
                  {activity.action === 'updated' && <Shield className="h-4 w-4" />}
                  {activity.action === 'used' && <Zap className="h-4 w-4" />}
                  {activity.action === 'validated' && <CheckCircle className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.keyName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.action} • {new Date(activity.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {activity.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">État de sécurité</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Chiffrement</h4>
            </div>
            <p className="text-sm text-gray-600">
              Toutes les clés sont chiffrées avec AES-256
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Monitoring</h4>
            </div>
            <p className="text-sm text-gray-600">
              Toutes les activités sont loggées et auditées
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Accès contrôlé</h4>
            </div>
            <p className="text-sm text-gray-600">
              Seuls les super admins peuvent gérer les clés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};