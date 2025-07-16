export interface CompanyInfo {
  id: string;
  name: string;
  logo: string;
  logoUrl?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
    fax?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  signature?: {
    defaultSignatory: string;
    title: string;
    signatureImage?: string;
  };
  businessInfo: {
    siret?: string;
    tva?: string;
    capital?: string;
    legalForm?: string; // SARL, SAS, etc.
    registrationNumber?: string;
  };
  bankInfo?: {
    iban?: string;
    bic?: string;
    bankName?: string;
  };
  customFields?: Record<string, string>;
  updatedAt: string;
}

export interface CompanyTemplate {
  id: string;
  name: string;
  blocks: TemplateBlock[];
}

export interface TemplateBlock {
  id: string;
  type: 'logo' | 'contact' | 'signature' | 'legal' | 'custom';
  position: 'header' | 'footer' | 'sidebar';
  content: string;
  variables: string[]; // Ex: ["{{company.name}}", "{{contact.email}}"]
}

export interface CompanyInfo {
  id?: string;
  name: string;
  logo: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  signature?: {
    defaultSignatory: string;
    signatureImage?: string;
    title?: string;
  };
  businessInfo: {
    siret?: string;
    tva?: string;
    capital?: string;
    legalForm?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  general: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  legal: {
    registrationNumber?: string;
    taxId?: string;
    legalForm?: string;
  };
  branding: {
    colors?: {
      primary: string;
      secondary: string;
    };
    slogan?: string;
    emailSignature?: string;
  };
}

export interface CompanyTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
}

export interface DocumentVariable {
  key: string;
  value: string;
  type: 'text' | 'image' | 'date' | 'number';
  required: boolean;
  description: string;
}