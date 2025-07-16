import { KnowledgeDocument, ExtractedData, Analysis } from '../types/knowledge';
import { nanoid } from 'nanoid';

class KnowledgeBaseService {
  private documents: KnowledgeDocument[] = [];
  private readonly STORAGE_KEY = 'organeus_knowledge_base';

  constructor() {
    this.loadFromStorage();
    this.initializeMockData();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.documents = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.documents));
  }

  private initializeMockData() {
    if (this.documents.length === 0) {
      this.documents = [
        {
          id: nanoid(),
          name: 'Contrat de prestation OKA Tech.pdf',
          type: 'pdf',
          content: 'Ce document présente les conditions générales de prestation pour les services de développement web et mobile proposés par OKA Tech. Les tarifs sont fixés à 500€/jour pour un développeur senior avec un minimum de 5 jours par mission. Les délais de livraison sont généralement de 2 à 4 semaines selon la complexité du projet.',
          originalFile: 'data:application/pdf;base64,mock-pdf-data',
          tags: ['contrat', 'prestation', 'développement'],
          category: 'Juridique',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'admin@organeus.com',
          size: 245760,
          extractedData: {
            title: 'Contrat de prestation OKA Tech',
            summary: 'Conditions générales de prestation pour services de développement',
            keyPoints: ['Tarif: 500€/jour', 'Minimum 5 jours', 'Délais: 2-4 semaines'],
            entities: ['OKA Tech', '500€', '5 jours', '2-4 semaines']
          }
        },
        {
          id: nanoid(),
          name: 'Proposition commerciale ORGANEUS.pdf',
          type: 'pdf',
          content: 'Proposition commerciale pour la création d\'une plateforme de génération de documents avec IA. Le projet comprend le développement d\'une interface utilisateur moderne, l\'intégration d\'APIs d\'IA (OpenAI, Anthropic), et un système de gestion de templates. Budget estimé: 45 000€ HT sur 3 mois.',
          originalFile: 'data:application/pdf;base64,mock-pdf-data-2',
          tags: ['proposition', 'commercial', 'IA', 'documents'],
          category: 'Commercial',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          uploadedBy: 'admin@organeus.com',
          size: 189440,
          extractedData: {
            title: 'Proposition commerciale ORGANEUS',
            summary: 'Développement plateforme de génération de documents IA',
            keyPoints: ['Budget: 45 000€ HT', 'Durée: 3 mois', 'APIs IA intégrées'],
            entities: ['ORGANEUS', '45 000€ HT', '3 mois', 'OpenAI', 'Anthropic']
          }
        },
        {
          id: nanoid(),
          name: 'Cahier des charges technique.pdf',
          type: 'pdf',
          content: 'Spécifications techniques pour le développement d\'une application de gestion documentaire. Technologies requises: React 18, TypeScript, Tailwind CSS, Node.js, PostgreSQL. Architecture microservices avec API REST et authentification JWT. Hébergement cloud AWS avec CDN CloudFront.',
          originalFile: 'data:application/pdf;base64,mock-pdf-data-3',
          tags: ['technique', 'spécifications', 'développement'],
          category: 'Technique',
          uploadedAt: new Date(Date.now() - 172800000).toISOString(),
          uploadedBy: 'admin@organeus.com',
          size: 156672,
          extractedData: {
            title: 'Cahier des charges technique',
            summary: 'Spécifications techniques pour application de gestion documentaire',
            keyPoints: ['React 18 + TypeScript', 'Architecture microservices', 'Hébergement AWS'],
            entities: ['React 18', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'AWS']
          }
        },
        {
          id: nanoid(),
          name: 'Logo ORGANEUS.png',
          type: 'image',
          content: 'Logo de l\'entreprise ORGANEUS, format PNG avec fond transparent. Dimensions: 512x512px. Couleurs principales: bleu (#2563eb) et violet (#7c3aed). Utilisé pour tous les documents officiels et communications.',
          originalFile: '/assets/images/logo/logo ORGANEUS copy.png',
          tags: ['logo', 'branding', 'identité'],
          category: 'Branding',
          uploadedAt: new Date(Date.now() - 259200000).toISOString(),
          uploadedBy: 'admin@organeus.com',
          size: 45120,
          extractedData: {
            title: 'Logo ORGANEUS',
            summary: 'Logo officiel de l\'entreprise',
            keyPoints: ['512x512px', 'Fond transparent', 'Couleurs: bleu et violet'],
            entities: ['ORGANEUS', '#2563eb', '#7c3aed', '512x512px']
          }
        },
        {
          id: nanoid(),
          name: 'Processus de développement.txt',
          type: 'text',
          content: 'Notre processus de développement suit une méthodologie agile avec des sprints de 2 semaines. Chaque sprint commence par une réunion de planification, suivie de développement quotidien avec des daily standups. Les tests sont effectués en continu avec une couverture de code minimum de 80%. Le déploiement se fait via CI/CD avec des environnements de staging et production.',
          originalFile: 'text-content',
          tags: ['processus', 'agile', 'développement'],
          category: 'Processus',
          uploadedAt: new Date(Date.now() - 345600000).toISOString(),
          uploadedBy: 'admin@organeus.com',
          size: 2048,
          extractedData: {
            title: 'Processus de développement',
            summary: 'Méthodologie agile avec sprints de 2 semaines',
            keyPoints: ['Sprints 2 semaines', 'Daily standups', 'Couverture code 80%', 'CI/CD'],
            entities: ['Méthodologie agile', 'sprints', 'daily standups', '80%', 'CI/CD']
          }
        }
      ];
      this.saveToStorage();
    }
  }

  async uploadDocument(file: File): Promise<KnowledgeDocument> {
    const extractedText = await this.extractText(file);
    const document: KnowledgeDocument = {
      id: nanoid(),
      name: file.name,
      type: this.getFileType(file),
      content: extractedText,
      originalFile: await this.fileToBase64(file),
      tags: [],
      category: 'Non classé',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin@organeus.com',
      size: file.size
    };

    this.documents.push(document);
    this.saveToStorage();
    return document;
  }

  async extractText(file: File): Promise<string> {
    // Simulation d'extraction de texte
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTexts = [
      'Ce document contient des informations importantes sur notre processus de développement logiciel.',
      'Analyse détaillée des besoins client et spécifications techniques pour le projet.',
      'Rapport de performance et recommandations pour l\'optimisation du système.',
      'Documentation technique complète avec exemples de code et bonnes pratiques.',
      'Présentation des résultats du projet et retour d\'expérience de l\'équipe.'
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  async analyzeDocument(id: string): Promise<ExtractedData> {
    const document = this.documents.find(doc => doc.id === id);
    if (!document) {
      throw new Error('Document non trouvé');
    }

    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysis: ExtractedData = {
      title: document.name.replace(/\.[^/.]+$/, ''),
      summary: document.content.substring(0, 200) + '...',
      keyPoints: [
        'Point clé 1 extrait du document',
        'Point clé 2 identifié par l\'IA',
        'Point clé 3 synthétisé automatiquement'
      ],
      entities: ['ORGANEUS', 'OKA Tech', 'développement', 'IA'],
      sentiment: 'positive'
    };

    // Mettre à jour le document avec les données extraites
    document.extractedData = analysis;
    this.saveToStorage();

    return analysis;
  }

  async searchDocuments(query: string): Promise<KnowledgeDocument[]> {
    if (!query.trim()) {
      return this.documents;
    }

    const searchTerms = query.toLowerCase().split(' ');
    return this.documents.filter(doc => {
      const searchableText = `${doc.name} ${doc.content} ${doc.tags.join(' ')} ${doc.category}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  }

  async getDocumentsByTags(tags: string[]): Promise<KnowledgeDocument[]> {
    if (tags.length === 0) {
      return this.documents;
    }

    return this.documents.filter(doc => 
      tags.some(tag => doc.tags.includes(tag))
    );
  }

  async getDocumentsByCategory(category: string): Promise<KnowledgeDocument[]> {
    if (category === 'all') {
      return this.documents;
    }

    return this.documents.filter(doc => doc.category === category);
  }

  async getAllDocuments(): Promise<KnowledgeDocument[]> {
    return this.documents;
  }

  getAllDocumentsSync(): KnowledgeDocument[] {
    return this.documents;
  }

  async getDocumentById(id: string): Promise<KnowledgeDocument | null> {
    return this.documents.find(doc => doc.id === id) || null;
  }

  async updateDocument(id: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document non trouvé');
    }

    this.documents[index] = { ...this.documents[index], ...updates };
    this.saveToStorage();
    return this.documents[index];
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents = this.documents.filter(doc => doc.id !== id);
    this.saveToStorage();
  }

  async getAnalytics(): Promise<Analysis> {
    const totalWords = this.documents.reduce((total, doc) => 
      total + doc.content.split(' ').length, 0
    );

    const categories = this.documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const documentTypes = this.documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allTags = this.documents.flatMap(doc => doc.tags);
    const commonThemes = [...new Set(allTags)].slice(0, 10);

    return {
      topics: commonThemes,
      sentiment: 'positive',
      keyInsights: [
        'Forte présence de documentation technique',
        'Nombreux documents contractuels',
        'Besoin d\'améliorer la documentation marketing'
      ],
      recommendations: [
        'Standardiser les formats de contrats',
        'Développer plus de documents marketing',
        'Mettre à jour la documentation technique'
      ]
    };
  }

  private getFileType(file: File): 'pdf' | 'image' | 'text' {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    return 'text';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getCategories(): string[] {
    return [...new Set(this.documents.map(doc => doc.category))];

export const knowledgeBaseService = new KnowledgeBaseService();