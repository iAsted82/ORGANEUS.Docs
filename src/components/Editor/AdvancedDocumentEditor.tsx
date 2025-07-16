import React, { useState, useEffect } from 'react';
import { 
  Save, 
  FileText, 
  Image, 
  List, 
  Table, 
  AlignLeft,
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Link,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  RotateCw,
  BookOpen,
  Wand2,
  Building2,
  Sparkles,
  Clock
} from 'lucide-react';
import { KnowledgeDocument } from '../../types/knowledge';
import { CompanyInfo } from '../../types/company';
import { CompanyInfoWidget } from '../Company/CompanyInfoWidget';
import { AIAssistantPanel } from './AIAssistantPanel';
import { aiDocumentService } from '../../services/aiDocumentService';

interface AdvancedDocumentEditorProps {
  title: string;
  documentType: string;
  knowledgeDocuments: KnowledgeDocument[];
  companyInfo: CompanyInfo | null;
  aiPrompt?: string;
}

export const AdvancedDocumentEditor: React.FC<AdvancedDocumentEditorProps> = ({
  title,
  documentType,
  knowledgeDocuments,
  companyInfo,
  aiPrompt
}) => {
  const [content, setContent] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<'knowledge' | 'company'>('knowledge');
  const [loading, setLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Générer du contenu avec l'IA si un prompt est fourni
  useEffect(() => {
    const generateInitialContent = async () => {
      if (aiPrompt && knowledgeDocuments.length > 0 && companyInfo) {
        try {
          setLoading(true);
          const generatedContent = await aiDocumentService.generateContent(
            aiPrompt,
            knowledgeDocuments,
            companyInfo
          );
          setContent(generatedContent.content);
        } catch (error) {
          console.error("Erreur lors de la génération du contenu:", error);
          setContent(`# ${title}\n\nVotre contenu ici...`);
        } finally {
          setLoading(false);
        }
      } else {
        // Contenu par défaut selon le type de document
        const defaultTemplates: Record<string, string> = {
          letter: `# ${title}\n\nMadame, Monsieur,\n\nNous vous adressons ce courrier concernant...\n\nCordialement,\n\n${companyInfo?.name || 'Votre entreprise'}`,
          contract: `# ${title}\n\n## Article 1 - Objet\nLe présent contrat a pour objet...\n\n## Article 2 - Conditions\n...\n\n## Article 3 - Durée\n...`,
          report: `# ${title}\n\n## Résumé exécutif\n...\n\n## Contexte\n...\n\n## Résultats\n...\n\n## Recommandations\n...`,
          other: `# ${title}\n\nVotre contenu ici...`
        };
        setContent(defaultTemplates[documentType as keyof typeof defaultTemplates] || defaultTemplates.other);
      }
    };

    generateInitialContent();
  }, [aiPrompt, knowledgeDocuments, companyInfo, title, documentType]);

  // Activer l'autosave
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSaveEnabled && content.trim()) {
      interval = setInterval(() => {
        saveDocument();
      }, 60000); // Auto-save every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSaveEnabled, content]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  };

  const saveDocument = () => {
    // Simulation de sauvegarde
    console.log('Sauvegarde du document:', { title, content });
    setSavedAt(new Date().toLocaleTimeString());
  };

  const handleToolbarAction = (action: string) => {
    // Implémentation des actions de la barre d'outils
    console.log('Action toolbar:', action);
  };

  const insertCompanyBlock = (blockId: string) => {
    if (!companyInfo) return;
    
    // Mise à jour pour utiliser la nouvelle interface CompanyInfoWidget
    setContent(prev => `${prev}\n\n${blockId}`);
  };

  const handleImproveText = async (style: string) => {
    if (!selectedText) return;
    
    try {
      setLoading(true);
      const improvedText = await aiDocumentService.improveText(selectedText, style);
      // Remplacer le texte sélectionné (en situation réelle, on utiliserait un éditeur riche qui gère cela)
      const newContent = content.replace(selectedText, improvedText);
      setContent(newContent);
    } catch (error) {
      console.error("Erreur lors de l'amélioration du texte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Formatage de texte */}
          <div className="flex border-r border-gray-200 pr-1 space-x-1">
            <button onClick={() => handleToolbarAction('bold')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Bold className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('italic')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Italic className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('underline')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Underline className="h-4 w-4" />
            </button>
          </div>
          
          {/* Alignement */}
          <div className="flex border-r border-gray-200 pr-1 space-x-1">
            <button onClick={() => handleToolbarAction('alignLeft')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <AlignLeft className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('alignCenter')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <AlignCenter className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('alignRight')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Insertion */}
          <div className="flex border-r border-gray-200 pr-1 space-x-1">
            <button onClick={() => handleToolbarAction('image')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Image className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('table')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Table className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('list')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('link')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <Link className="h-4 w-4" />
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-1 ml-auto">
            <button onClick={() => handleToolbarAction('undo')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => handleToolbarAction('redo')} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <RotateCw className="h-4 w-4" />
            </button>
            <button onClick={saveDocument} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        {leftSidebarOpen && (
          <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveLeftTab('knowledge')}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeLeftTab === 'knowledge'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Base de connaissances
                </button>
                <button
                  onClick={() => setActiveLeftTab('company')}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeLeftTab === 'company'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Entreprise
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {activeLeftTab === 'knowledge' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Documents source</span>
                  </h3>
                  
                  {knowledgeDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {knowledgeDocuments.map((doc) => (
                        <div 
                          key={doc.id}
                          className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                        >
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{doc.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              doc.type === 'pdf' ? 'bg-red-100 text-red-800' :
                              doc.type === 'image' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {doc.type.toUpperCase()}
                            </span>
                            {doc.category && (
                              <span className="text-xs text-gray-500">{doc.category}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Aucun document source</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeLeftTab === 'company' && companyInfo && (
                <CompanyInfoWidget 
                  companyInfo={companyInfo}
                  onInsert={insertCompanyBlock}
                />
              )}
            </div>
            
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                Masquer
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Document title */}
          <div className="px-6 py-3 border-b border-gray-200 bg-white">
            <input
              type="text"
              value={title}
              className="text-xl font-semibold w-full border-none focus:ring-0 outline-none"
              placeholder="Titre du document"
              readOnly
            />
            {savedAt && (
              <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3" />
                <span>Dernière sauvegarde à {savedAt}</span>
              </div>
            )}
          </div>
          
          {/* Editor area */}
          <div className="flex-1 overflow-auto p-6 bg-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Sparkles className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
                <p className="text-lg font-medium text-gray-900 mb-2">Génération en cours...</p>
                <p className="text-gray-600">
                  L'IA analyse vos documents sources pour créer votre contenu
                </p>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                className="w-full h-full border-none outline-none resize-none font-serif"
                style={{ minHeight: '500px' }}
              />
            )}
          </div>
          
          {/* Document actions */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <button className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                <Trash2 className="h-4 w-4" />
                <span className="text-sm">Supprimer</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="autosave"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autosave" className="text-sm text-gray-600">Auto-save</label>
              </div>
              <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span className="text-sm">Télécharger</span>
              </button>
              <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Partager</span>
              </button>
              <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded flex items-center space-x-1">
                <Save className="h-4 w-4" />
                <span className="text-sm">Sauvegarder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar - AI assistant */}
        {rightSidebarOpen && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <span>Assistant IA</span>
              </h3>
            </div>
            
            <div className="flex-1 overflow-auto">
              <AIAssistantPanel 
                selectedText={selectedText}
                onImproveText={handleImproveText}
                documentContent={content}
                knowledgeDocuments={knowledgeDocuments}
              />
            </div>
            
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={() => setRightSidebarOpen(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                Masquer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toggle buttons for hidden sidebars */}
      {(!leftSidebarOpen || !rightSidebarOpen) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white rounded-full shadow-md p-1 border border-gray-200">
          {!leftSidebarOpen && (
            <button
              onClick={() => setLeftSidebarOpen(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              title="Afficher la barre latérale gauche"
            >
              <BookOpen className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {!rightSidebarOpen && (
            <button
              onClick={() => setRightSidebarOpen(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              title="Afficher l'assistant IA"
            >
              <Wand2 className="h-4 w-4 text-purple-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};