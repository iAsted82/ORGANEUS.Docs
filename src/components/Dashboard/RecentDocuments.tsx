import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Star, 
  MoreVertical, 
  Edit, 
  Share2, 
  Archive, 
  Trash2,
  Plus
} from 'lucide-react';
import { Document } from '../../types';
import { documentService } from '../../services/documentService';

export const RecentDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    loadRecentDocuments();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      setLoading(true);
      const recentDocs = await documentService.getRecentDocuments(6);
      setDocuments(recentDocs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents récents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (documentId: string) => {
    try {
      await documentService.toggleFavorite(documentId);
      await loadRecentDocuments();
    } catch (error) {
      console.error('Erreur lors de la modification du favori:', error);
    }
  };

  const handleArchiveDocument = async (documentId: string) => {
    try {
      await documentService.archiveDocument(documentId);
      await loadRecentDocuments();
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await documentService.deleteDocument(documentId);
        await loadRecentDocuments();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return FileText; // Ou mapper selon le type
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents récents</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-lg h-10 w-10"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
                  <div className="bg-gray-200 rounded h-3 w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Documents récents</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier document</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Créer un document</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {documents.map((doc) => {
            const TypeIcon = getTypeIcon(doc.type);
            const isFavorite = doc.metadata.tags.includes('favorite');
            
            return (
              <div
                key={doc.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{doc.type}</span>
                        <span className="text-sm text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(doc.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.metadata.status)}`}>
                      {doc.metadata.status}
                    </span>
                    
                    {isFavorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    
                    <div className="relative">
                      <button
                        onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      {selectedDocument === doc.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                console.log('Éditer document:', doc.id);
                                setSelectedDocument(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Éditer</span>
                            </button>
                            <button
                              onClick={() => {
                                handleToggleFavorite(doc.id);
                                setSelectedDocument(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Star className="h-4 w-4" />
                              <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                            </button>
                            <button
                              onClick={() => {
                                console.log('Partager document:', doc.id);
                                setSelectedDocument(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Share2 className="h-4 w-4" />
                              <span>Partager</span>
                            </button>
                            <button
                              onClick={() => {
                                handleArchiveDocument(doc.id);
                                setSelectedDocument(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Archive className="h-4 w-4" />
                              <span>Archiver</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteDocument(doc.id);
                                setSelectedDocument(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};