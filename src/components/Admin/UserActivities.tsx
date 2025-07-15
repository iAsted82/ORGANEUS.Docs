import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  FileText, 
  Search, 
  Filter,
  Clock,
  Globe,
  RefreshCw,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import { UserActivity } from '../../types/admin';
import { adminService } from '../../services/adminService';

export const UserActivities: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadActivities();
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(loadActivities, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedUser, selectedAction]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const userActivities = await adminService.getUserActivities(200);
      setActivities(userActivities);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (selectedUser !== 'all') {
      filtered = filtered.filter(activity => activity.userId === selectedUser);
    }

    if (selectedAction !== 'all') {
      filtered = filtered.filter(activity => activity.action === selectedAction);
    }

    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document created':
      case 'document updated':
      case 'document deleted':
        return FileText;
      case 'user login':
      case 'user logout':
        return User;
      default:
        return Activity;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document created':
        return 'text-green-600 bg-green-100';
      case 'document updated':
        return 'text-blue-600 bg-blue-100';
      case 'document deleted':
        return 'text-red-600 bg-red-100';
      case 'user login':
        return 'text-green-600 bg-green-100';
      case 'user logout':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-purple-600 bg-purple-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportActivities = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address'].join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.userName,
        activity.action,
        activity.resource || '',
        activity.details || '',
        activity.ipAddress || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_activities_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueUsers = [...new Set(activities.map(a => a.userName))];
  const uniqueActions = [...new Set(activities.map(a => a.action))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activités utilisateurs</h3>
          <p className="text-sm text-gray-600">Surveillance des actions des utilisateurs sur la plateforme</p>
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
            onClick={exportActivities}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les utilisateurs</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Toutes les actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Dernières 24h</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total activités</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documents créés</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.action === 'Document Created').length}
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connexions</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.action === 'User Login').length}
              </p>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Eye className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">
            Activités récentes ({filteredActivities.length})
          </h4>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des activités...</p>
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
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ressource
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
                {filteredActivities.map((activity) => {
                  const ActionIcon = getActionIcon(activity.action);
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {activity.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{activity.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                          <ActionIcon className="h-3 w-3 mr-1" />
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{activity.resource || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{activity.details || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activity.ipAddress ? (
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{activity.ipAddress}</span>
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

        {filteredActivities.length === 0 && !loading && (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
            <p className="text-gray-600">Aucune activité ne correspond à vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};