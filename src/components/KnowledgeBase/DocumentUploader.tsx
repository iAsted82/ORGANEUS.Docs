import React, { useState } from 'react';
import { Upload, FileText, Image, File, Tag, Folder, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { FileUploadZone } from '../Common/FileUploadZone';
import { knowledgeBaseService } from '../../services/knowledgeBaseService';
import { KnowledgeDocument } from '../../types/knowledge';

interface DocumentUploaderProps {
  onUploadComplete: (documents: KnowledgeDocument[]) => void;
  onClose: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadComplete,
  onClose
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processedDocuments, setProcessedDocuments] = useState<KnowledgeDocument[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [metadata, setMetadata] = useState<Record<string, { tags: string; category: string }>>({});

  const categories = [
    'Juridique',
    'Commercial',
    'Technique',
    'Branding',
    'Processus',
    'Marketing',
    'RH',
    'Financier',
    'Non classé'
  ];

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Initialiser les métadonnées pour chaque fichier
    const newMetadata = { ...metadata };
    files.forEach(file => {
      if (!newMetadata[file.name]) {
        newMetadata[file.name] = {
          tags: '',
          category: 'Non classé'
        };
      }
    });
    setMetadata(newMetadata);
  };

  const updateMetadata = (fileName: string, field: 'tags' | 'category', value: string) => {
    setMetadata(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setProcessing(true);
    const documents: KnowledgeDocument[] = [];

    try {
      for (const file of uploadedFiles) {
        setCurrentFile(file.name);
        
        // Upload du fichier
        const document = await knowledgeBaseService.uploadDocument(file);
        
        // Appliquer les métadonnées
        const fileMeta = metadata[file.name];
        if (fileMeta) {
          const tags = fileMeta.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          const updatedDoc = await knowledgeBaseService.updateDocument(document.id, {
            tags,
            category: fileMeta.category
          });
          documents.push(updatedDoc);
        } else {
          documents.push(document);
        }
      }

      setProcessedDocuments(documents);
      onUploadComplete(documents);
    } catch (error) {
      console.error('Erreur lors du traitement des fichiers:', error);
    } finally {
      setProcessing(false);
      setCurrentFile('');
    }
  };

  const removeFile = (index: number) => {
    const removedFile = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Supprimer les métadonnées associées
    const newMetadata = { ...metadata };
    delete newMetadata[removedFile.name];
    setMetadata(newMetadata);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const getFileTypeColor = (file: File) => {
    if (file.type.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (file.type === 'application/pdf') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (processedDocuments.length > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload terminé !</h2>
            <p className="text-gray-600">
              {processedDocuments.length} document{processedDocuments.length > 1 ? 's' : ''} ajouté{processedDocuments.length > 1 ? 's' : ''} à votre base de connaissance.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {processedDocuments.map((doc, index) => {
              const FileIcon = getFileIcon(uploadedFiles[index]);
              return (
                <div key={doc.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <FileIcon className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {doc.category}
                      </span>
                      {doc.tags.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {doc.tags.length} tag{doc.tags.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upload de documents</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {processing ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Traitement en cours...</h3>
            <p className="text-gray-600 mb-4">
              Extraction du contenu et analyse des documents
            </p>
            {currentFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  Traitement de : <span className="font-medium">{currentFile}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Zone d'upload */}
            <FileUploadZone
              onFileUpload={handleFileUpload}
              acceptedTypes={['application/pdf', 'image/*', 'text/plain']}
              maxSize={50}
              multiple={true}
            />

            {/* Fichiers uploadés avec métadonnées */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fichiers à traiter ({uploadedFiles.length})
                  </h3>
                  <button
                    onClick={processFiles}
                    disabled={uploadedFiles.length === 0}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Traiter les fichiers</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {uploadedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file);
                    const fileMeta = metadata[file.name] || { tags: '', category: 'Non classé' };
                    
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getFileTypeColor(file)}`}>
                              <FileIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Tag className="inline h-4 w-4 mr-1" />
                              Tags (séparés par des virgules)
                            </label>
                            <input
                              type="text"
                              value={fileMeta.tags}
                              onChange={(e) => updateMetadata(file.name, 'tags', e.target.value)}
                              placeholder="contrat, développement, technique..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Folder className="inline h-4 w-4 mr-1" />
                              Catégorie
                            </label>
                            <select
                              value={fileMeta.category}
                              onChange={(e) => updateMetadata(file.name, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Conseils pour l'upload</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ajoutez des tags pertinents pour faciliter la recherche</li>
                    <li>• Choisissez une catégorie appropriée pour organiser vos documents</li>
                    <li>• L'IA extraira automatiquement le contenu textuel</li>
                    <li>• Les images seront analysées pour extraire le texte visible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};