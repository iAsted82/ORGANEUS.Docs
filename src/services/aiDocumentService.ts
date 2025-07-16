import { KnowledgeDocument } from '../types/knowledge';
import { CompanyProfile } from '../types/company';

interface AIGenerationOptions {
  documentType: string;
  tone: 'formal' | 'casual' | 'professional';
  length: 'short' | 'medium' | 'long';
  language: string;
  sourceDocuments?: KnowledgeDocument[];
  companyProfile?: CompanyProfile;
  customPrompt?: string;
}

interface AIResponse {
  content: string;
  suggestions?: string[];
  metadata?: {
    model: string;
    tokensUsed: number;
    generationTime: number;
  };
}

class AIDocumentService {
  private apiKeys = {
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || '',
    gemini: localStorage.getItem('gemini_api_key') || '',
  };

  // Générer un document avec l'IA
  async generateDocument(options: AIGenerationOptions): Promise<AIResponse> {
    // Simulation de génération IA
    await this.simulateDelay(2000);

    const context = this.buildContext(options);
    const generatedContent = this.simulateAIGeneration(context, options);

    return {
      content: generatedContent,
      suggestions: this.generateSuggestions(options.documentType),
      metadata: {
        model: 'claude-3-opus',
        tokensUsed: Math.floor(Math.random() * 1000) + 500,
        generationTime: 2000,
      },
    };
  }

  // Améliorer un texte existant
  async improveText(text: string, improvementType: 'clarity' | 'tone' | 'grammar' | 'conciseness'): Promise<AIResponse> {
    await this.simulateDelay(1000);

    const improvedText = this.simulateTextImprovement(text, improvementType);

    return {
      content: improvedText,
      suggestions: [`Le texte a été amélioré pour ${improvementType}`],
      metadata: {
        model: 'gpt-4',
        tokensUsed: text.length,
        generationTime: 1000,
      },
    };
  }

  // Analyser des documents sources
  async analyzeDocuments(documents: KnowledgeDocument[]): Promise<{
    summary: string;
    keyPoints: string[];
    recommendations: string[];
  }> {
    await this.simulateDelay(1500);

    return {
      summary: `Analyse de ${documents.length} documents. Les documents couvrent principalement ${this.extractTopics(documents).join(', ')}.`,
      keyPoints: [
        'Point clé extrait des documents sources',
        'Information importante identifiée',
        'Tendance principale observée',
      ],
      recommendations: [
        'Utiliser ces informations pour structurer le nouveau document',
        'Intégrer les données clés dans l\'introduction',
        'Référencer les sources appropriées',
      ],
    };
  }

  // Extraire des informations spécifiques
  async extractInformation(documents: KnowledgeDocument[], infoType: string): Promise<string[]> {
    await this.simulateDelay(800);

    // Simulation d'extraction
    return [
      `Information de type ${infoType} extraite`,
      'Donnée pertinente identifiée',
      'Élément clé trouvé dans les documents',
    ];
  }

  // Construire le contexte pour l'IA
  private buildContext(options: AIGenerationOptions): string {
    let context = `Type de document: ${options.documentType}\n`;
    context += `Ton: ${options.tone}\n`;
    context += `Longueur: ${options.length}\n`;

    if (options.companyProfile) {
      context += `\nEntreprise: ${options.companyProfile.general.name}\n`;
      if (options.companyProfile.general.description) {
        context += `Description: ${options.companyProfile.general.description}\n`;
      }
    }

    if (options.sourceDocuments && options.sourceDocuments.length > 0) {
      context += `\nDocuments sources:\n`;
      options.sourceDocuments.forEach(doc => {
        context += `- ${doc.title}: ${doc.extractedText?.substring(0, 200)}...\n`;
      });
    }

    if (options.customPrompt) {
      context += `\nInstructions spécifiques: ${options.customPrompt}\n`;
    }

    return context;
  }

  // Simulation de génération IA
  private simulateAIGeneration(context: string, options: AIGenerationOptions): string {
    const templates = {
      contract: `CONTRAT DE ${options.tone === 'formal' ? 'PRESTATION DE SERVICES' : 'COLLABORATION'}

Entre les soussignés :

${options.companyProfile ? options.companyProfile.general.name : '[Nom de l\'entreprise]'}
${options.companyProfile?.contact.address || '[Adresse]'}
Représentée par [Nom du représentant]
Ci-après dénommée "Le Prestataire"

Et

[Nom du client]
[Adresse du client]
Ci-après dénommé "Le Client"

Il a été convenu et arrêté ce qui suit :

ARTICLE 1 - OBJET
Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire réalisera pour le Client les prestations suivantes : [Description des prestations].

ARTICLE 2 - DURÉE
Le présent contrat est conclu pour une durée de [X] mois à compter du [Date].

ARTICLE 3 - PRIX ET MODALITÉS DE PAIEMENT
En contrepartie des prestations, le Client versera au Prestataire la somme de [Montant] euros HT.`,

      report: `RAPPORT ${options.tone === 'formal' ? 'D\'ACTIVITÉ' : 'DE PROJET'}

${options.companyProfile ? options.companyProfile.general.name : '[Nom de l\'entreprise]'}
Date : ${new Date().toLocaleDateString('fr-FR')}

RÉSUMÉ EXÉCUTIF
Ce rapport présente une vue d'ensemble des activités réalisées durant la période concernée.

1. INTRODUCTION
${options.sourceDocuments && options.sourceDocuments.length > 0 ? 
  'Sur la base des documents analysés, nous avons identifié plusieurs points clés qui méritent attention.' :
  'Ce document synthétise les principales réalisations et recommandations.'}

2. ANALYSE
Les données collectées montrent une progression significative dans les domaines suivants :
- Performance opérationnelle
- Satisfaction client
- Innovation produit

3. RECOMMANDATIONS
Nous recommandons les actions suivantes pour optimiser les résultats :
- Mise en place d'indicateurs de suivi
- Formation continue des équipes
- Investissement dans les outils digitaux`,

      letter: `${options.companyProfile ? options.companyProfile.general.name : '[Nom de l\'entreprise]'}
${options.companyProfile?.contact.address || '[Adresse]'}
${options.companyProfile?.contact.phone || '[Téléphone]'}

Le ${new Date().toLocaleDateString('fr-FR')}

Objet : [Objet de la lettre]

${options.tone === 'formal' ? 'Madame, Monsieur,' : 'Bonjour,'}

${options.sourceDocuments && options.sourceDocuments.length > 0 ?
  'Suite à notre analyse des documents fournis, nous souhaitons porter à votre attention les éléments suivants.' :
  'Nous avons le plaisir de vous adresser ce courrier concernant [sujet].'}

[Corps de la lettre avec les informations pertinentes extraites des documents sources si disponibles]

Nous restons à votre disposition pour tout complément d'information.

${options.tone === 'formal' ? 'Nous vous prions d\'agréer, Madame, Monsieur, l\'expression de nos salutations distinguées.' : 'Cordialement,'}

[Signature]
${options.companyProfile?.branding.emailSignature || '[Nom et fonction]'}`,
    };

    return templates[options.documentType as keyof typeof templates] || 
      `Document ${options.documentType} généré avec le contexte suivant :\n\n${context}\n\n[Contenu généré]`;
  }

  // Simulation d'amélioration de texte
  private simulateTextImprovement(text: string, type: string): string {
    const improvements = {
      clarity: text.replace(/\b(\w+)\s+\1\b/gi, '$1'), // Supprime les répétitions
      tone: text.replace(/!/g, '.'), // Rend plus formel
      grammar: text.charAt(0).toUpperCase() + text.slice(1), // Capitalise
      conciseness: text.split(' ').slice(0, Math.floor(text.split(' ').length * 0.8)).join(' '), // Réduit de 20%
    };

    return improvements[type as keyof typeof improvements] || text;
  }

  // Générer des suggestions
  private generateSuggestions(documentType: string): string[] {
    const suggestions = {
      contract: [
        'Ajouter une clause de confidentialité',
        'Préciser les modalités de résiliation',
        'Inclure les conditions de propriété intellectuelle',
      ],
      report: [
        'Ajouter des graphiques pour illustrer les données',
        'Inclure un sommaire exécutif en début de document',
        'Détailler les méthodologies utilisées',
      ],
      letter: [
        'Vérifier le ton adapté au destinataire',
        'Ajouter les références de dossiers précédents',
        'Inclure les coordonnées complètes',
      ],
    };

    return suggestions[documentType as keyof typeof suggestions] || [
      'Réviser la structure du document',
      'Ajouter des sections supplémentaires si nécessaire',
      'Vérifier la cohérence du contenu',
    ];
  }

  // Extraire les sujets principaux
  private extractTopics(documents: KnowledgeDocument[]): string[] {
    const categories = [...new Set(documents.map(doc => doc.metadata.category))];
    return categories.length > 0 ? categories : ['sujets variés'];
  }

  // Simuler un délai réseau
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Vérifier la disponibilité des APIs
  checkAPIAvailability(): { openai: boolean; anthropic: boolean; gemini: boolean } {
    return {
      openai: !!this.apiKeys.openai,
      anthropic: !!this.apiKeys.anthropic,
      gemini: !!this.apiKeys.gemini,
    };
  }
}

export const aiDocumentService = new AIDocumentService();