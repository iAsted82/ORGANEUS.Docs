import { Document, Template, DocumentType } from '../types';

export interface DocumentFilter {
  type?: DocumentType;
  status?: 'draft' | 'final' | 'sent' | 'archived';
  isFavorite?: boolean;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DocumentStats {
  totalDocuments: number;
  documentsThisMonth: number;
  documentsThisWeek: number;
  documentsToday: number;
  favoriteCount: number;
  archivedCount: number;
  draftCount: number;
  finalCount: number;
  sentCount: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'created' | 'modified' | 'shared' | 'archived';
  documentTitle: string;
  documentId: string;
  timestamp: string;
  userId: string;
  userName: string;
}

class DocumentService {
  private documents: Document[] = [];
  private templates: Template[] = [];
  private recentActivities: RecentActivity[] = [];

  constructor() {
    this.initializeEmptyData();
  }

  private initializeEmptyData() {
    this.documents = [];
    this.templates = [];
    this.recentActivities = [];
  }

  // Document Management
  async createDocument(documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'versions'>): Promise<Document> {
    const document: Document = {
      id: `doc_${Date.now()}`,
      ...documentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [{
        version: 1,
        changes: 'Document créé',
        timestamp: new Date().toISOString(),
        author: 'Utilisateur actuel'
      }]
    };

    this.documents.push(document);
    this.addRecentActivity('created', document.title, document.id);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) throw new Error('Document non trouvé');

    const document = this.documents[index];
    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Add version history
    if (updates.content) {
      updatedDocument.versions.push({
        version: document.versions.length + 1,
        changes: 'Document modifié',
        timestamp: new Date().toISOString(),
        author: 'Utilisateur actuel'
      });
    }

    this.documents[index] = updatedDocument;
    this.addRecentActivity('modified', updatedDocument.title, id);
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) throw new Error('Document non trouvé');
    
    const document = this.documents[index];
    this.documents.splice(index, 1);
    this.addRecentActivity('archived', document.title, id);
  }

  async getDocuments(filter: DocumentFilter = {}): Promise<Document[]> {
    let filtered = [...this.documents];

    if (filter.type) {
      filtered = filtered.filter(doc => doc.type === filter.type);
    }

    if (filter.status) {
      filtered = filtered.filter(doc => doc.metadata.status === filter.status);
    }

    if (filter.isFavorite !== undefined) {
      filtered = filtered.filter(doc => doc.metadata.tags.includes('favorite') === filter.isFavorite);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.content.sections.some(section => section.content.toLowerCase().includes(term))
      );
    }

    if (filter.dateFrom) {
      filtered = filtered.filter(doc => new Date(doc.createdAt) >= new Date(filter.dateFrom!));
    }

    if (filter.dateTo) {
      filtered = filtered.filter(doc => new Date(doc.createdAt) <= new Date(filter.dateTo!));
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getDocumentById(id: string): Promise<Document | null> {
    return this.documents.find(doc => doc.id === id) || null;
  }

  // Recent Documents
  async getRecentDocuments(limit: number = 10): Promise<Document[]> {
    return this.documents
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  // Favorites
  async getFavoriteDocuments(): Promise<Document[]> {
    return this.documents.filter(doc => doc.metadata.tags.includes('favorite'));
  }

  async toggleFavorite(id: string): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (!document) throw new Error('Document non trouvé');

    const isFavorite = document.metadata.tags.includes('favorite');
    const tags = isFavorite 
      ? document.metadata.tags.filter(tag => tag !== 'favorite')
      : [...document.metadata.tags, 'favorite'];

    return this.updateDocument(id, {
      metadata: { ...document.metadata, tags }
    });
  }

  // Archived Documents
  async getArchivedDocuments(): Promise<Document[]> {
    return this.documents.filter(doc => doc.metadata.status === 'archived');
  }

  async archiveDocument(id: string): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (!document) throw new Error('Document non trouvé');

    const updated = await this.updateDocument(id, {
      metadata: { ...document.metadata, status: 'archived' }
    });

    this.addRecentActivity('archived', document.title, id);
    return updated;
  }

  async unarchiveDocument(id: string): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (!document) throw new Error('Document non trouvé');

    return this.updateDocument(id, {
      metadata: { ...document.metadata, status: 'draft' }
    });
  }

  // Template Management
  async createTemplate(templateData: Omit<Template, 'id'>): Promise<Template> {
    const template: Template = {
      id: `template_${Date.now()}`,
      ...templateData
    };

    this.templates.push(template);
    return template;
  }

  async getTemplates(category?: string): Promise<Template[]> {
    let filtered = [...this.templates];

    if (category && category !== 'all') {
      filtered = filtered.filter(template => template.category === category);
    }

    return filtered;
  }

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templates.find(template => template.id === id) || null;
  }

  async createDocumentFromTemplate(templateId: string, title: string): Promise<Document> {
    const template = await this.getTemplateById(templateId);
    if (!template) throw new Error('Template non trouvé');

    return this.createDocument({
      userId: 'current-user',
      title,
      type: template.type,
      content: template.content,
      metadata: {
        tags: ['from-template'],
        category: template.category,
        priority: 'medium',
        status: 'draft'
      }
    });
  }

  // Statistics
  async getDocumentStats(): Promise<DocumentStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const documentsThisMonth = this.documents.filter(doc => 
      new Date(doc.createdAt) >= startOfMonth
    ).length;

    const documentsThisWeek = this.documents.filter(doc => 
      new Date(doc.createdAt) >= startOfWeek
    ).length;

    const documentsToday = this.documents.filter(doc => 
      new Date(doc.createdAt) >= startOfDay
    ).length;

    return {
      totalDocuments: this.documents.length,
      documentsThisMonth,
      documentsThisWeek,
      documentsToday,
      favoriteCount: this.documents.filter(doc => doc.metadata.tags.includes('favorite')).length,
      archivedCount: this.documents.filter(doc => doc.metadata.status === 'archived').length,
      draftCount: this.documents.filter(doc => doc.metadata.status === 'draft').length,
      finalCount: this.documents.filter(doc => doc.metadata.status === 'final').length,
      sentCount: this.documents.filter(doc => doc.metadata.status === 'sent').length,
      recentActivity: this.recentActivities.slice(0, 10)
    };
  }

  // Recent Activities
  private addRecentActivity(type: RecentActivity['type'], documentTitle: string, documentId: string) {
    const activity: RecentActivity = {
      id: `activity_${Date.now()}`,
      type,
      documentTitle,
      documentId,
      timestamp: new Date().toISOString(),
      userId: 'current-user',
      userName: 'Utilisateur actuel'
    };

    this.recentActivities.unshift(activity);
    
    // Keep only last 50 activities
    if (this.recentActivities.length > 50) {
      this.recentActivities = this.recentActivities.slice(0, 50);
    }
  }

  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    return this.recentActivities.slice(0, limit);
  }

  // Bulk Operations
  async bulkArchive(documentIds: string[]): Promise<void> {
    for (const id of documentIds) {
      await this.archiveDocument(id);
    }
  }

  async bulkDelete(documentIds: string[]): Promise<void> {
    for (const id of documentIds) {
      await this.deleteDocument(id);
    }
  }

  async bulkAddToFavorites(documentIds: string[]): Promise<void> {
    for (const id of documentIds) {
      const document = await this.getDocumentById(id);
      if (document && !document.metadata.tags.includes('favorite')) {
        await this.toggleFavorite(id);
      }
    }
  }
}

export const documentService = new DocumentService();