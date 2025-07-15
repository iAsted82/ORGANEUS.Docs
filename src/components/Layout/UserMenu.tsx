import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'collaborator': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrateur';
      case 'collaborator': return 'Collaborateur';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
              {getRoleLabel(user?.role || '')}
            </span>
            <span className="text-xs text-gray-500">{user?.company.displayName}</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                    {getRoleLabel(user?.role || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            {user?.role === 'super_admin' && (
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span>Administration</span>
              </button>
            )}
            
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </button>
          </div>
          
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};