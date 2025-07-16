import React from 'react';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { CompanyInfo } from '../../types/company';

interface CompanyInfoWidgetProps {
  companyInfo: CompanyInfo;
  onInsert: (content: string) => void;
}

export const CompanyInfoWidget: React.FC<CompanyInfoWidgetProps> = ({
  companyInfo,
  onInsert
}) => {
  const formatAddress = () => {
    const { street, city, postalCode, country } = companyInfo.address;
    return `${street}, ${postalCode} ${city}, ${country}`;
  };

  const blocks = [
    {
      id: 'header',
      title: 'En-tête complet',
      content: `${companyInfo.name}
${formatAddress()}
Tél: ${companyInfo.contact.phone}
Email: ${companyInfo.contact.email}
${companyInfo.contact.website ? `Web: ${companyInfo.contact.website}` : ''}`
    },
    {
      id: 'contact',
      title: 'Bloc contact',
      content: `Contact:
${companyInfo.contact.email}
${companyInfo.contact.phone}`
    },
    {
      id: 'legal',
      title: 'Mentions légales',
      content: `${companyInfo.name}
${companyInfo.businessInfo.legalForm || 'SAS'} au capital de ${companyInfo.businessInfo.capital || 'XX XXX'}€
SIRET: ${companyInfo.businessInfo.siret || 'XXX XXX XXX XXXXX'}
TVA: ${companyInfo.businessInfo.tva || 'FRXX XXXXXXXXX'}`
    },
    {
      id: 'signature',
      title: 'Bloc signature',
      content: `Cordialement,

${companyInfo.signature?.defaultSignatory || '[Nom]'}
${companyInfo.signature?.title || '[Titre]'}
${companyInfo.name}`
    }
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          {companyInfo.logo ? (
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-12 w-12 object-contain"
            />
          ) : (
            <Building2 className="h-12 w-12 text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{companyInfo.name}</h3>
            <p className="text-sm text-gray-500">{companyInfo.businessInfo.legalForm || 'Entreprise'}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{formatAddress()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{companyInfo.contact.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{companyInfo.contact.email}</span>
          </div>
          {companyInfo.contact.website && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <span>{companyInfo.contact.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Blocs à insérer</h4>
        {blocks.map(block => (
          <button
            key={block.id}
            onClick={() => onInsert(block.content)}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-sm text-gray-900">{block.title}</p>
            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line truncate">
              {block.content.split('\n')[0]}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};