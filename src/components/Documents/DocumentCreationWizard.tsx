import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check, FileText, Database, Wand2 } from 'lucide-react';
import { AdvancedDocumentEditor } from '../Editor/AdvancedDocumentEditor';
import { KnowledgeBaseManager } from '../KnowledgeBase/KnowledgeBaseManager';
import { KnowledgeDocument } from '../../types/knowledge';
import { CompanyInfo } from '../../types/company';
import { companyService } from '../../services/companyService';

interface DocumentCreationWizardProps {
  mode: 'scratch' | 'knowledge' | 'ai';
  onClose: () => void;
}

export const DocumentCreationWizard: React.FC<DocumentCreationWizardProps> = ({ mode, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [documentType, setDocumentType] = useState<'letter' | 'contract' | 'report' | 'other'>('letter');
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<KnowledgeDocument[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  // Total steps depends on mode
  const totalSteps = mode === 'scratch' ? 2 : mode === 'knowledge' ? 3 : 4;

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const info = await companyService.getCompanyInfo();
        setCompanyInfo(info);
      } catch (error) {
        console.error("Erreur lors du chargement des informations de l'entreprise:", error);
      }
    };

    loadCompanyInfo();
  }, []);

  // Handle document selection from knowledge base
  const handleDocumentsSelected = (docs: KnowledgeDocument[]) => {
    setSelectedDocuments(docs);
  };

  // Go to next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Go to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 1: // Document type & title
        return documentTitle.trim().length > 0;
      case 2: // Knowledge base selection (if applicable)
        if (mode === 'scratch') return true;
        if (mode === 'knowledge' || mode === 'ai') return selectedDocuments.length > 0;
        return true;
      case 3: // AI prompt (if applicable)
        if (mode === 'ai') return aiPrompt.trim().length > 0;
        return true;
      default:
        return true;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Informations du document";
      case 2:
        if (mode === 'scratch') return "Édition du document";
        return "Sélection des sources";
      case 3:
        if (mode === 'knowledge') return "Édition du document";
        return "Instructions pour l'IA";
      case 4:
        return "Édition du document";
      default:
        return "";
    }
  };

  // Step indicator component
  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={idx} className="flex items-center">
              {idx > 0 && (
                <div className={`h-0.5 w-8 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-blue-100 text-blue-600 border border-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du document
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Entrez un titre pour votre document"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de document
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { id: 'letter', label: 'Lettre', icon: FileText },
                  { id: 'contract', label: 'Contrat', icon: FileText },
                  { id: 'report', label: 'Rapport', icon: FileText },
                  { id: 'other', label: 'Autre', icon: FileText },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = documentType === type.id;
                  
                  return (
                    <div
                      key={type.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                      onClick={() => setDocumentType(type.id as any)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-lg mb-2 ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 2:
        if (mode === 'scratch') {
          // Show editor directly for 'from scratch' mode
          return <AdvancedDocumentEditor 
                    title={documentTitle} 
                    documentType={documentType}
                    knowledgeDocuments={[]}
                    companyInfo={companyInfo}
                  />;
        } else {
          // Show knowledge base for other modes
          return (
            <div className="h-[calc(100vh-200px)]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sélectionnez les documents à utiliser comme sources
              </h3>
              <KnowledgeBaseManager 
                selectionMode={true}
                onDocumentsSelected={handleDocumentsSelected}
                selectedDocuments={selectedDocuments}
              />
            </div>
          );
        }
      case 3:
        if (mode === 'knowledge') {
          // Show editor with selected documents for 'knowledge' mode
          return <AdvancedDocumentEditor 
                    title={documentTitle} 
                    documentType={documentType}
                    knowledgeDocuments={selectedDocuments}
                    companyInfo={companyInfo}
                  />;
        } else if (mode === 'ai') {
          // Show AI prompt for 'ai' mode
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions pour l'IA
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Décrivez ce que vous souhaitez que l'IA génère. Plus vos instructions sont précises, meilleur sera le résultat."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-gray-900 mb-2">Conseils pour de meilleurs résultats</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span>Soyez spécifique sur le format et le style souhaités</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span>Mentionnez les informations clés à inclure</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span>Précisez le ton (formel, commercial, technique...)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span>Indiquez les sections attendues dans le document</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Documents sélectionnés ({selectedDocuments.length})</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-52 overflow-y-auto">
                  {selectedDocuments.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedDocuments.map(doc => (
                        <li key={doc.id} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-blue-500">•</span>
                          <span>{doc.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">Aucun document sélectionné</p>
                  )}
                </div>
              </div>
            </div>
          );
        }
        return null;
      case 4:
        // Final step for AI mode - show editor with AI generated content
        return <AdvancedDocumentEditor 
                  title={documentTitle} 
                  documentType={documentType}
                  knowledgeDocuments={selectedDocuments}
                  companyInfo={companyInfo}
                  aiPrompt={aiPrompt}
                />;
      default:
        return null;
    }
  };

  // Mode indicator icon
  const getModeIcon = () => {
    switch (mode) {
      case 'scratch':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'knowledge':
        return <Database className="h-5 w-5 text-green-600" />;
      case 'ai':
        return <Wand2 className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getModeName = () => {
    switch (mode) {
      case 'scratch':
        return "Depuis zéro";
      case 'knowledge':
        return "Base de connaissance";
      case 'ai':
        return "IA assistée";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              {getModeIcon()}
              <h2 className="text-lg font-semibold text-gray-900">
                {getModeName()} - {getStepTitle()}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentStep > 1 && currentStep <= totalSteps && !(mode === 'scratch' && currentStep === 2) && !(mode === 'knowledge' && currentStep === 3) && !(mode === 'ai' && currentStep === 4) && (
              <button
                onClick={handlePrevious}
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>
            )}
            
            {currentStep < totalSteps && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Suivant</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {currentStep === 1 && <StepIndicator />}
        
        {renderStepContent()}
      </div>
    </div>
  );
};