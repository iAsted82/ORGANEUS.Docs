export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  content: string; // Texte extrait
  originalFile: string; // URL/base64
  tags: string[];
  category: string;
  uploadedAt: string;
  size: number;
  extractedData?: {
    title?: string;
    summary?: string;
    keyPoints?: string[];
  };
}

export interface ExtractedData {
  title: string;
  summary: string;
  keyPoints: string[];
  entities: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface Analysis {
  totalDocuments: number;
  totalWords: number;
  commonThemes: string[];
  keyEntities: string[];
  documentTypes: Record<string, number>;
  categories: Record<string, number>;
}

export interface GeneratedContent {
  content: string;
  sources: string[];
  confidence: number;
  suggestedTitle: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    complexity: 'simple' | 'medium' | 'complex';
  };
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