import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Building2, 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  Crown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Company } from '../../types/auth';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { OKATechDashboard } from './OKATechDashboard';

export const AdminPanel: React.FC = () => {
  const { user, companies, updateCompanyStatus, addCompany } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    displayName: '',
    description: '',
    color: '#2563eb',
    isActive: false
  });

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    addCompany(newCompany);
    setNewCompany({
      name: '',
      displayName: '',
      description: '',
      color: '#2563eb',
      isActive: false
    });
    setShowAddCompany(false);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Crown },
    { id: 'companies', label: 'Entreprises', icon: Building2 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  if (user?.role !== 'super_admin') {
    // Si l'utilisateur est admin d'OKA Tech, afficher le dashboard OKA Tech
    if (user?.role === 'admin' && user?.company.id === 'oka-tech') {
      return <OKATechDashboard />;
    }
    
    // Sinon, afficher le message d'accès restreint
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Accès restreint
        </h3>
        <p className="text-gray-600">
          Seuls les administrateurs peuvent accéder à cette section.
        </p>
      </div>
    );
  }

  if (activeTab === 'dashboard') {
    return <SuperAdminDashboard />;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Administration</h2>
            <p className="text-gray-600">Gestion des entreprises et des utilisateurs</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gestion des entreprises
                </h3>
                <button
                  onClick={() => setShowAddCompany(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter une entreprise</span>
                </button>
              </div>

              <div className="grid gap-4">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: company.color }}
                        >
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {company.displayName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {company.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateCompanyStatus(company.id, !company.isActive)}
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            company.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {company.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                          <span>{company.isActive ? 'Actif' : 'Inactif'}</span>
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Gestion des utilisateurs
              </h3>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Fonctionnalité de gestion des utilisateurs en développement
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Paramètres système
              </h3>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Paramètres système en développement
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout d'entreprise */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une nouvelle entreprise
            </h3>
            
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={newCompany.displayName}
                  onChange={(e) => setNewCompany({...newCompany, displayName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  value={newCompany.color}
                  onChange={(e) => setNewCompany({...newCompany, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newCompany.isActive}
                  onChange={(e) => setNewCompany({...newCompany, isActive: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Activer immédiatement
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCompany(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};