import React from 'react';
import { FileText, Users, Clock, TrendingUp, Zap, Star } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentDocuments } from './RecentDocuments';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Documents créés',
      value: '47',
      change: '+12% ce mois',
      trend: 'up' as const,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Templates utilisés',
      value: '23',
      change: '+5% ce mois',
      trend: 'up' as const,
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: 'Temps gagné',
      value: '12h',
      change: '+8% ce mois',
      trend: 'up' as const,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'IA utilisée',
      value: '156',
      change: '+28% ce mois',
      trend: 'up' as const,
      icon: Zap,
      color: 'bg-amber-500'
    }
  ];

  const recentDocuments = [
    {
      id: '1',
      title: 'Contrat de prestation - Client ABC',
      type: 'Contrat',
      lastModified: 'Il y a 2 heures',
      status: 'draft' as const,
      isFavorite: true
    },
    {
      id: '2',
      title: 'Facture #2024-001',
      type: 'Facture',
      lastModified: 'Il y a 4 heures',
      status: 'final' as const,
      isFavorite: false
    },
    {
      id: '3',
      title: 'Rapport mensuel janvier',
      type: 'Rapport',
      lastModified: 'Hier',
      status: 'sent' as const,
      isFavorite: true
    },
    {
      id: '4',
      title: 'Lettre de recommandation',
      type: 'Lettre',
      lastModified: 'Il y a 2 jours',
      status: 'final' as const,
      isFavorite: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
        <p className="text-gray-600">Bienvenue dans votre espace de travail ORGANEUS Docs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDocuments 
          documents={recentDocuments} 
          onDocumentClick={(doc) => console.log('Document clicked:', doc)}
        />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Document généré avec succès</p>
                <p className="text-xs text-gray-500">Il y a 30 minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">IA utilisée pour améliorer le texte</p>
                <p className="text-xs text-gray-500">Il y a 1 heure</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau template créé</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};