import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

export const LogoManager: React.FC = () => {
  const [currentLogo, setCurrentLogo] = useState('/assets/images/logo/logo ORGANEUS copy.png');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const logoVersions = [
    {
      id: 'current',
      name: 'Logo actuel',
      path: '/assets/images/logo/logo ORGANEUS copy.png',
      size: '512x512',
      format: 'PNG',
      isActive: true
    },
    {
      id: 'original',
      name: 'Version originale',
      path: '/assets/images/logo/logo ORGANEUS.png',
      size: '512x512',
      format: 'PNG',
      isActive: false
    }
  ];

  const previewSizes = [
    { name: 'Navigation', size: '40x40px', demo: 'h-10 w-10' },
    { name: 'Hero Section', size: '56x56px', demo: 'h-14 w-14' },
    { name: 'Login', size: '48x48px', demo: 'h-12 w-12' },
    { name: 'Footer', size: '40x40px', demo: 'h-10 w-10' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogoUrl = e.target?.result as string;
        setCurrentLogo(newLogoUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const setAsActive = (logoId: string) => {
    const selectedLogo = logoVersions.find(logo => logo.id === logoId);
    if (selectedLogo) {
      setCurrentLogo(selectedLogo.path);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion du logo</h3>
          <p className="text-sm text-gray-600">Gérez le logo affiché sur toute la plateforme</p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>{showPreview ? 'Masquer' : 'Aperçu'}</span>
        </button>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Logo mis à jour avec succès</p>
            <p className="text-xs text-green-600">Les modifications sont visibles immédiatement</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Logo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Logo actuel</h4>
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-4">
            <img
              src={currentLogo}
              alt="Logo ORGANEUS"
              className="h-24 w-24 mx-auto object-contain"
            />
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Taille:</strong> Adaptative</p>
            <p><strong>Format:</strong> PNG avec transparence</p>
            <p><strong>Utilisé dans:</strong> Navigation, Footer, Login</p>
          </div>
        </div>

        {/* Upload New Logo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Télécharger un nouveau logo</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Glissez-déposez votre logo ou cliquez pour sélectionner
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Sélectionner un fichier</span>
            </label>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>• Formats acceptés: PNG, JPG, SVG</p>
            <p>• Taille recommandée: 512x512px</p>
            <p>• Fond transparent recommandé</p>
          </div>
        </div>
      </div>

      {/* Logo Versions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">Versions disponibles</h4>
        <div className="grid gap-4">
          {logoVersions.map((logo) => (
            <div
              key={logo.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                logo.isActive || currentLogo === logo.path
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={logo.path}
                    alt={logo.name}
                    className="h-12 w-12 object-contain bg-white rounded-lg p-1"
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">{logo.name}</h5>
                    <p className="text-sm text-gray-600">{logo.size} • {logo.format}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {(logo.isActive || currentLogo === logo.path) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Actif
                    </span>
                  )}
                  <button
                    onClick={() => setAsActive(logo.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Aperçu du logo</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previewSizes.map((preview, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">{preview.name}</h4>
                    <span className="text-sm text-gray-600">{preview.size}</span>
                  </div>
                  <div className="flex items-center justify-center h-20 bg-white rounded-lg">
                    <img
                      src={currentLogo}
                      alt="Preview"
                      className={`object-contain ${preview.demo}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Device Previews */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Aperçu sur différents appareils</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Desktop</p>
                  <div className="bg-gray-100 rounded-lg p-4 mt-2">
                    <div className="bg-white rounded p-2 flex items-center space-x-2">
                      <img src={currentLogo} alt="Desktop preview" className="h-8 w-8" />
                      <span className="text-sm font-semibold">ORGANEUS</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Tablet className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Tablette</p>
                  <div className="bg-gray-100 rounded-lg p-4 mt-2">
                    <div className="bg-white rounded p-2 flex items-center space-x-2">
                      <img src={currentLogo} alt="Tablet preview" className="h-6 w-6" />
                      <span className="text-xs font-semibold">ORGANEUS</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Mobile</p>
                  <div className="bg-gray-100 rounded-lg p-4 mt-2">
                    <div className="bg-white rounded p-2 flex items-center space-x-1">
                      <img src={currentLogo} alt="Mobile preview" className="h-5 w-5" />
                      <span className="text-xs font-semibold">ORGANEUS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};