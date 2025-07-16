import { KnowledgeDocument, Analysis, GeneratedContent, StructuredData } from '../types/knowledge';
import { CompanyInfo } from '../types/company';
import { DocumentType } from '../types';

export interface AIPanel {
  generateFromKnowledge(prompt: string, selectedDocs: string[]): Promise<string>;
  improveText(text: string, style: string): Promise<string>;
  getSuggestions(context: string): Promise<string[]>;
  extractKeyInfo(documentIds: string[]): Promise<any>;
}

class AIDocumentService implements AIPanel {
  private apiKey: string | null = null;

  constructor() {
    // Récupérer la clé API depuis le service des clés
    this.initializeApiKey();
  }

  private async initializeApiKey() {
    try {
      // Simulation de récupération de clé API
      this.apiKey = 'mock-api-key';
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la clé API:', error);
    }
  }

  async analyzeKnowledgeBase(documentIds: string[]): Promise<Analysis> {
    // Simulation d'analyse
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      totalDocuments: documentIds.length,
      totalWords: documentIds.length * 500,
      commonThemes: ['développement', 'technologie', 'innovation', 'qualité'],
      keyEntities: ['ORGANEUS', 'OKA Tech', 'clients', 'projets'],
      documentTypes: { pdf: 3, image: 1, text: 1 },
      categories: { Juridique: 1, Commercial: 1, Technique: 1, Branding: 1, Processus: 1 }
    };
  }

  async generateFromKnowledge(prompt: string, selectedDocs: string[]): Promise<string> {
    // Simulation de génération de contenu basée sur la base de connaissance
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponses = [
      `Basé sur votre base de connaissance, voici une réponse générée pour "${prompt}":

Notre expertise en développement logiciel, documentée dans nos contrats et propositions commerciales, nous permet de proposer des solutions innovantes. Avec notre équipe expérimentée et notre processus agile, nous garantissons des livrables de qualité dans les délais convenus.

Points clés extraits de vos documents:
- Tarification compétitive à 500€/jour
- Méthodologie agile avec sprints de 2 semaines
- Technologies modernes (React, TypeScript, Node.js)
- Couverture de tests minimum 80%

Cette approche nous permet de répondre efficacement à vos besoins spécifiques.`,

      `En me basant sur les documents sélectionnés, je peux vous proposer le contenu suivant pour "${prompt}":

Votre société ORGANEUS, forte de son expertise technique et de sa méthodologie éprouvée, est en mesure de délivrer des solutions de haute qualité. Les processus décrits dans votre documentation technique montrent une approche structurée et professionnelle.

Éléments pertinents de votre base de connaissance:
- Spécifications techniques détaillées
- Processus de développement agile
- Standards de qualité élevés
- Engagement client fort

Cette expertise constitue un atout majeur pour vos projets futurs.`
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  async improveText(text: string, style: string): Promise<string> {
    // Simulation d'amélioration de texte
    await new Promise(resolve => setTimeout(resolve, 1000));

    const improvements = {
      formal: `Version formelle améliorée :

${text}

Cette version a été optimisée pour :
- Utiliser un langage plus soutenu
- Améliorer la structure des phrases
- Renforcer la crédibilité professionnelle`,

      casual: `Version décontractée améliorée :

${text}

Cette version a été adaptée pour :
- Utiliser un ton plus accessible
- Simplifier le vocabulaire
- Créer une proximité avec le lecteur`,

      technical: `Version technique améliorée :

${text}

Cette version a été enrichie pour :
- Inclure plus de détails techniques
- Utiliser la terminologie appropriée
- Structurer l'information de manière claire`
    };

    return improvements[style as keyof typeof improvements] || text;
  }

  async getSuggestions(context: string): Promise<string[]> {
    // Simulation de suggestions contextuelles
    await new Promise(resolve => setTimeout(resolve, 500));

    const suggestions = [
      'Ajouter des exemples concrets pour illustrer vos propos',
      'Inclure des chiffres et statistiques pour renforcer l\'argumentation',
      'Structurer le contenu avec des sous-titres clairs',
      'Ajouter un appel à l\'action en fin de document',
      'Inclure les coordonnées de contact de l\'entreprise',
      'Mentionner les références et réalisations antérieures',
      'Ajouter des témoignages clients si pertinent',
      'Préciser les délais et modalités de livraison'
    ];

    return suggestions.slice(0, 4);
  }

  async extractKeyInfo(documentIds: string[]): Promise<any> {
    // Simulation d'extraction d'informations clés
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      keyPoints: [
        'Expertise technique confirmée en développement web',
        'Processus agile avec sprints de 2 semaines',
        'Tarification compétitive à 500€/jour',
        'Couverture de tests minimum 80%'
      ],
      entities: ['ORGANEUS', 'OKA Tech', 'développement', 'agile'],
      summary: 'Documents relatifs à l\'expertise technique et commerciale de l\'entreprise',
      recommendations: [
        'Mettre en avant l\'expérience technique',
        'Souligner la méthodologie agile',
        'Présenter les références clients'
      ]
    };
  }

  async generateContent(
    prompt: string,
    context: KnowledgeDocument[],
    companyInfo: CompanyInfo
  ): Promise<GeneratedContent> {
    // Simulation de génération de contenu avancée
    await new Promise(resolve => setTimeout(resolve, 3000));

    const content = `Document généré pour : ${prompt}

Bonjour,

Suite à votre demande, nous avons le plaisir de vous proposer nos services. ${companyInfo.name}, forte de son expertise documentée dans notre base de connaissance, peut vous accompagner dans vos projets.

Nos atouts :
- Expertise technique reconnue
- Méthodologie éprouvée
- Équipe expérimentée
- Processus qualité rigoureux

Nous restons à votre disposition pour tout complément d'information.

Cordialement,
${companyInfo.signature?.defaultSignatory}
${companyInfo.signature?.title}
${companyInfo.name}`;

    return {
      content,
      sources: context.map(doc => doc.name),
      confidence: 0.85,
      suggestedTitle: `Document généré - ${prompt}`,
      metadata: {
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200),
        complexity: 'medium'
      }
    };
  }

  async createDocument(
    type: DocumentType,
    knowledge: KnowledgeDocument[],
    requirements: string
  ): Promise<any> {
    // Simulation de création de document complet
    await new Promise(resolve => setTimeout(resolve, 2500));

    const templates = {
      letter: `Objet : ${requirements}

Madame, Monsieur,

Nous avons l'honneur de vous adresser cette lettre concernant ${requirements}.

En nous appuyant sur notre expertise documentée, nous souhaitons vous proposer nos services.

Nous restons à votre entière disposition.

Cordialement,`,

      contract: `CONTRAT DE PRESTATION

Article 1 - Objet
Le présent contrat a pour objet ${requirements}.

Article 2 - Prestations
Basé sur notre expertise technique et notre méthodologie éprouvée, nous nous engageons à :
- Respecter les délais convenus
- Livrer un travail de qualité
- Assurer le suivi du projet

Article 3 - Conditions financières
Les conditions sont établies selon notre grille tarifaire standard.`,

      invoice: `FACTURE

Référence : ${requirements}

Prestations fournies :
- Développement selon cahier des charges
- Tests et validation
- Livraison et mise en production

Montant HT : À définir selon devis
TVA : 20%
Montant TTC : À définir`
    };

    return {
      type,
      content: templates[type] || templates.letter,
      sources: knowledge.map(doc => doc.name),
      createdAt: new Date().toISOString()
    };
  }

  async extractStructuredData(documents: KnowledgeDocument[]): Promise<StructuredData> {
    // Simulation d'extraction de données structurées
    await new Promise(resolve => setTimeout(resolve, 1800));

    return {
      summary: 'Analyse des documents de la base de connaissance montrant une expertise technique solide et une approche méthodique.',
      keyPoints: [
        'Processus de développement agile établi',
        'Tarification compétitive et transparente',
        'Expertise technique confirmée',
        'Méthodologie qualité rigoureuse'
      ],
      entities: ['ORGANEUS', 'OKA Tech', 'développement', 'agile', 'qualité'],
      categories: [...new Set(documents.map(doc => doc.category))],
      timeline: [
        {
          date: new Date(Date.now() - 86400000 * 30).toISOString(),
          event: 'Création du processus de développement',
          source: 'Processus de développement.txt'
        },
        {
          date: new Date(Date.now() - 86400000 * 15).toISOString(),
          event: 'Établissement du contrat type',
          source: 'Contrat de prestation OKA Tech.pdf'
        },
        {
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          event: 'Proposition commerciale ORGANEUS',
          source: 'Proposition commerciale ORGANEUS.pdf'
        }
      ]
    };
  }

  async generateSummary(documents: KnowledgeDocument[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return `Résumé de votre base de connaissance (${documents.length} documents) :

Votre entreprise dispose d'une documentation complète couvrant les aspects techniques, commerciaux et organisationnels. Les documents analysés révèlent une approche professionnelle structurée avec des processus bien définis.

Points forts identifiés :
- Méthodologie de développement agile
- Tarification transparente et compétitive
- Standards de qualité élevés
- Documentation technique complète

Cette base de connaissance constitue un excellent fondement pour générer des documents cohérents et professionnels.`;
  }
}

export const aiDocumentService = new AIDocumentService();