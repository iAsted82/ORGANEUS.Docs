export interface CompanyInfo {
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