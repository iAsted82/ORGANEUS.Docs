import React from 'react';
import { 
  FileText, 
  FolderOpen, 
  Star, 
  Clock, 
  Archive, 
  Plus, 
  BarChart3,
  Users,
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onViewChange }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'documents', label: 'Mes Documents', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FolderOpen },
    { id: 'recent', label: 'Récents', icon: Clock },
    { id: 'favorites', label: 'Favoris', icon: Star },
    { id: 'archived', label: 'Archivés', icon: Archive },
  ];

  const bottomItems = [
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // Ajouter l'administration pour les super admins
  if (user?.role === 'super_admin') {
    bottomItems.unshift({ id: 'admin', label: 'Administration', icon: Shield });
  }

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    } flex flex-col`}>
      <div className="p-4">
        <button
          onClick={() => onViewChange('create')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          {isOpen && <span className="font-medium">Nouveau Document</span>}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {isOpen && item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-4 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {isOpen && item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};