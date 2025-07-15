import React from 'react';
import { FileText, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/assets/images/logo/logo ORGANEUS copy.png" 
                alt="ORGANEUS Logo" 
                className="h-10 w-10"
              />
              <div>
                <h3 className="text-xl font-bold">ORGANEUS</h3>
                <p className="text-blue-400">Docs</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              La solution de référence pour la génération de documents professionnels 
              avec intelligence artificielle intégrée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Produits</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Templates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Générateur IA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Collaboration</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Tutoriels</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Communauté</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">contact@organeus.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} ORGANEUS. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};