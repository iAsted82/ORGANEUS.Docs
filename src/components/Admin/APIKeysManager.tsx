import React, { useState, useEffect } from 'react';
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
  Activity,
  Shield,
  Zap,
  Settings,
  Globe,
  Loader2,
  Search,
  Filter,
  Download,
  RefreshCw,
  TestTube,
  AlertTriangle
} from 'lucide-react';
import { APIKey, APIKeyLog, APIKeyValidationResult } from '../../services/apiKeyService';
import { apiKeyService } from '../../services/apiKeyService';

export const APIKeysManager: React.FC = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [logs, setLogs] = useState<APIKeyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('keys');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<Map<string, APIKeyValidationResult>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [keysData, logsData] = await Promise.all([
        apiKeyService.getAllKeys(),
        apiKeyService.getLogs()
      ]);
      setKeys(keysData);
      setLogs(logsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async (keyData: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      await apiKeyService.createKey(keyData);
      await loadData();
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout');
    }
  };

  const handleUpdateKey = async (id: string, updates: Partial<APIKey>) => {
    try {
      await apiKeyService.updateKey(id, updates);
      await loadData();
      setEditingKey(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette clé API ?')) {
      try {
        await apiKeyService.deleteKey(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(error instanceof Error ? error.message : 'Erreur lors de la suppression');
      }
    }
  };

  const handleTestConnection = async (id: string) => {
    try {
      setTestingKey(id);
      const success = await apiKeyService.testConnection(id);
      alert(success ? 'Connexion réussie !' : 'Échec de la connexion');
      await loadData();
    } catch (error) {
      console.error('Erreur lors du test:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors du test');
    } finally {
      setTestingKey(null);
    }
  };

  const handleValidateKey = async (id: string) => {
    try {
      const result = await apiKeyService.validateKey(id);
      setValidationResults(prev => new Map(prev).set(id, result));
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (keyId: string) => {
    try {
      const keyValue = await apiKeyService.getKeyValue(keyId);
      if (keyValue) {
        await navigator.clipboard.writeText(keyValue);
        setCopiedKey(keyId);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'anthropic': return '🤖';
      case 'openai': return '🧠';
      case 'gemini': return '💎';
      default: return '🔑';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'anthropic': return 'bg-orange-100 text-orange-800';
      case 'openai': return 'bg-green-100 text-green-800';
      case 'gemini': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredKeys = keys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || key.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des clés API</h3>
          <p className="text-sm text-gray-600">Configurez et gérez vos clés API de manière sécurisée</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une clé</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'keys'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Clés API</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Logs d'activité</span>
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'keys' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des clés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les fournisseurs</option>
                <option value="anthropic">Anthropic</option>
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="custom">Personnalisé</option>
              </select>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {filteredKeys.map((key) => (
              <APIKeyCard
                key={key.id}
                apiKey={key}
                isVisible={visibleKeys.has(key.id)}
                isCopied={copiedKey === key.id}
                isTesting={testingKey === key.id}
                validationResult={validationResults.get(key.id)}
                onToggleVisibility={() => toggleKeyVisibility(key.id)}
                onCopy={() => copyToClipboard(key.id)}
                onEdit={() => setEditingKey(key)}
                onDelete={() => handleDeleteKey(key.id)}
                onTest={() => handleTestConnection(key.id)}
                onValidate={() => handleValidateKey(key.id)}
              />
            ))}
          </div>

          {filteredKeys.length === 0 && (
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune clé API trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterProvider !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre première clé API'
                }
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ajouter une clé
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'logs' && (
        <APILogsView logs={logs} />
      )}

      {/* Add Key Modal */}
      {showAddForm && (
        <APIKeyForm
          onSave={handleAddKey}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Key Modal */}
      {editingKey && (
        <APIKeyForm
          apiKey={editingKey}
          onSave={(keyData) => handleUpdateKey(editingKey.id, keyData)}
          onCancel={() => setEditingKey(null)}
        />
      )}
    </div>
  );
};

// Composant pour une carte de clé API
const APIKeyCard: React.FC<{
  apiKey: APIKey;
  isVisible: boolean;
  isCopied: boolean;
  isTesting: boolean;
  validationResult?: APIKeyValidationResult;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
  onValidate: () => void;
}> = ({ 
  apiKey, 
  isVisible, 
  isCopied, 
  isTesting, 
  validationResult,
  onToggleVisibility, 
  onCopy, 
  onEdit, 
  onDelete, 
  onTest, 
  onValidate 
}) => {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'anthropic': return '🤖';
      case 'openai': return '🧠';
      case 'gemini': return '💎';
      default: return '🔑';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'anthropic': return 'bg-orange-100 text-orange-800';
      case 'openai': return 'bg-green-100 text-green-800';
      case 'gemini': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all ${
      apiKey.isActive 
        ? 'border-gray-200 bg-white' 
        : 'border-gray-100 bg-gray-50 opacity-75'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getProviderIcon(apiKey.provider)}</div>
          <div>
            <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(apiKey.provider)}`}>
                {apiKey.provider.toUpperCase()}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                apiKey.environment === 'production' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {apiKey.environment}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onValidate}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Valider la clé"
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            onClick={onTest}
            disabled={isTesting}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            title="Tester la connexion"
          >
            {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {apiKey.description && (
        <p className="text-sm text-gray-600 mb-4">{apiKey.description}</p>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div className={`p-3 rounded-lg mb-4 ${
          validationResult.isValid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {validationResult.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              validationResult.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResult.isValid ? 'Clé valide' : 'Clé invalide'}
            </span>
          </div>
          {validationResult.errorMessage && (
            <p className="text-sm text-red-600 mt-1">{validationResult.errorMessage}</p>
          )}
        </div>
      )}

      {/* Key Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="h-4 w-4 text-gray-400" />
            <code className="text-sm font-mono text-gray-700">
              {apiKey.keyValue}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleVisibility}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={isVisible ? 'Masquer' : 'Afficher'}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={onCopy}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copier"
            >
              {isCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Utilisations</p>
          <p className="font-medium">{apiKey.usageCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Dernière utilisation</p>
          <p className="font-medium">
            {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Jamais'}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Limite mensuelle</p>
          <p className="font-medium">{apiKey.monthlyLimit?.toLocaleString() || 'Illimitée'}</p>
        </div>
      </div>

      {/* Tags */}
      {apiKey.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {apiKey.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour le formulaire d'ajout/modification
const APIKeyForm: React.FC<{
  apiKey?: APIKey;
  onSave: (keyData: any) => void;
  onCancel: () => void;
}> = ({ apiKey, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: apiKey?.name || '',
    provider: apiKey?.provider || 'anthropic',
    keyValue: '',
    description: apiKey?.description || '',
    environment: apiKey?.environment || 'development',
    monthlyLimit: apiKey?.monthlyLimit || 10000,
    tags: apiKey?.tags.join(', ') || '',
    isActive: apiKey?.isActive !== false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.keyValue.trim()) {
      newErrors.keyValue = 'La clé API est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {apiKey ? 'Modifier la clé API' : 'Ajouter une nouvelle clé API'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la clé *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Anthropic Claude Production"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur *
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="anthropic">Anthropic Claude</option>
                <option value="openai">OpenAI GPT</option>
                <option value="gemini">Google Gemini</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé API *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.keyValue}
                onChange={(e) => setFormData({...formData, keyValue: e.target.value})}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.keyValue ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Collez votre clé API ici"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.keyValue && <p className="mt-1 text-sm text-red-600">{errors.keyValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Description de la clé et de son utilisation..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environnement
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({...formData, environment: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="development">Développement</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limite mensuelle
              </label>
              <input
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({...formData, monthlyLimit: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="production, primary, claude"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Activer cette clé API
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {apiKey ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant pour les logs
const APILogsView: React.FC<{ logs: APIKeyLog[] }> = ({ logs }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Plus className="h-4 w-4" />;
      case 'updated': return <Edit className="h-4 w-4" />;
      case 'deleted': return <Trash2 className="h-4 w-4" />;
      case 'used': return <Zap className="h-4 w-4" />;
      case 'validated': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'text-red-600 bg-red-100';
    
    switch (action) {
      case 'created': return 'text-green-600 bg-green-100';
      case 'updated': return 'text-blue-600 bg-blue-100';
      case 'deleted': return 'text-red-600 bg-red-100';
      case 'used': return 'text-purple-600 bg-purple-100';
      case 'validated': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900">
          Logs d'activité ({logs.length})
        </h4>
      </div>

      <div className="divide-y divide-gray-200">
        {logs.map((log) => (
          <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getActionColor(log.action, log.success)}`}>
                {getActionIcon(log.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {log.keyName}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  Action: {log.action} - {log.success ? 'Succès' : 'Échec'}
                </p>
                
                {log.errorMessage && (
                  <p className="text-sm text-red-600 mt-1">
                    Erreur: {log.errorMessage}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Par: {log.userEmail}</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="p-8 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun log trouvé</h3>
          <p className="text-gray-600">Les activités des clés API apparaîtront ici</p>
        </div>
      )}
    </div>
  );
};