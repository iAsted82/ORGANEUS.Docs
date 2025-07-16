import React from 'react';
import {
  Home,
  FileText,
  FolderOpen,
  Star,
  Archive,
  Clock,
  Plus,
  Shield,
  ChevronDown,
  ChevronRight,
  Brain,
  Building2,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onViewChange }) => {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['documents']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      section: 'main'
    },
    {
      id: 'create',
      label: 'Créer un document',
      icon: Plus,
      section: 'main',
      highlight: true
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: FileText,
      section: 'main'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderOpen,
      section: 'documents',
      expandable: true,
      children: [
        { id: 'documents', label: 'Tous les documents', icon: FileText },
        { id: 'recent', label: 'Documents récents', icon: Clock },
        { id: 'favorites', label: 'Favoris', icon: Star },
        { id: 'archived', label: 'Archives', icon: Archive }
      ]
    },
    {
      id: 'knowledge',
      label: 'Base de connaissance',
      icon: Database,
      section: 'ai',
      badge: 'Nouveau'
    },
    {
      id: 'company',
      label: 'Profil entreprise',
      icon: Building2,
      section: 'settings'
    }
  ];

  // Ajouter l'option admin si l'utilisateur a les droits
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    menuItems.push({
      id: 'admin',
      label: 'Administration',
      icon: Shield,
      section: 'admin'
    });
  }

  const sections = [
    { id: 'main', label: null },
    { id: 'documents', label: 'Gestion documentaire' },
    { id: 'ai', label: 'Intelligence artificielle' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'admin', label: 'Administration' }
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/assets/images/logo/logo ORGANEUS copy.png" 
            alt="ORGANEUS" 
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">ORGANEUS Docs</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {sections.map(section => (
          <div key={section.id} className="mb-6">
            {section.label && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.label}
              </h3>
            )}
            
            {menuItems
              .filter(item => item.section === section.id)
              .map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const isExpanded = expandedSections.includes(item.id);

                if (item.expandable && item.children) {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleSection(item.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-4 mt-1">
                          {item.children.map(child => {
                            const ChildIcon = child.icon;
                            const isChildActive = currentView === child.id;
                            
                            return (
                              <button
                                key={child.id}
                                onClick={() => onViewChange(child.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                  isChildActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ChildIcon className="h-4 w-4" />
                                <span className="text-sm">{child.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : item.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">IA Assistant</span>
          </div>
          <p className="text-xs text-gray-600">
            Générez des documents intelligents avec l'aide de l'IA
          </p>
        </div>
      </div>
    </aside>
  );
};