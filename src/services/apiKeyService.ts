import { nanoid } from 'nanoid';

export interface APIKey {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai' | 'gemini' | 'custom';
  keyValue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
  monthlyLimit?: number;
  description?: string;
  environment: 'development' | 'production';
  tags: string[];
}

export interface APIKeyLog {
  id: string;
  keyId: string;
  keyName: string;
  action: 'created' | 'updated' | 'deleted' | 'used' | 'validated';
  timestamp: string;
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
  metadata?: any;
}

export interface APIKeyValidationResult {
  isValid: boolean;
  provider: string;
  keyType: string;
  permissions?: string[];
  expiresAt?: string;
  usage?: {
    current: number;
    limit: number;
  };
  errorMessage?: string;
}

class APIKeyService {
  private readonly ENCRYPTION_KEY = 'organeus-api-keys-encryption-2024';
  private apiKeys: APIKey[] = [];
  private logs: APIKeyLog[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialiser avec quelques clés de test
    this.apiKeys = [
      {
        id: 'key-1',
        name: 'Anthropic Claude Production',
        provider: 'anthropic',
        keyValue: this.encrypt('sk-ant-api03-abcdef123456789'),
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        lastUsed: '2024-01-22T09:15:00Z',
        usageCount: 1456,
        monthlyLimit: 10000,
        description: 'Clé principale pour Claude en production',
        environment: 'production',
        tags: ['production', 'claude', 'primary']
      },
      {
        id: 'key-2',
        name: 'OpenAI GPT-4 Development',
        provider: 'openai',
        keyValue: this.encrypt('sk-123456789abcdef'),
        isActive: true,
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        lastUsed: '2024-01-21T11:30:00Z',
        usageCount: 892,
        monthlyLimit: 5000,
        description: 'Clé de développement pour GPT-4',
        environment: 'development',
        tags: ['development', 'gpt4', 'testing']
      }
    ];

    // Logs d'exemple
    this.logs = [
      {
        id: 'log-1',
        keyId: 'key-1',
        keyName: 'Anthropic Claude Production',
        action: 'used',
        timestamp: '2024-01-22T09:15:00Z',
        userId: 'super-admin',
        userEmail: 'admin@organeus.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        success: true,
        metadata: { tokensUsed: 1250 }
      },
      {
        id: 'log-2',
        keyId: 'key-2',
        keyName: 'OpenAI GPT-4 Development',
        action: 'validated',
        timestamp: '2024-01-21T11:30:00Z',
        userId: 'super-admin',
        userEmail: 'admin@organeus.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        success: true
      }
    ];
  }

  // Simulation du chiffrement (en production, utiliser une vraie librairie crypto)
  private encrypt(text: string): string {
    // Simulation simple - en production, utiliser AES-256 ou similaire
    return btoa(text + this.ENCRYPTION_KEY);
  }

  private decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      return decoded.replace(this.ENCRYPTION_KEY, '');
    } catch (error) {
      throw new Error('Erreur de déchiffrement');
    }
  }

  // Validation des formats de clés
  private validateKeyFormat(provider: string, keyValue: string): boolean {
    const patterns = {
      anthropic: /^sk-ant-api\d{2}-[a-zA-Z0-9]{20,}$/,
      openai: /^sk-[a-zA-Z0-9]{48,}$/,
      gemini: /^AIzaSy[a-zA-Z0-9_-]{33}$/,
      custom: /^[a-zA-Z0-9_-]{10,}$/
    };

    return patterns[provider as keyof typeof patterns]?.test(keyValue) || false;
  }

  // Masquer les caractères sensibles
  private maskKey(keyValue: string): string {
    if (keyValue.length <= 8) return '•'.repeat(keyValue.length);
    const start = keyValue.substring(0, 4);
    const end = keyValue.substring(keyValue.length - 4);
    const middle = '•'.repeat(Math.max(keyValue.length - 8, 6));
    return `${start}${middle}${end}`;
  }

  // Ajouter un log
  private addLog(
    keyId: string,
    keyName: string,
    action: APIKeyLog['action'],
    success: boolean,
    errorMessage?: string,
    metadata?: any
  ) {
    const log: APIKeyLog = {
      id: nanoid(),
      keyId,
      keyName,
      action,
      timestamp: new Date().toISOString(),
      userId: 'super-admin',
      userEmail: 'admin@organeus.com',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      metadata
    };

    this.logs.unshift(log);
    
    // Garder seulement les 1000 derniers logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
  }

  // Obtenir toutes les clés
  async getAllKeys(): Promise<APIKey[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.apiKeys.map(key => ({
      ...key,
      keyValue: this.maskKey(this.decrypt(key.keyValue))
    }));
  }

  // Obtenir une clé par ID
  async getKeyById(id: string): Promise<APIKey | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const key = this.apiKeys.find(k => k.id === id);
    if (!key) return null;

    return {
      ...key,
      keyValue: this.maskKey(this.decrypt(key.keyValue))
    };
  }

  // Obtenir la vraie valeur d'une clé (pour utilisation)
  async getKeyValue(id: string): Promise<string | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const key = this.apiKeys.find(k => k.id === id);
    if (!key || !key.isActive) return null;

    this.addLog(id, key.name, 'used', true, undefined, {
      timestamp: new Date().toISOString()
    });

    // Incrémenter le compteur d'utilisation
    key.usageCount++;
    key.lastUsed = new Date().toISOString();

    return this.decrypt(key.keyValue);
  }

  // Créer une nouvelle clé
  async createKey(keyData: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<APIKey> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validation du format
    if (!this.validateKeyFormat(keyData.provider, keyData.keyValue)) {
      const error = `Format de clé invalide pour ${keyData.provider}`;
      this.addLog('', keyData.name, 'created', false, error);
      throw new Error(error);
    }

    // Vérifier l'unicité du nom
    if (this.apiKeys.some(k => k.name === keyData.name)) {
      const error = 'Une clé avec ce nom existe déjà';
      this.addLog('', keyData.name, 'created', false, error);
      throw new Error(error);
    }

    const newKey: APIKey = {
      ...keyData,
      id: nanoid(),
      keyValue: this.encrypt(keyData.keyValue),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    this.apiKeys.push(newKey);
    this.addLog(newKey.id, newKey.name, 'created', true);

    return {
      ...newKey,
      keyValue: this.maskKey(keyData.keyValue)
    };
  }

  // Mettre à jour une clé
  async updateKey(id: string, updates: Partial<APIKey>): Promise<APIKey> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = this.apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      const error = 'Clé non trouvée';
      this.addLog(id, '', 'updated', false, error);
      throw new Error(error);
    }

    const existingKey = this.apiKeys[index];

    // Si la valeur de la clé est mise à jour, valider le format
    if (updates.keyValue && !this.validateKeyFormat(updates.provider || existingKey.provider, updates.keyValue)) {
      const error = `Format de clé invalide pour ${updates.provider || existingKey.provider}`;
      this.addLog(id, existingKey.name, 'updated', false, error);
      throw new Error(error);
    }

    const updatedKey = {
      ...existingKey,
      ...updates,
      id, // Garder l'ID original
      keyValue: updates.keyValue ? this.encrypt(updates.keyValue) : existingKey.keyValue,
      updatedAt: new Date().toISOString()
    };

    this.apiKeys[index] = updatedKey;
    this.addLog(id, updatedKey.name, 'updated', true);

    return {
      ...updatedKey,
      keyValue: this.maskKey(this.decrypt(updatedKey.keyValue))
    };
  }

  // Supprimer une clé
  async deleteKey(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      const error = 'Clé non trouvée';
      this.addLog(id, '', 'deleted', false, error);
      throw new Error(error);
    }

    const key = this.apiKeys[index];
    this.apiKeys.splice(index, 1);
    this.addLog(id, key.name, 'deleted', true);
  }

  // Valider une clé auprès du fournisseur
  async validateKey(id: string): Promise<APIKeyValidationResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const key = this.apiKeys.find(k => k.id === id);
    if (!key) {
      throw new Error('Clé non trouvée');
    }

    const keyValue = this.decrypt(key.keyValue);

    // Simulation de validation (en production, appeler les APIs des fournisseurs)
    const mockValidation = (): APIKeyValidationResult => {
      const isValid = Math.random() > 0.1; // 90% de chances de succès
      
      if (!isValid) {
        return {
          isValid: false,
          provider: key.provider,
          keyType: 'invalid',
          errorMessage: 'Clé invalide ou expirée'
        };
      }

      return {
        isValid: true,
        provider: key.provider,
        keyType: key.provider === 'anthropic' ? 'claude-3' : 
                key.provider === 'openai' ? 'gpt-4' : 'gemini-pro',
        permissions: ['read', 'write', 'generate'],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          current: key.usageCount,
          limit: key.monthlyLimit || 10000
        }
      };
    };

    const result = mockValidation();
    this.addLog(id, key.name, 'validated', result.isValid, result.errorMessage, result);

    return result;
  }

  // Obtenir les logs
  async getLogs(keyId?: string, limit = 100): Promise<APIKeyLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredLogs = this.logs;
    if (keyId) {
      filteredLogs = filteredLogs.filter(log => log.keyId === keyId);
    }

    return filteredLogs.slice(0, limit);
  }

  // Obtenir les statistiques d'utilisation
  async getUsageStats(): Promise<{
    totalKeys: number;
    activeKeys: number;
    totalUsage: number;
    monthlyUsage: number;
    topProviders: Array<{ provider: string; count: number }>;
    recentActivity: APIKeyLog[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const totalKeys = this.apiKeys.length;
    const activeKeys = this.apiKeys.filter(k => k.isActive).length;
    const totalUsage = this.apiKeys.reduce((sum, key) => sum + key.usageCount, 0);
    
    const thisMonth = new Date().toISOString().substring(0, 7);
    const monthlyUsage = this.logs.filter(log => 
      log.timestamp.startsWith(thisMonth) && log.action === 'used'
    ).length;

    const providerCounts = this.apiKeys.reduce((acc, key) => {
      acc[key.provider] = (acc[key.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProviders = Object.entries(providerCounts)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count);

    const recentActivity = this.logs.slice(0, 10);

    return {
      totalKeys,
      activeKeys,
      totalUsage,
      monthlyUsage,
      topProviders,
      recentActivity
    };
  }

  // Test de connectivité
  async testConnection(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const key = this.apiKeys.find(k => k.id === id);
    if (!key) {
      throw new Error('Clé non trouvée');
    }

    // Simulation de test (en production, faire un vrai appel API)
    const success = Math.random() > 0.2; // 80% de chances de succès
    
    this.addLog(id, key.name, 'validated', success, 
      success ? undefined : 'Échec de la connexion au service');

    return success;
  }
}

export const apiKeyService = new APIKeyService();