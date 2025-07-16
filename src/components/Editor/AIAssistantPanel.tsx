import React, { useState, useEffect } from 'react';
import { 
  Wand2,
  Sparkles,
  Lightbulb,
  AlertCircle,
  Check,
  Trash2,
  Loader2,
  BookOpen,
  Copy
} from 'lucide-react';
import { KnowledgeDocument } from '../../types/knowledge';
import { aiDocumentService } from '../../services/aiDocumentService';

interface AIAssistantPanelProps {
  selectedText: string;
  documentContent: string;
  knowledgeDocuments: KnowledgeDocument[];
  onImproveText: (style: string) => Promise<void>;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  selectedText, 
  documentContent,
  knowledgeDocuments,
  onImproveText
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'improve' | 'suggest' | 'info'>('improve');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [loadingImprove, setLoadingImprove] = useState(false);

  // Charger les suggestions lorsque le contenu change
  useEffect(() => {
    if (documentContent.trim().length > 20) {
      generateSuggestions();
    }
  }, [documentContent]);

  // Extraire des informations clés lorsque des documents sont sélectionnés
  useEffect(() => {
    if (knowledgeDocuments.length > 0) {
      extractKeyInfo();
    }
  }, [knowledgeDocuments]);

  const generateSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const contextSuggestions = await aiDocumentService.getSuggestions(documentContent);
      setSuggestions(contextSuggestions);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const extractKeyInfo = async () => {
    try {
      setLoadingInfo(true);
      const info = await aiDocumentService.extractKeyInfo(knowledgeDocuments.map(doc => doc.id));
      setKeyInfo(info);
    } catch (error) {
      console.error('Erreur lors de l\'extraction des informations clés:', error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleImproveText = async (style: string) => {
    try {
      setLoadingImprove(true);
      await onImproveText(style);
    } finally {
      setLoadingImprove(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('improve')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded ${
            activeTab === 'improve'
              ? 'bg-white shadow-sm text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Améliorer
        </button>
        <button
          onClick={() => setActiveTab('suggest')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded ${
            activeTab === 'suggest'
              ? 'bg-white shadow-sm text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded ${
            activeTab === 'info'
              ? 'bg-white shadow-sm text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sources
        </button>
      </div>

      {/* Améliorer du texte */}
      {activeTab === 'improve' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Wand2 className="h-4 w-4 text-purple-600" />
              <span>Améliorer le texte</span>
            </h3>
            {selectedText ? (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-600 max-h-20 overflow-y-auto">
                  {selectedText.substring(0, 150)}{selectedText.length > 150 ? '...' : ''}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleImproveText('formal')}
                    disabled={loadingImprove}
                    className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs flex flex-col items-center"
                  >
                    <span className="mb-1">Formel</span>
                    {loadingImprove ? <Loader2 className="h-3 w-3 animate-spin" /> : "👔"}
                  </button>
                  <button
                    onClick={() => handleImproveText('casual')}
                    disabled={loadingImprove}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs flex flex-col items-center"
                  >
                    <span className="mb-1">Décontracté</span>
                    {loadingImprove ? <Loader2 className="h-3 w-3 animate-spin" /> : "👋"}
                  </button>
                  <button
                    onClick={() => handleImproveText('technical')}
                    disabled={loadingImprove}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs flex flex-col items-center"
                  >
                    <span className="mb-1">Technique</span>
                    {loadingImprove ? <Loader2 className="h-3 w-3 animate-spin" /> : "⚙️"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                Sélectionnez du texte pour l'améliorer
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Génération IA</span>
            </h3>
            <div className="space-y-2">
              <button className="w-full p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                Générer un paragraphe d'introduction
              </button>
              <button className="w-full p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                Générer une conclusion
              </button>
              <button className="w-full p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                Ajouter des points clés
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {activeTab === 'suggest' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>Suggestions</span>
              </div>
              <button
                onClick={generateSuggestions}
                disabled={loadingSuggestions}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Rafraîchir
              </button>
            </h3>
            
            {loadingSuggestions ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Génération des suggestions...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="bg-yellow-50 p-2 rounded-lg border border-yellow-200 text-sm text-gray-700 flex justify-between group"
                  >
                    <span>{suggestion}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                Aucune suggestion disponible
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span>Alertes et conseils</span>
            </h3>
            <div className="space-y-2">
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Votre document est bien structuré</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Pensez à ajouter vos coordonnées de contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations des sources */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Points clés des sources</span>
            </h3>
            
            {loadingInfo ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Extraction des informations...</p>
              </div>
            ) : keyInfo ? (
              <div className="space-y-3">
                {keyInfo.keyPoints && keyInfo.keyPoints.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Points clés</h4>
                    <ul className="space-y-1">
                      {keyInfo.keyPoints.map((point: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <span className="text-blue-500">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {keyInfo.entities && keyInfo.entities.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Entités</h4>
                    <div className="flex flex-wrap gap-1">
                      {keyInfo.entities.map((entity: string, index: number) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {keyInfo.summary && (
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Résumé</h4>
                    <p className="text-sm text-gray-700">{keyInfo.summary}</p>
                  </div>
                )}
                
                {keyInfo.recommendations && keyInfo.recommendations.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Recommandations</h4>
                    <ul className="space-y-1">
                      {keyInfo.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <span className="text-green-500">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : knowledgeDocuments.length > 0 ? (
              <div className="text-center py-4">
                <button 
                  onClick={extractKeyInfo}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Extraire les informations
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                Aucun document source sélectionné
              </div>
            )}
          </div>

          {/* Documents utilisés */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="font-medium text-gray-900 mb-2">Documents sources</h3>
            {knowledgeDocuments.length > 0 ? (
              <ul className="space-y-2">
                {knowledgeDocuments.map((doc) => (
                  <li 
                    key={doc.id} 
                    className="text-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-gray-700">{doc.name}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-2 text-sm text-gray-500">
                Aucun document source
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};