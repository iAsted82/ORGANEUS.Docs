import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List, 
  BarChart3, 
  Upload,
  Tag,
  Folder,
  FileText,
  TrendingUp,
  Clock,
  Archive
} from 'lucide-react';
import { KnowledgeDocument, Analysis } from '../../types/knowledge';
import { knowledgeBaseService } from '../../services/knowledgeBaseService';
import { DocumentCard } from './DocumentCard';
import { DocumentUploader } from './DocumentUploader';

interface KnowledgeBaseManagerProps {
  selectionMode?: boolean;
  onDocumentsSelected?: (documents: KnowledgeDocument[]) => void;
  selectedDocuments?: KnowledgeDocument[];
}

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({ 
  selectionMode = false, 
  onDocumentsSelected,
  selectedDocuments = [] 
}) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<KnowledgeDocument[]>([]);
  const [analytics, setAnalytics] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploader, setShowUploader] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [localSelectedDocs, setLocalSelectedDocs] = useState<KnowledgeDocument[]>(selectedDocuments);

  useEffect(() => {
    loadDocuments();
    loadAnalytics();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory, selectedTags]);

  // Update parent component when selection changes (in selection mode)
  useEffect(() => {
    if (selectionMode && onDocumentsSelected) {
      onDocumentsSelected(localSelectedDocs);
    }
  }, [localSelectedDocs, selectionMode, onDocumentsSelected]);

  // Update local selection when prop changes
  useEffect(() => {
    if (selectionMode) {
      setLocalSelectedDocs(selectedDocuments);
    }
  }, [selectedDocuments, selectionMode]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await knowledgeBaseService.getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await knowledgeBaseService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    }
  };

  const filterDocuments = async () => {
    try {
      let filtered = documents;

      // Filtrer par recherche
      if (searchTerm) {
        filtered = await knowledgeBaseService.searchDocuments(searchTerm);
      }

      // Filtrer par catégorie
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(doc => doc.category === selectedCategory);
      }

      // Filtrer par tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(doc => 
          selectedTags.some(tag => doc.tags.includes(tag))
        );
      }

      setFilteredDocuments(filtered);
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
    }
  };

  const handleViewDocument = (document: KnowledgeDocument) => {
    // En mode sélection, ajouter/supprimer le document de la sélection
    if (selectionMode) {
      toggleDocumentSelection(document);
      return;
    }
    
    // Sinon, ouvrir une modal ou une page de détail
    console.log('Voir document:', document);
  };

  const toggleDocumentSelection = (document: KnowledgeDocument) => {
    if (selectionMode) {
      const isSelected = localSelectedDocs.some(doc => doc.id === document.id);
      
      if (isSelected) {
        setLocalSelectedDocs(prev => prev.filter(doc => doc.id !== document.id));
      } else {
        setLocalSelectedDocs(prev => [...prev, document]);
      }
    }
  };

  const handleEditDocument = (document: KnowledgeDocument) => {
    // Ouvrir un formulaire d'édition
    console.log('Modifier document:', document);
  };

  const handleDeleteDocument = async (document: KnowledgeDocument) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
      try {
        await knowledgeBaseService.deleteDocument(document.id);
        await loadDocuments();
        await loadAnalytics();
        
        // Si le document est dans la sélection, le retirer
        if (selectionMode) {
          setLocalSelectedDocs(prev => prev.filter(doc => doc.id !== document.id));
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleTagsUpdate = async (document: KnowledgeDocument, tags: string[]) => {
    try {
      await knowledgeBaseService.updateDocument(document.id, { tags });
      await loadDocuments();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des tags:', error);
    }
  };

  const handleUploadComplete = (newDocuments: KnowledgeDocument[]) => {
    setShowUploader(false);
    loadDocuments();
    loadAnalytics();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const categories = knowledgeBaseService.getCategories();
  const allTags = knowledgeBaseService.getAllTags();

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
          <h2 className="text-2xl font-bold text-gray-900">Base de connaissance</h2>
          <p className="text-gray-600">
            {documents.length} document{documents.length > 1 ? 's' : ''} dans votre base de données
            {selectionMode && ` (${localSelectedDocs.length} sélectionné${localSelectedDocs.length > 1 ? 's' : ''})`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!selectionMode && (
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          )}
          <button
            onClick={() => setShowUploader(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter des documents</span>
          </button>
        </div>
      </div>

      {/* Analytics */}
      {showAnalytics && analytics && !selectionMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mots total</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalWords.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(analytics.categories).length}</p>
              </div>
              <Folder className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tags</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.commonThemes.length}</p>
              </div>
              <Tag className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la base de connaissance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="flex items-center space-x-2">
            <Folder className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Vue */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtrer par tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
              ? 'Aucun document trouvé'
              : 'Aucun document dans votre base'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par ajouter des documents à votre base de connaissance'
            }
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Ajouter des documents</span>
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredDocuments.map(document => {
            const isSelected = selectionMode && localSelectedDocs.some(doc => doc.id === document.id);
            
            return (
              <div 
                key={document.id} 
                className={`relative ${isSelected ? 'ring-2 ring-blue-500 rounded-xl' : ''}`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                <DocumentCard
                  document={document}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                  onDelete={handleDeleteDocument}
                  onTagsUpdate={handleTagsUpdate}
                  className={selectionMode ? 'cursor-pointer' : ''}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Uploader Modal */}
      {showUploader && (
        <DocumentUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
};