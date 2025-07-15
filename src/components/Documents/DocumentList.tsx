import React, { useState } from 'react';
import { Search, Filter, Grid, List, FileText, Star, Clock, MoreVertical } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: string;
  lastModified: string;
  status: 'draft' | 'final' | 'sent' | 'archived';
  isFavorite: boolean;
  size: string;
}

export const DocumentList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const documents: Document[] = [
    {
      id: '1',
      title: 'Contrat de prestation - Client ABC',
      type: 'Contrat',
      lastModified: 'Il y a 2 heures',
      status: 'draft',
      isFavorite: true,
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Facture #2024-001',
      type: 'Facture',
      lastModified: 'Il y a 4 heures',
      status: 'final',
      isFavorite: false,
      size: '1.2 MB'
    },
    {
      id: '3',
      title: 'Rapport mensuel janvier',
      type: 'Rapport',
      lastModified: 'Hier',
      status: 'sent',
      isFavorite: true,
      size: '5.8 MB'
    },
    {
      id: '4',
      title: 'Lettre de recommandation',
      type: 'Lettre',
      lastModified: 'Il y a 2 jours',
      status: 'final',
      isFavorite: false,
      size: '0.8 MB'
    },
    {
      id: '5',
      title: 'Conditions générales de vente',
      type: 'Juridique',
      lastModified: 'Il y a 3 jours',
      status: 'archived',
      isFavorite: false,
      size: '3.2 MB'
    },
    {
      id: '6',
      title: 'Offre d\'emploi développeur',
      type: 'RH',
      lastModified: 'Il y a 1 semaine',
      status: 'sent',
      isFavorite: true,
      size: '1.5 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Documents</h2>
          <p className="text-gray-600">{documents.length} documents au total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filtrer</span>
          </button>
          
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.isFavorite && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{doc.type}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{doc.lastModified}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="divide-y divide-gray-100">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{doc.lastModified}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.isFavorite && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};