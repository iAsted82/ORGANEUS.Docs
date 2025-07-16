export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  title?: string;
  metadata: {
    category: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  extractedText?: string;
  content: string; // Texte extrait
  originalFile: string; // URL/base64
  tags: string[];
  category: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  extractedData?: {
    title?: string;
    summary?: string;
    keyPoints?: string[];
    entities?: string[]; // Noms, dates, montants extraits
  };
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  documentsCount: number;
}

export interface Analysis {
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keyInsights: string[];
  recommendations: string[];
}

export interface GeneratedContent {
  title: string;
  content: string;
  sections: DocumentSection[];
  metadata: {
    sources: string[];
    confidence: number;
    generatedAt: string;
  };
}

export interface DocumentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'table';
  content: string;
  level?: number; // Pour les headings
  items?: string[]; // Pour les listes
}

export interface ExtractedData {
  title: string;
  summary: string;
  keyPoints: string[];
  entities: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface StructuredData {
  summary: string;
  keyPoints: string[];
  entities: string[];
  categories: string[];
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  source: string;
}

export interface DocumentContext {
  knowledgeDocuments: KnowledgeDocument[];
  companyInfo: any;
  documentType: string;
  requirements: string;
}