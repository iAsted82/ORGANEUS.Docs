import React from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Clock,
  Brain,
  Database,
  Plus,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { knowledgeBaseService } from '../../services/knowledgeBaseService';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const knowledgeDocsCount = knowledgeBaseService.getAllDocuments().length;

  const stats = [
    {
      label: 'Documents créés',
      value: '156',
      change: '+12%',
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Base de connaissance',
      value: knowledgeDocsCount.toString(),
      change: 'documents',
      icon: Database,
      color: 'green'
    },
    {
      label: 'Générations IA',
      value: '47',
      change: 'ce mois',
      icon: Brain,
      color: 'purple'
    },
    {
      label: 'Temps économisé',
      value: '24h',
      change: 'cette semaine',
      icon: Clock,
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      title: 'Créer un document',
      description: 'Commencez un nouveau document',
      icon: Plus,
      color: 'blue',
      action: 'create'
    },
    {
      title: 'Base de connaissance',
      description: 'Gérez vos documents de référence',
      icon: Database,
      color: 'green',
      action: 'knowledge'
    },
    {
      title: 'Templates',
      description: 'Parcourez les modèles',
      icon: FileText,
      color: 'purple',
      action: 'templates'
    },
    {
      title: 'Documents récents',
      description: 'Accédez à vos derniers travaux',
      icon: Clock,
      color: 'orange',
      action: 'recent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour {user?.name} 👋
        </h1>
        <p className="text-blue-100">
          Bienvenue sur ORGANEUS Docs. Que souhaitez-vous créer aujourd'hui ?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          };
          
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.change.includes('+') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-pink-500',
              orange: 'from-orange-500 to-orange-600'
            };
            
            return (
              <button
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[action.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="space-y-4">
          {[
            { action: 'Document créé', item: 'Contrat de service 2024', time: 'Il y a 2 heures' },
            { action: 'Fichier uploadé', item: 'Rapport annuel.pdf', time: 'Il y a 5 heures' },
            { action: 'IA utilisée', item: 'Génération lettre commerciale', time: 'Hier' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.item}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};