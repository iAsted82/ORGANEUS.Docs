import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { User as UserType } from '../../types/auth';
import { UpdateUserRequest } from '../../types/admin';
import { adminService } from '../../services/adminService';

interface EditUserFormProps {
  user: UserType;
  onClose: () => void;
  onUserUpdated: (user: UserType) => void;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    companyId: user.company.id,
    isActive: user.isActive
  });

  const [errors, setErrors] = useState<Partial<UpdateUserRequest>>({});
  const [loading, setLoading] = useState(false);

  const companies = [
    { id: 'organeus', name: 'ORGANEUS' },
    { id: 'oka-tech', name: 'OKA Tech' },
    { id: 'organeus-gabon', name: 'ORGANEUS Gabon' },
    { id: 'coursi', name: 'COURSI' },
    { id: 'annast', name: 'ANNAST' }
  ];

  const validateForm = () => {
    const newErrors: Partial<UpdateUserRequest> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.name) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'L\'entreprise est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedUser = await adminService.updateUser(formData);
      onUserUpdated(updatedUser);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrors({ email: 'Erreur lors de la mise à jour de l\'utilisateur' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateUserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Modifier l'utilisateur
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="jean.dupont@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={user.role === 'super_admin'}
                >
                  <option value="collaborator">Collaborateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="super_admin">Super Administrateur</option>
                </select>
              </div>
              {user.role === 'super_admin' && (
                <p className="mt-1 text-xs text-gray-500">
                  Le rôle de super administrateur ne peut pas être modifié
                </p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.companyId}
                  onChange={(e) => handleChange('companyId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.companyId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner une entreprise</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.companyId && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.companyId}</span>
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Compte actif
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{loading ? 'Mise à jour...' : 'Mettre à jour'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};