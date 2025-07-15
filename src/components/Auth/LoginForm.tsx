import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  selectedCompany: string;
  onLogin: (credentials: LoginCredentials) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  selectedCompany,
  onLogin,
  isLoading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});

  const validateForm = () => {
    const errors: {email?: string, password?: string} = {};
    
    if (!email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!password) {
      errors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin({
        email,
        password,
        companyId: selectedCompany
      });
    }
  };

  const getTestCredentials = () => {
    if (selectedCompany === 'organeus') {
      return [
        { email: 'admin@organeus.com', password: '@sted1982*', role: 'Super Administrateur' },
        { email: '+33 6 61 00 26 16', password: '@sted1982*', role: 'Super Administrateur (Téléphone)' }
      ];
    } else if (selectedCompany === 'oka-tech') {
      return [
        { email: 'admin@okatech.com', password: 'okatech123', role: 'Administrateur' },
        { email: 'collaborateur@okatech.com', password: 'CollabOKA2024!', role: 'Collaborateur' }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Connexion</h4>
        <p className="text-sm text-gray-600">
          Saisissez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse e-mail ou téléphone
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User className="h-5 w-5" />
            </div>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({...prev, email: undefined}));
              }}
              className={`
                w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200
                ${fieldErrors.email 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'
                }
                focus:ring-2 focus:outline-none placeholder-gray-400
              `}
              placeholder="votre@email.com ou +33 6 XX XX XX XX"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{fieldErrors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({...prev, password: undefined}));
              }}
              className={`
                w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-200
                ${fieldErrors.password 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-200'
                }
                focus:ring-2 focus:outline-none placeholder-gray-400
              `}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {fieldErrors.password && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{fieldErrors.password}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedCompany}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2
            ${isLoading || !selectedCompany
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <span>Se connecter</span>
          )}
        </button>
      </form>

      {/* Test Accounts */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Comptes de test disponibles</h4>
        <div className="space-y-3">
          {getTestCredentials().map((cred, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-sm text-gray-900">{cred.role}</span>
                </div>
                <button
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                    setFieldErrors({});
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-200"
                  disabled={isLoading}
                >
                  Utiliser
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3" />
                  <span>{cred.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-3 w-3" />
                  <span>{cred.password}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};