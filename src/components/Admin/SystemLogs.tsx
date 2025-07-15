import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  Clock,
  User,
  Globe
} from 'lucide-react';
import { SystemLog } from '../../types/admin';
import { adminService } from '../../services/adminService';

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadLogs();
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(loadLogs, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    filterLogs();
  }, [logs, filterLevel, searchTerm]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const systemLogs = await adminService.getSystemLogs(200);
      setLogs(systemLogs);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const getLevelIcon = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'critical': return XCircle;
      default: return CheckCircle;
    }
  };

  const getLevelColor = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Action', 'User', 'Details', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.action,
        log.userName || '',
        log.details,
        log.ipAddress || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Logs système</h3>
          <p className="text-sm text-gray-600">Surveillance des événements et erreurs système</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Actualisation auto' : 'Actualiser'}</span>
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les niveaux</option>
            <option value="info">Info</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
            <option value="critical">Critique</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['info', 'warning', 'error', 'critical'].map((level) => {
          const count = logs.filter(log => log.level === level).length;
          const Icon = getLevelIcon(level as SystemLog['level']);
          
          return (
            <div key={level} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{level}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-lg ${getLevelColor(level as SystemLog['level'])}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">
            Logs récents ({filteredLogs.length})
          </h4>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => {
                  const LevelIcon = getLevelIcon(log.level);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          <LevelIcon className="h-3 w-3 mr-1" />
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.userName ? (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{log.userName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Système</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{log.details}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.ipAddress ? (
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{log.ipAddress}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredLogs.length === 0 && !loading && (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun log trouvé</h3>
            <p className="text-gray-600">Aucun log ne correspond à vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};