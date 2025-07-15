import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  Save, 
  Zap,
  Target,
  Thermometer,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { AIConfiguration } from '../../services/okaTechService';
import { okaTechService } from '../../services/okaTechService';

export const OKATechAIConfig: React.FC = () => {
  const [config, setConfig] = useState<AIConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const aiConfig = await okaTechService.getAIConfiguration();
      setConfig(aiConfig);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    try {
      setSaving(true);
      await okaTechService.updateAIConfiguration(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (key: keyof AIConfiguration, value: any) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  const getModelDescription = (model: string) => {
    switch (model) {
      case 'claude':
        return 'Excellent pour l\'analyse et la rédaction complexe. Temps de réponse: ~0.8s';
      case 'gpt4':
        return 'Polyvalent et créatif. Idéal pour la génération de contenu. Temps de réponse: ~1.2s';
      case 'gemini':
        return 'Rapide et efficace. Parfait pour les tâches simples. Temps de réponse: ~0.5s';
      default:
        return '';
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case 'claude': return 'from-orange-500 to-red-500';
      case 'gpt4': return 'from-green-500 to-emerald-500';
      case 'gemini': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600">Impossible de charger la configuration IA</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuration IA OKA Tech</h2>
          <p className="text-gray-600">Paramètres d'intelligence artificielle pour votre branche</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? <Clock className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Configuration sauvegardée</p>
            <p className="text-xs text-green-600">Les paramètres IA ont été mis à jour avec succès</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Modèle préféré</h3>
          </div>
          
          <div className="space-y-3">
            {['claude', 'gpt4', 'gemini'].map((model) => (
              <label key={model} className="block">
                <input
                  type="radio"
                  name="preferredModel"
                  value={model}
                  checked={config.preferredModel === model}
                  onChange={(e) => handleConfigChange('preferredModel', e.target.value as any)}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  config.preferredModel === model 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getModelColor(model)} flex items-center justify-center`}>
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{model}</h4>
                        <p className="text-sm text-gray-600">{getModelDescription(model)}</p>
                      </div>
                    </div>
                    {config.preferredModel === model && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Paramètres avancés</h3>
          </div>
          
          <div className="space-y-6">
            {/* Token Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite de tokens ({config.tokenLimit})
              </label>
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={config.tokenLimit}
                onChange={(e) => handleConfigChange('tokenLimit', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1000</span>
                <span>8000</span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température ({config.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Précis (0)</span>
                <span>Créatif (1)</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Suggestions automatiques
                  </label>
                  <p className="text-xs text-gray-500">
                    Proposer des améliorations pendant la rédaction
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableAutoSuggestions}
                    onChange={(e) => handleConfigChange('enableAutoSuggestions', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mémorisation du contexte
                  </label>
                  <p className="text-xs text-gray-500">
                    Conserver le contexte entre les interactions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableContextMemory}
                    onChange={(e) => handleConfigChange('enableContextMemory', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommandations de performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h4 className="font-medium text-gray-900">Tâches rapides</h4>
            </div>
            <p className="text-sm text-gray-600">
              Utilisez <strong>Gemini</strong> pour les corrections et reformulations simples
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Analyse complexe</h4>
            </div>
            <p className="text-sm text-gray-600">
              Privilégiez <strong>Claude</strong> pour l'analyse de documents et le raisonnement
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="h-5 w-5 text-green-500" />
              <h4 className="font-medium text-gray-900">Génération créative</h4>
            </div>
            <p className="text-sm text-gray-600">
              Utilisez <strong>GPT-4</strong> avec température élevée pour la créativité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};