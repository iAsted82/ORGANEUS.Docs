import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Upload, 
  Save,
  User,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CompanyInfo } from '../../types/company';
import { companyService } from '../../services/companyService';

export const CompanyProfile: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      const info = await companyService.getCompanyInfo();
      setCompanyInfo(info);
    } catch (error) {
      console.error('Erreur lors du chargement des informations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyInfo) return;

    try {
      setSaving(true);
      await companyService.updateCompanyInfo(companyInfo);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !companyInfo) return;

    try {
      const logoUrl = await companyService.uploadLogo(file);
      setCompanyInfo(prev => prev ? { ...prev, logo: logoUrl } : null);
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
    }
  };

  const handleSignatureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !companyInfo) return;

    try {
      const signatureUrl = await companyService.uploadSignature(file);
      setCompanyInfo(prev => prev ? {
        ...prev,
        signature: {
          ...prev.signature,
          signatureImage: signatureUrl
        }
      } : null);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la signature:', error);
    }
  };

  const updateField = (path: string, value: string) => {
    if (!companyInfo) return;

    const keys = path.split('.');
    const updatedInfo = { ...companyInfo };
    let current: any = updatedInfo;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setCompanyInfo(updatedInfo);
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Réseaux sociaux', icon: Globe },
    { id: 'legal', label: 'Informations légales', icon: Shield },
    { id: 'signature', label: 'Signature', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600">Impossible de charger les informations de l'entreprise</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profil de l'entreprise</h2>
          <p className="text-gray-600">Gérez les informations de votre entreprise</p>
        </div>
        <div className="flex items-center space-x-3">
          {saved && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Sauvegardé</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>

      {/* Aperçu */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
            {companyInfo.logo ? (
              <img src={companyInfo.logo} alt="Logo" className="w-12 h-12 object-contain" />
            ) : (
              <Building2 className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{companyInfo.name}</h3>
            <p className="text-gray-600">{companyInfo.contact.email}</p>
            <p className="text-gray-600">{companyInfo.address.city}, {companyInfo.address.country}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de l'entreprise
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    {companyInfo.logo ? (
                      <img src={companyInfo.logo} alt="Logo" className="w-20 h-20 object-contain" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Changer le logo</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forme juridique
                  </label>
                  <select
                    value={companyInfo.businessInfo.legalForm || ''}
                    onChange={(e) => updateField('businessInfo.legalForm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="SAS">SAS</option>
                    <option value="SARL">SARL</option>
                    <option value="SA">SA</option>
                    <option value="EURL">EURL</option>
                    <option value="SNC">SNC</option>
                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital social
                  </label>
                  <input
                    type="text"
                    value={companyInfo.businessInfo.capital || ''}
                    onChange={(e) => updateField('businessInfo.capital', e.target.value)}
                    placeholder="ex: 100 000€"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={companyInfo.contact.email}
                    onChange={(e) => updateField('contact.email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={companyInfo.contact.phone}
                    onChange={(e) => updateField('contact.phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  value={companyInfo.contact.website}
                  onChange={(e) => updateField('contact.website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={companyInfo.address.street}
                  onChange={(e) => updateField('address.street', e.target.value)}
                  placeholder="Rue et numéro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={companyInfo.address.postalCode}
                    onChange={(e) => updateField('address.postalCode', e.target.value)}
                    placeholder="Code postal"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={companyInfo.address.city}
                    onChange={(e) => updateField('address.city', e.target.value)}
                    placeholder="Ville"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={companyInfo.address.country}
                    onChange={(e) => updateField('address.country', e.target.value)}
                    placeholder="Pays"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia?.linkedin || ''}
                  onChange={(e) => updateField('socialMedia.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/votre-entreprise"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia?.twitter || ''}
                  onChange={(e) => updateField('socialMedia.twitter', e.target.value)}
                  placeholder="https://twitter.com/votre-entreprise"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia?.facebook || ''}
                  onChange={(e) => updateField('socialMedia.facebook', e.target.value)}
                  placeholder="https://facebook.com/votre-entreprise"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIRET
                </label>
                <input
                  type="text"
                  value={companyInfo.businessInfo.siret || ''}
                  onChange={(e) => updateField('businessInfo.siret', e.target.value)}
                  placeholder="14 chiffres"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro TVA
                </label>
                <input
                  type="text"
                  value={companyInfo.businessInfo.tva || ''}
                  onChange={(e) => updateField('businessInfo.tva', e.target.value)}
                  placeholder="ex: FR12345678901"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'signature' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signataire par défaut
                  </label>
                  <input
                    type="text"
                    value={companyInfo.signature?.defaultSignatory || ''}
                    onChange={(e) => updateField('signature.defaultSignatory', e.target.value)}
                    placeholder="Nom du signataire"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre / Fonction
                  </label>
                  <input
                    type="text"
                    value={companyInfo.signature?.title || ''}
                    onChange={(e) => updateField('signature.title', e.target.value)}
                    placeholder="ex: Directeur Général"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de signature
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {companyInfo.signature?.signatureImage ? (
                      <img
                        src={companyInfo.signature.signatureImage}
                        alt="Signature"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Changer la signature</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG jusqu'à 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};