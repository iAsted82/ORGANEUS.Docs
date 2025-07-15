import React from 'react';
import { FileText, Clock, Star, MoreVertical } from 'lucide-react';

interface RecentDocument {
  id: string;
  title: string;
  type: string;
  lastModified: string;
  status: 'draft' | 'final' | 'sent';
  isFavorite: boolean;
}

interface RecentDocumentsProps {
  documents: RecentDocument[];
  onDocumentClick: (doc: RecentDocument) => void;
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents, onDocumentClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Documents récents</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onDocumentClick(doc)}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{doc.lastModified}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
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
  );
};