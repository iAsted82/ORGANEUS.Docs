import React, { useState } from 'react';
import { FileText, Image, File, Tag, Calendar, MoreVertical, Edit, Trash2, Eye, Download } from 'lucide-react';
import { KnowledgeDocument } from '../../types/knowledge';

interface DocumentCardProps {
  document: KnowledgeDocument;
  onView: (document: KnowledgeDocument) => void;
  onEdit: (document: KnowledgeDocument) => void;
  onDelete: (document: KnowledgeDocument) => void;
  onTagsUpdate: (document: KnowledgeDocument, tags: string[]) => void;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  onTagsUpdate,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState(document.tags.join(', '));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'text': return File;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Juridique': 'bg-red-100 text-red-800',
      'Commercial': 'bg-green-100 text-green-800',
      'Technique': 'bg-blue-100 text-blue-800',
      'Branding': 'bg-purple-100 text-purple-800',
      'Processus': 'bg-yellow-100 text-yellow-800',
      'Non classé': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTagsSubmit = () => {
    const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    onTagsUpdate(document, newTags);
    setEditingTags(false);
  };

  const handleTagsCancel = () => {
    setTagInput(document.tags.join(', '));
    setEditingTags(false);
  };

  const FileIcon = getFileIcon(document.type);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(document.type)}`}>
              <FileIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{document.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                  {document.type.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                  {document.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onView(document);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Voir</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(document);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingTags(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Tag className="h-4 w-4" />
                    <span>Modifier tags</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(document);
                      setShowMenu(false);
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

        {/* Content preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{document.content}</p>
        </div>

        {/* Tags */}
        <div className="mb-4">
          {editingTags ? (
            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Séparez les tags par des virgules"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTagsSubmit}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Valider
                </button>
                <button
                  onClick={handleTagsCancel}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {document.tags.length > 0 ? (
                document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Aucun tag</span>
              )}
            </div>
          )}
        </div>

        {/* Key points */}
        {document.extractedData?.keyPoints && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Points clés</h4>
            <ul className="space-y-1">
              {document.extractedData.keyPoints.slice(0, 3).map((point, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(document.uploadedAt)}</span>
          </div>
          <span>{formatSize(document.size)}</span>
        </div>
      </div>
    </div>
  );
};