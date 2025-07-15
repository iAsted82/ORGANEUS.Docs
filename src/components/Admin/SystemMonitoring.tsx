import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Monitor, 
  Cpu,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Square,
  RotateCcw
} from 'lucide-react';
import { SystemHealth } from '../../types/admin';
import { dashboardService } from '../../services/dashboardService';

export const SystemMonitoring: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    memory: 'healthy',
    cpu: 'healthy'
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadSystemHealth();
    const interval = setInterval(loadSystemHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      setLoading(true);
      const health = await dashboardService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état système:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemAction = async (action: string) => {
    setActionLoading(action);
    try {
      let success = false;
      
      switch (action) {
        case 'restart':
          success = await dashboardService.restartService('all');
          break;
        case 'cache':
          success = await dashboardService.clearCache();
          break;
        case 'backup':
          success = await dashboardService.backupDatabase();
          break;
        case 'optimize':
          success = await dashboardService.optimizeDatabase();
          break;
      }
      
      if (success) {
        await loadSystemHealth();
        // Afficher un message de succès
        console.log(`Action ${action} réussie`);
      } else {
        console.error(`Action ${action} échouée`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const services = [
    {
      name: 'Base de données',
      key: 'database' as keyof SystemHealth,
      icon: Database,
      description: 'PostgreSQL principal'
    },
    {
      name: 'API',
      key: 'api' as keyof SystemHealth,
      icon: Wifi,
      description: 'Services web'
    },
    {
      name: 'Stockage',
      key: 'storage' as keyof SystemHealth,
      icon: HardDrive,
      description: 'Système de fichiers'
    },
    {
      name: 'Mémoire',
      key: 'memory' as keyof SystemHealth,
      icon: Monitor,
      description: 'RAM système'
    },
    {
      name: 'CPU',
      key: 'cpu' as keyof SystemHealth,
      icon: Cpu,
      description: 'Processeur'
    }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const getHealthLabel = (status: string) => {
    switch (status) {
      case 'healthy': return 'Sain';
      case 'warning': return 'Attention';
      case 'critical': return 'Critique';
      default: return 'Inconnu';
    }
  };

  const overallHealth = Object.values(systemHealth).every(status => status === 'healthy') 
    ? 'healthy' 
    : Object.values(systemHealth).some(status => status === 'critical') 
      ? 'critical' 
      : 'warning';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Server className="h-6 w-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monitoring système</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${
                  overallHealth === 'healthy' ? 'bg-green-500' : 
                  overallHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {overallHealth === 'healthy' ? 'Tous les systèmes opérationnels' : 
                   overallHealth === 'warning' ? 'Attention requise' : 'Problème critique'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={loadSystemHealth}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {services.map((service) => {
            const ServiceIcon = service.icon;
            const status = systemHealth[service.key];
            const HealthIcon = getHealthIcon(status);
            
            return (
              <div key={service.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ServiceIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${getHealthColor(status)}`}>
                    <HealthIcon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getHealthColor(status)}`}>
                    {getHealthLabel(status)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSystemAction('restart')}
                      disabled={actionLoading === 'restart'}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Redémarrer le service"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Actions système</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => handleSystemAction('cache')}
              disabled={actionLoading === 'cache'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {actionLoading === 'cache' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Vider cache</span>
            </button>
            
            <button
              onClick={() => handleSystemAction('backup')}
              disabled={actionLoading === 'backup'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {actionLoading === 'backup' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              <span>Sauvegarder</span>
            </button>
            
            <button
              onClick={() => handleSystemAction('optimize')}
              disabled={actionLoading === 'optimize'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {actionLoading === 'optimize' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Cpu className="h-4 w-4" />
              )}
              <span>Optimiser</span>
            </button>
            
            <button
              onClick={() => handleSystemAction('restart')}
              disabled={actionLoading === 'restart'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {actionLoading === 'restart' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              <span>Redémarrer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};