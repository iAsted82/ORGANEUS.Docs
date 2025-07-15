import React from 'react';
import { TrendingUp, Users, FileText, Clock } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Utilisateurs actifs",
      description: "Professionnels font confiance à ORGANEUS Docs"
    },
    {
      icon: FileText,
      value: "500K+",
      label: "Documents créés",
      description: "Générés chaque mois par nos utilisateurs"
    },
    {
      icon: Clock,
      value: "75%",
      label: "Temps économisé",
      description: "En moyenne sur la création de documents"
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "Disponibilité",
      description: "Garantie avec notre infrastructure cloud"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des résultats qui parlent 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> d'eux-mêmes</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises qui ont déjà transformé 
            leur processus de création documentaire avec ORGANEUS Docs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-center group"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-700 mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};