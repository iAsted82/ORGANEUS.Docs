import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { APIKey } from '../../types/admin';

export const APIKeysManager: React.FC = () => {
  const [showAddKey, setShowAddKey] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Anthropic Claude',
      service: 'anthropic',
      key: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxx',
      isActive: true,
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20',
      usage: 1456,
      limit: 10000
    },
    {
      id: '2',
      name: 'OpenAI GPT-4',
      service: 'openai',
      key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxx',
      isActive: true,
      createdAt: '2024-01-10',
      lastUsed: '2024-01-19',
      usage: 2341,
      limit: 5000
    },
    {
      id: '3',
      name: 'Google Gemini Pro',
      service: 'gemini',
      key: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx',
      isActive: false,
      createdAt: '2024-01-08',
      lastUsed: '2024-01-18',
      usage: 567,
      limit: 2000
    }
  ]);

  const [newKey, setNewKey] = useState({
    name: '',
    service: 'anthropic' as const,
    key: ''
  });

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    const key: APIKey = {
      id: Date.now().toString(),
      name: newKey.name,
      service: newKey.service,
      key: newKey.key,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      usage: 0,
      limit: 10000
    };
    setApiKeys([...apiKeys, key]);
    setNewKey({ name: '', service: 'anthropic', key: '' });
    setShowAddKey(false);
  };

  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(keys => 
      keys.map(key => 
        key.id === keyId ? { ...key, isActive: !key.isActive } : key
      )
    );
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'anthropic':
        return '🤖';
      case 'openai':
        return '🧠';
      case 'gemini':
        return '💎';
      default:
        return '🔑';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'anthropic':
        return 'bg-orange-100 text-orange-800';
      case 'openai':
        return 'bg-green-100 text-green-800';
      case 'gemini':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des clés API</h3>
          <p className="text-sm text-gray-600">Configurez et gérez vos clés API pour les services IA</p>
        </div>
        <button
          onClick={() => setShowAddKey(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une clé</span>
        </button>
      </div>

      {/* API Keys List */}
      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className={`border-2 rounded-xl p-6 transition-all ${
              apiKey.isActive 
                ? 'border-gray-200 bg-white' 
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getServiceIcon(apiKey.service)}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(apiKey.service)}`}>
                    {apiKey.service.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleKeyStatus(apiKey.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    apiKey.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {apiKey.isActive ? 'Actif' : 'Inactif'}
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                
                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Key Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="h-4 w-4 text-gray-400" />
                  <code className="text-sm font-mono text-gray-700">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {copiedKey === apiKey.id ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Créée le</p>
                <p className="font-medium">{new Date(apiKey.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Dernière utilisation</p>
                <p className="font-medium">{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Jamais'}</p>
              </div>
              <div>
                <p className="text-gray-600">Utilisation</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{apiKey.usage.toLocaleString()}</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs">/{apiKey.limit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Key Modal */}
      {showAddKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une nouvelle clé API
            </h3>
            
            <form onSubmit={handleAddKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la clé
                </label>
                <input
                  type="text"
                  value={newKey.name}
                  onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Anthropic Claude Production"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  value={newKey.service}
                  onChange={(e) => setNewKey({...newKey, service: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openai">OpenAI GPT</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé API
                </label>
                <input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Collez votre clé API ici"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddKey(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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