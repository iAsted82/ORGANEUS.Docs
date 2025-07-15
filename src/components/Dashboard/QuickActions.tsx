import React from 'react';
import { Plus, FileText, Star, Clock, Archive, Users, Settings } from 'lucide-react';

interface QuickActionsProps {
  onCreateDocument: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onCreateDocument }) => {
  const actions = [
    {
      label: 'Nouveau document',
      icon: Plus,
      onClick: onCreateDocument,
      color: 'bg-blue-600 hover:bg-blue-700',
      primary: true
    },
    {
      label: 'Mes documents',
      icon: FileText,
      onClick: () => console.log('Naviguer vers mes documents'),
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      label: 'Favoris',
      icon: Star,
      onClick: () => console.log('Naviguer vers favoris'),
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      label: 'Récents',
      icon: Clock,
      onClick: () => console.log('Naviguer vers récents'),
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-white ${action.color} ${
                action.primary ? 'shadow-lg' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};