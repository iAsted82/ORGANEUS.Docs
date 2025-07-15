import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CompanySelector } from './CompanySelector';
import { LoginForm } from './LoginForm';
import { LoginCredentials } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { login, isLoading, companies } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null);
    setSuccess(false);
    
    const success = await login(credentials);
    
    if (success) {
      setSuccess(true);
    } else {
      setError('Identifiants incorrects ou accès non autorisé');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/assets/images/logo/logo ORGANEUS copy.png" 
              alt="ORGANEUS Logo" 
              className="h-12 w-12"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Accès à la plateforme</h2>
          <p className="text-blue-100 text-sm">
            Connectez-vous à votre espace ORGANEUS Docs
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Connexion réussie</p>
                <p className="text-xs text-green-600">Redirection en cours...</p>
              </div>
            </div>
          )}

          {/* Global Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Erreur de connexion</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <CompanySelector
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={setSelectedCompany}
            />
            
            {selectedCompany && (
              <div className="border-t border-gray-200 pt-8">
                <LoginForm
                  selectedCompany={selectedCompany}
                  onLogin={handleLogin}
                  isLoading={isLoading}
                  error={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};