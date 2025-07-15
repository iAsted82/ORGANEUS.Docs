import React, { useState, useEffect } from 'react';
import { Clock, FileText, Search, Grid, List, MoreVertical, Star, Edit, Share2, Archive, Trash2 } from 'lucide-react';
import { Document } from '../../types';
import { documentService } from '../../services/documentService';

export const RecentDocuments: React.FC = () => {
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    loadRecentDocuments();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      setLoading(true);
      const recent = await documentService.getRecentDocuments(20);
      setRecentDocuments(recent);
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

  const filteredDocuments = recentDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents récents</h2>
          <p className="text-gray-600">{recentDocuments.length} document{recentDocuments.length > 1 ? 's' : ''} récent{recentDocuments.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les documents récents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Aucun document récent trouvé' : 'Aucun document récent'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Vos documents récents apparaîtront ici'
            }
          </p>
        </div>
      )}

      {/* Documents Grid/List */}
      {filteredDocuments.length > 0 && (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredDocuments.map((doc) => {
            const isFavorite = doc.metadata.tags.includes('favorite');
            
            return viewMode === 'grid' ? (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {isFavorite && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                      <div className="relative">
                        <button
                          onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                          className="p-1 hover:bg-gray-100 rounded"
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
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{doc.type}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.metadata.status)}`}>
                      {doc.metadata.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimestamp(doc.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.metadata.status)}`}>
                      {doc.metadata.status}
                    </span>
                    <span className="text-sm text-gray-500">{formatTimestamp(doc.updatedAt)}</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {isFavorite && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                      <div className="relative">
                        <button
                          onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                          className="p-1 hover:bg-gray-100 rounded"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};