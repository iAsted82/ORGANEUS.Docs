import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Globe, 
  Palette, 
  Shield,
  Database,
  Bell,
  Mail,
  Lock
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'ORGANEUS Docs',
    primaryColor: '#7c3aed',
    allowRegistration: true,
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: 'pdf,doc,docx,txt,png,jpg,jpeg',
    emailNotifications: true,
    adminNotifications: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    apiRateLimit: 1000,
    enableAnalytics: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    // Simulate save
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Paramètres système</h3>
          <p className="text-sm text-gray-600">Configurez les paramètres globaux de la plateforme</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Enregistrer</span>
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Paramètres sauvegardés</p>
            <p className="text-xs text-green-600">Les modifications ont été appliquées avec succès</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Paramètres généraux</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur primaire
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Autoriser les inscriptions
                </label>
                <p className="text-xs text-gray-500">
                  Permettre aux nouveaux utilisateurs de s'inscrire
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mode maintenance
                </label>
                <p className="text-xs text-gray-500">
                  Activer le mode maintenance pour la plateforme
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* File Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Paramètres des fichiers</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taille maximale des fichiers (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Types de fichiers autorisés
              </label>
              <input
                type="text"
                value={settings.allowedFileTypes}
                onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="pdf,doc,docx,txt,png,jpg,jpeg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez les extensions par des virgules
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence de sauvegarde
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="hourly">Chaque heure</option>
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-gray-900">Paramètres de sécurité</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai d'expiration de session (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="5"
                max="480"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limite de requêtes API (par heure)
              </label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="100"
                max="10000"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Activer l'analytics
                </label>
                <p className="text-xs text-gray-500">
                  Collecter des données d'utilisation anonymes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAnalytics}
                  onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-gray-900">Paramètres de notifications</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notifications par email
                </label>
                <p className="text-xs text-gray-500">
                  Envoyer des notifications par email aux utilisateurs
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notifications admin
                </label>
                <p className="text-xs text-gray-500">
                  Recevoir des alertes système par email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.adminNotifications}
                  onChange={(e) => handleSettingChange('adminNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h4 className="font-semibold text-red-900">Zone de danger</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Réinitialiser les paramètres</p>
              <p className="text-xs text-red-600">Restaurer tous les paramètres aux valeurs par défaut</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
              Réinitialiser
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Purger les logs</p>
              <p className="text-xs text-red-600">Supprimer tous les logs système (action irréversible)</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
              Purger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};