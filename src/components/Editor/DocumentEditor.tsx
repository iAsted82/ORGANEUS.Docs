import React, { useState } from 'react';
import { Save, Eye, Download, Share2, Wand2, Undo, Redo } from 'lucide-react';

interface DocumentEditorProps {
  document?: any;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document }) => {
  const [content, setContent] = useState(document?.content || '');
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    console.log('Document saved:', content);
  };

  const handleAIAssist = () => {
    console.log('AI assistance requested');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Titre du document"
              className="text-xl font-semibold text-gray-900 border-none outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
              defaultValue={document?.title || 'Nouveau document'}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Undo className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Redo className="h-5 w-5" />
            </button>
            <button
              onClick={handleAIAssist}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Wand2 className="h-4 w-4" />
              <span>IA Assistant</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {!isPreview ? (
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full border-none outline-none resize-none text-gray-900 leading-relaxed"
                  placeholder="Commencez à écrire votre document ici..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-6">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Propriétés du document</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Lettre</option>
                    <option>Contrat</option>
                    <option>Facture</option>
                    <option>Rapport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Brouillon</option>
                    <option>Final</option>
                    <option>Envoyé</option>
                    <option>Archivé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="Ajouter des tags..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Télécharger PDF</span>
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Assistance IA</h3>
              <div className="space-y-2">
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Améliorer le texte
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Corriger l'orthographe
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Traduire
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Générer résumé
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};