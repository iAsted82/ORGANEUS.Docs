import React from 'react';
import { Company } from '../../types/auth';
import { Building2, Lock, CheckCircle, ChevronRight } from 'lucide-react';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string;
  onCompanySelect: (companyId: string) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  onCompanySelect
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sélectionnez votre entreprise
        </h3>
        <p className="text-sm text-gray-600">
          Choisissez l'organisation à laquelle vous souhaitez accéder
        </p>
      </div>
      
      <div className="space-y-3">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => company.isActive && onCompanySelect(company.id)}
            disabled={!company.isActive}
            className={`
              group relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${company.isActive 
                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer' 
                : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
              }
              ${selectedCompany === company.id && company.isActive
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : ''
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className={`
                    p-3 rounded-lg transition-all duration-200
                    ${company.isActive 
                      ? 'text-white shadow-md group-hover:shadow-lg' 
                      : 'text-white/60 shadow-sm'
                    }
                  `}
                  style={{ backgroundColor: company.isActive ? company.color : '#9ca3af' }}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${company.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {company.displayName}
                  </div>
                  {company.description && (
                    <div className={`text-sm mt-1 ${company.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                      {company.description}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {company.isActive ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      Disponible
                    </span>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      selectedCompany === company.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Bientôt
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedCompany === company.id && company.isActive && (
              <div className="absolute inset-0 ring-2 ring-blue-400 rounded-xl pointer-events-none opacity-60" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};