import { CompanyInfo, CompanyTemplate } from '../types/company';

class CompanyService {
  private readonly STORAGE_KEY = 'organeus_company_info';
  private companyInfo: CompanyInfo | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeMockData();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.companyInfo = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    if (this.companyInfo) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.companyInfo));
    }
  }

  private initializeMockData() {
    if (!this.companyInfo) {
      this.companyInfo = {
        name: 'ORGANEUS',
        logo: '/assets/images/logo/logo ORGANEUS copy.png',
        address: {
          street: '123 Rue de la Technologie',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        contact: {
          email: 'contact@organeus.com',
          phone: '+33 1 23 45 67 89',
          website: 'https://www.organeus.com'
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/company/organeus',
          twitter: 'https://twitter.com/organeus',
          facebook: 'https://facebook.com/organeus'
        },
        signature: {
          defaultSignatory: 'Jean Dupont',
          title: 'Directeur Général',
          signatureImage: ''
        },
        businessInfo: {
          siret: '12345678901234',
          tva: 'FR12345678901',
          capital: '100 000€',
          legalForm: 'SAS'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
    }
  }

  async getCompanyInfo(): Promise<CompanyInfo> {
    if (!this.companyInfo) {
      throw new Error('Informations entreprise non trouvées');
    }
    return this.companyInfo;
  }

  async updateCompanyInfo(updates: Partial<CompanyInfo>): Promise<CompanyInfo> {
    if (!this.companyInfo) {
      throw new Error('Informations entreprise non trouvées');
    }

    this.companyInfo = {
      ...this.companyInfo,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return this.companyInfo;
  }

  async uploadLogo(file: File): Promise<string> {
    // Simulation d'upload de logo
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const logoUrl = reader.result as string;
        if (this.companyInfo) {
          this.companyInfo.logo = logoUrl;
          this.saveToStorage();
        }
        resolve(logoUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadSignature(file: File): Promise<string> {
    // Simulation d'upload de signature
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const signatureUrl = reader.result as string;
        if (this.companyInfo && this.companyInfo.signature) {
          this.companyInfo.signature.signatureImage = signatureUrl;
          this.saveToStorage();
        }
        resolve(signatureUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  getCompanyVariables(): Record<string, string> {
    if (!this.companyInfo) return {};

    return {
      'company.name': this.companyInfo.name,
      'company.email': this.companyInfo.contact.email,
      'company.phone': this.companyInfo.contact.phone,
      'company.website': this.companyInfo.contact.website,
      'company.address.street': this.companyInfo.address.street,
      'company.address.city': this.companyInfo.address.city,
      'company.address.postalCode': this.companyInfo.address.postalCode,
      'company.address.country': this.companyInfo.address.country,
      'company.siret': this.companyInfo.businessInfo.siret || '',
      'company.tva': this.companyInfo.businessInfo.tva || '',
      'company.capital': this.companyInfo.businessInfo.capital || '',
      'company.signatory': this.companyInfo.signature?.defaultSignatory || '',
      'company.signatory.title': this.companyInfo.signature?.title || ''
    };
  }

  getCompanyTemplates(): CompanyTemplate[] {
    return [
      {
        id: 'contact-block',
        name: 'Bloc Contact',
        description: 'Informations de contact complètes',
        template: `
          <div class="contact-block">
            <h3>{{company.name}}</h3>
            <p>{{company.address.street}}</p>
            <p>{{company.address.postalCode}} {{company.address.city}}</p>
            <p>{{company.address.country}}</p>
            <p>Tél: {{company.phone}}</p>
            <p>Email: {{company.email}}</p>
            <p>Web: {{company.website}}</p>
          </div>
        `,
        variables: ['company.name', 'company.address.street', 'company.phone', 'company.email'],
        category: 'Contact'
      },
      {
        id: 'signature-block',
        name: 'Bloc Signature',
        description: 'Signature avec titre et entreprise',
        template: `
          <div class="signature-block">
            <p>{{company.signatory}}</p>
            <p>{{company.signatory.title}}</p>
            <p>{{company.name}}</p>
          </div>
        `,
        variables: ['company.signatory', 'company.signatory.title', 'company.name'],
        category: 'Signature'
      },
      {
        id: 'legal-info',
        name: 'Informations Légales',
        description: 'Informations légales complètes',
        template: `
          <div class="legal-info">
            <p>{{company.name}} - {{company.businessInfo.legalForm}}</p>
            <p>Capital: {{company.capital}}</p>
            <p>SIRET: {{company.siret}}</p>
            <p>TVA: {{company.tva}}</p>
          </div>
        `,
        variables: ['company.name', 'company.capital', 'company.siret', 'company.tva'],
        category: 'Légal'
      }
    ];
  }

  replaceVariables(template: string): string {
    const variables = this.getCompanyVariables();
    let result = template;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }
}

export const companyService = new CompanyService();