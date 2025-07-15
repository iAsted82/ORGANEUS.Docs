import React from 'react';
import { FileText, Bell, Search, Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/images/logo/logo ORGANEUS copy.png" 
                alt="ORGANEUS Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ORGANEUS</h1>
                <p className="text-xs text-gray-500">Docs</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};