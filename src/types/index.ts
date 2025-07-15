export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company: Company;
  preferences: UserPreferences;
  subscription: Subscription;
}

export interface Company {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  website?: string;
  taxId?: string;
}

export interface UserPreferences {
  defaultLanguage: string;
  theme: 'light' | 'dark';
  defaultDocumentType: string;
  autoSave: boolean;
  aiAssistance: boolean;
}

export interface Subscription {
  plan: 'free' | 'premium' | 'enterprise';
  documentsLimit: number;
  aiRequestsLimit: number;
  storageLimit: number;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  content: DocumentContent;
  createdAt: string;
  updatedAt: string;
  versions: DocumentVersion[];
  metadata: DocumentMetadata;
}

export interface DocumentContent {
  sections: DocumentSection[];
  styling: DocumentStyling;
}

export interface DocumentSection {
  id: string;
  type: 'header' | 'paragraph' | 'list' | 'image' | 'table' | 'signature';
  content: string;
  style?: any;
}

export interface DocumentStyling {
  font: string;
  fontSize: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  spacing: {
    margin: string;
    padding: string;
  };
}

export interface DocumentVersion {
  version: number;
  changes: string;
  timestamp: string;
  author: string;
}

export interface DocumentMetadata {
  tags: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'final' | 'sent' | 'archived';
}

export type DocumentType = 
  | 'letter'
  | 'contract'
  | 'invoice'
  | 'report'
  | 'legal'
  | 'hr'
  | 'marketing';

export interface Template {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  content: DocumentContent;
  preview: string;
  category: string;
  isCustom: boolean;
  createdBy?: string;
}

export interface AIService {
  generateContent: (type: DocumentType, context: any) => Promise<string>;
  improveText: (text: string, style: string) => Promise<string>;
  generateImage: (prompt: string, style: string) => Promise<string>;
  translateDocument: (text: string, targetLanguage: string) => Promise<string>;
}