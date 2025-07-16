import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  User, 
  FileText, 
  Shield,
  Plus
} from 'lucide-react';
import { CompanyInfo, CompanyTemplate } from '../../types/company';
import { companyService } from '../../services/companyService';

interface CompanyInfoWidgetProps {
  companyInfo: CompanyInfo;
  onInsertBlock: (blockId: string) => void;
}

export const CompanyInfoWidget: React.FC<CompanyInfoWidgetProps> = ({ companyInfo, onInsertBlock }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'blocks'>('info');
  
  // Récupérer les blocs prédéfinis
  const companyBlocks = companyService.getCompanyTemplates();

  // Grouper les blocs par catégorie
  const blocksByCategory: Record<string, CompanyTemplate[]> = {};
  companyBlocks.forEach(block => {
    if (!blocksByCategory[block.category]) {
      blocksByCategory[block.category] = [];
    }
    blocksByCategory[block.category].push(block);
  });

  // Insérer le logo
  const insertLogo = () => {
    if (companyInfo.logo) {
      // Dans une implémentation réelle, on utiliserait un éditeur riche qui
      // fournit une API pour insérer des images
      console.log('Insertion du logo:', companyInfo.logo);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 px-3 text-sm font-medium ${
            activeTab === 'info'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 py-2 px-3 text-sm font-medium ${
            activeTab === 'blocks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Blocs prédéfinis
        </button>
      </div>
      
      {activeTab === 'info' && (
        <div className="space-y-4">
          {/* Logo */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {companyInfo.logo ? (
                  <img src={companyInfo.logo} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <Building2 className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Logo</p>
                <p className="text-xs text-gray-500">Image de l'entreprise</p>
              </div>
            </div>
            <button
              onClick={insertLogo}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Insérer
            </button>
          </div>
          
          {/* Informations de base */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase text-gray-500">Entreprise</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="font-medium text-gray-900">{companyInfo.name}</p>
              {companyInfo.businessInfo.legalForm && (
                <p className="text-sm text-gray-600">{companyInfo.businessInfo.legalForm}</p>
              )}
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase text-gray-500">Contact</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{companyInfo.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{companyInfo.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{companyInfo.contact.website}</span>
              </div>
            </div>
          </div>
          
          {/* Adresse */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase text-gray-500">Adresse</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">{companyInfo.address.street}</p>
                  <p className="text-sm text-gray-600">
                    {companyInfo.address.postalCode} {companyInfo.address.city}
                  </p>
                  <p className="text-sm text-gray-600">{companyInfo.address.country}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Signataire */}
          {companyInfo.signature && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase text-gray-500">Signataire</h3>
              <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{companyInfo.signature.defaultSignatory}</p>
                  {companyInfo.signature.title && (
                    <p className="text-xs text-gray-600">{companyInfo.signature.title}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Informations légales */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase text-gray-500">Informations légales</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-1">
              {companyInfo.businessInfo.siret && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">SIRET: {companyInfo.businessInfo.siret}</span>
                </div>
              )}
              {companyInfo.businessInfo.tva && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">TVA: {companyInfo.businessInfo.tva}</span>
                </div>
              )}
              {companyInfo.businessInfo.capital && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Capital: {companyInfo.businessInfo.capital}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          {Object.entries(blocksByCategory).map(([category, blocks]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-medium uppercase text-gray-500">{category}</h3>
              {blocks.map(block => (
                <div 
                  key={block.id}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => onInsertBlock(block.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {category === 'Contact' ? (
                          <Mail className="h-4 w-4 text-blue-600" />
                        ) : category === 'Signature' ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{block.name}</p>
                        <p className="text-xs text-gray-500">{block.description}</p>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};