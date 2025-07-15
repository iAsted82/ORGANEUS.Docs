import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import { SystemAlert } from '../../services/dashboardService';
import { dashboardService } from '../../services/dashboardService';

export const SystemAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertsData = await dashboardService.getSystemAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await dashboardService.markAlertAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      await dashboardService.dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Alertes système</h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {alerts.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showAll ? 'Voir moins' : 'Voir tout'}
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {displayedAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-600">Tous les systèmes fonctionnent normalement</p>
          </div>
        ) : (
          displayedAlerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !alert.isRead ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                    <AlertIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${
                        !alert.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {alert.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 pr-4">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Marquer comme lu
                        </button>
                      )}
                      {alert.action && (
                        <button
                          onClick={alert.action.onClick}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          {alert.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};