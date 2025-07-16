import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Wand2, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Database,
  User,
  Building2
} from 'lucide-react';
import { DocumentCreationWizard } from './DocumentCreationWizard';

export const CreateDocument: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'scratch' | 'knowledge' | 'ai' | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const creationModes = [
    {
      id: 'scratch',
      title: 'Création depuis zéro',
      description: 'Commencez avec un document vierge et utilisez notre éditeur avancé pour créer votre contenu.',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'Éditeur rich text avancé',
        'Templates de base disponibles',
        'Variables d\'entreprise',
        'Insertion de blocs prédéfinis'
      ]
    },
    {
      id: 'knowledge',
      title: 'Depuis ma base de connaissance',
      description: 'Créez des documents en utilisant vos documents existants comme sources et références.',
      icon: Database,
      color: 'from-green-500 to-green-600',
      benefits: [
        'Accès à tous vos documents',
        'Recherche intelligente',
        'Extraction automatique',
        'Références croisées'
      ]
    },
    {
      id: 'ai',
      title: 'Génération IA assistée',
      description: 'Laissez l\'IA générer du contenu basé sur vos documents et informations d\'entreprise.',
      icon: Wand2,
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Génération automatique',
        'Basé sur votre contexte',
        'Personnalisation avancée',
        'Suggestions intelligentes'
      ]
    }
  ];

  const handleModeSelect = (mode: 'scratch' | 'knowledge' | 'ai') => {
    setSelectedMode(mode);
    setShowWizard(true);
  };

  if (showWizard && selectedMode) {
    return (
      <DocumentCreationWizard
        mode={selectedMode}
        onClose={() => {
          setShowWizard(false);
          setSelectedMode(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau document</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choisissez la méthode qui convient le mieux à vos besoins. 
          Chaque option est conçue pour vous offrir le meilleur résultat selon votre contexte.
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Base de connaissance</p>
              <p className="text-lg font-semibold text-gray-900">5 documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profil configuré</p>
              <p className="text-lg font-semibold text-gray-900">✓ Prêt</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Entreprise</p>
              <p className="text-lg font-semibold text-gray-900">ORGANEUS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modes de création */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {creationModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleModeSelect(mode.id as 'scratch' | 'knowledge' | 'ai')}
            >
              {/* Effet de survol */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                {/* Icône */}
                <div className={`bg-gradient-to-r ${mode.color} p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Titre et description */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {mode.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {mode.description}
                </p>

                {/* Avantages */}
                <div className="space-y-3 mb-8">
                  {mode.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'action */}
                <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 group-hover:bg-blue-600">
                  <span className="font-medium">Choisir cette option</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conseils */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Conseils pour choisir</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Création depuis zéro</h4>
            <p className="text-sm text-gray-600">
              Idéal pour des documents personnalisés ou lorsque vous avez une vision précise du contenu.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Base de connaissance</h4>
            <p className="text-sm text-gray-600">
              Parfait pour réutiliser des informations existantes et créer des documents cohérents.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">IA assistée</h4>
            <p className="text-sm text-gray-600">
              Optimal pour générer rapidement du contenu professionnel et personnalisé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};