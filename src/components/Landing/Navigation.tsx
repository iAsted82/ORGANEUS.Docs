import React, { useState } from 'react';
import { FileText, Menu, X, ArrowRight } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { label: string; href: string }[] = [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/images/logo/logo ORGANEUS copy.png" 
              alt="ORGANEUS Logo" 
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ORGANEUS</h1>
              <p className="text-xs text-blue-600">Docs</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 flex items-center space-x-2">
              <span>Se connecter</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 items-center">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold mt-4 flex items-center justify-center space-x-2 w-full max-w-xs">
                <span>Se connecter</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};