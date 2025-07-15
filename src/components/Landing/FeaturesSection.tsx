import React from 'react';
import { 
  FileText, 
  Wand2, 
  Users, 
  Shield, 
  Clock, 
  BarChart3,
  Palette,
  Download,
  Globe
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Templates professionnels",
      description: "Bibliothèque complète de modèles pour tous vos besoins : contrats, factures, lettres, rapports et plus encore.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Wand2,
      title: "Intelligence artificielle",
      description: "Génération automatique de contenu, amélioration du texte et suggestions contextuelles pour une rédaction optimale.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Collaboration en temps réel",
      description: "Travaillez en équipe avec des outils de révision, commentaires et approbations pour une productivité maximale.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Chiffrement des données, authentification sécurisée et conformité aux standards de sécurité internationaux.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Historique et versions",
      description: "Sauvegarde automatique, historique complet des modifications et gestion des versions pour ne rien perdre.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: BarChart3,
      title: "Analytics avancées",
      description: "Statistiques d'utilisation, insights sur la productivité et rapports détaillés pour optimiser vos workflows.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Palette,
      title: "Personnalisation complète",
      description: "Adaptez l'apparence de vos documents avec des thèmes, couleurs et éléments de branding personnalisés.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Download,
      title: "Export multi-formats",
      description: "Exportez vos documents en PDF, Word, HTML ou d'autres formats selon vos besoins professionnels.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Globe,
      title: "Multi-langues",
      description: "Interface disponible en plusieurs langues avec support de la traduction automatique de vos documents.",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités complètes pour 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> votre productivité</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités qui font d'ORGANEUS Docs la solution 
            de référence pour la génération de documents professionnels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:scale-102"
              >
                <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};