import React from 'react';
import { FileText, Users, Shield, Zap } from 'lucide-react';
import { LoginPage } from '../Auth/LoginPage';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Colonne gauche - Contenu principal */}
          <div className="space-y-8">
            {/* Logo et branding */}
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/images/logo/logo ORGANEUS copy.png" 
                alt="ORGANEUS Logo" 
                className="h-14 w-14"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ORGANEUS</h1>
                <p className="text-blue-600 font-medium">Docs</p>
              </div>
            </div>

            {/* Titre principal */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Générez vos documents 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> professionnels</span>
                <br />en quelques clics
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Créez, personnalisez et partagez vos documents d'entreprise avec une plateforme 
                moderne intégrant l'intelligence artificielle pour une productivité maximale.
              </p>
            </div>

            {/* Points forts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-center">Templates intelligents</h3>
                <p className="text-sm text-gray-600 text-center">Bibliothèque de modèles professionnels adaptés à votre secteur</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-center">IA intégrée</h3>
                <p className="text-sm text-gray-600 text-center">Génération automatique de contenu et amélioration du texte</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-center">Collaboration</h3>
                <p className="text-sm text-gray-600 text-center">Travaillez en équipe avec des outils de révision en temps réel</p>
              </div>
            </div>
          </div>

          {/* Colonne droite - Bloc de connexion */}
          <div className="flex items-center justify-center">
            <LoginPage />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};