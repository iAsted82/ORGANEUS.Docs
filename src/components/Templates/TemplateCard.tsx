import React from 'react';
import { FileText, Star, Eye, Download } from 'lucide-react';
import { Template } from '../../types';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, onPreview }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'letter': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-green-100 text-green-800';
      case 'invoice': return 'bg-purple-100 text-purple-800';
      case 'report': return 'bg-orange-100 text-orange-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-indigo-100 text-indigo-800';
      case 'marketing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                {template.type}
              </span>
            </div>
          </div>
          {template.isCustom && (
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {template.category}
          </span>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onPreview(template)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Aperçu"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelect(template)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Utiliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};