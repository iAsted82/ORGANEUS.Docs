import React, { useState } from 'react';
import { Search, Filter, Plus, Grid, List } from 'lucide-react';
import { Template } from '../../types';
import { TemplateCard } from './TemplateCard';

export const TemplateLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Contrat de prestation',
      type: 'contract',
      description: 'Contrat standard pour prestations de services avec clauses personnalisables',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/1/preview',
      category: 'Juridique',
      isCustom: false
    },
    {
      id: '2',
      name: 'Facture commerciale',
      type: 'invoice',
      description: 'Template de facture avec calculs automatiques et mentions légales',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/2/preview',
      category: 'Comptabilité',
      isCustom: false
    },
    {
      id: '3',
      name: 'Lettre de motivation',
      type: 'letter',
      description: 'Modèle de lettre de motivation personnalisable et professionnel',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/3/preview',
      category: 'RH',
      isCustom: false
    },
    {
      id: '4',
      name: 'Rapport d\'activité',
      type: 'report',
      description: 'Template de rapport mensuel avec graphiques et analyses',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/4/preview',
      category: 'Reporting',
      isCustom: false
    },
    {
      id: '5',
      name: 'Conditions générales',
      type: 'legal',
      description: 'CGV complètes pour e-commerce avec clauses RGPD',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/5/preview',
      category: 'Juridique',
      isCustom: false
    },
    {
      id: '6',
      name: 'Offre d\'emploi',
      type: 'hr',
      description: 'Template d\'offre d\'emploi avec description de poste détaillée',
      content: { sections: [], styling: { font: 'Arial', fontSize: '12px', colors: { primary: '#000', secondary: '#666', text: '#333' }, spacing: { margin: '20px', padding: '15px' } } },
      preview: '/api/templates/6/preview',
      category: 'RH',
      isCustom: false
    }
  ];

  const categories = ['all', 'Juridique', 'Comptabilité', 'RH', 'Reporting', 'Marketing'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bibliothèque de templates</h2>
          <p className="text-gray-600">Choisissez un modèle pour commencer rapidement</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg">
          <Plus className="h-5 w-5" />
          <span>Créer un template</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Toutes les catégories' : category}
              </option>
            ))}
          </select>
          
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
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={(template) => console.log('Template selected:', template)}
            onPreview={(template) => console.log('Template preview:', template)}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};