import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User, Company, LoginCredentials } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de test
const initialCompanies: Company[] = [
  {
    id: 'organeus',
    name: 'ORGANEUS',
    displayName: 'ORGANEUS',
    isActive: true,
    color: '#7c3aed',
    description: 'Solutions d\'organisation et de gestion'
  },
  {
    id: 'organeus-gabon',
    name: 'ORGANEUS Gabon',
    displayName: 'ORGANEUS Gabon',
    isActive: false,
    color: '#059669',
    description: 'Filiale gabonaise d\'ORGANEUS'
  },
  {
    id: 'oka-tech',
    name: 'OKA Tech',
    displayName: 'OKA Tech',
    isActive: true,
    color: '#2563eb',
    description: 'Société technologique spécialisée en solutions digitales'
  },
  {
    id: 'coursi',
    name: 'COURSI',
    displayName: 'COURSI',
    isActive: false,
    color: '#ea580c',
    description: 'Centre de formation et de recherche'
  },
  {
    id: 'annast',
    name: 'ANNAST',
    displayName: 'ANNAST',
    isActive: false,
    color: '#dc2626',
    description: 'Agence nationale de sécurité et de technologie'
  }
];

// Utilisateurs de test
const testUsers: User[] = [
  {
    id: 'super-admin-organeus',
    email: 'admin@organeus.com',
    name: 'Super Administrateur ORGANEUS',
    role: 'super_admin',
    company: initialCompanies[0], // ORGANEUS
    isActive: true
  },
  {
    id: 'admin-oka',
    email: 'admin@okatech.com',
    name: 'Administrateur OKA Tech',
    role: 'admin',
    company: initialCompanies[2], // OKA Tech est maintenant à l'index 2
    isActive: true
  },
  {
    id: 'collab-oka',
    email: 'collaborateur@okatech.com',
    name: 'Collaborateur OKA Tech',
    role: 'collaborator',
    company: initialCompanies[2], // OKA Tech est maintenant à l'index 2
    isActive: true
  }
];

// Mots de passe de test
const testPasswords: { [key: string]: string } = {
  'admin@organeus.com': '@sted1982*',
  '+33 6 61 00 26 16': '@sted1982*',
  'admin@okatech.com': 'okatech123',
  'collaborateur@okatech.com': 'CollabOKA2024!'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = testUsers.find(u => 
       (u.email === credentials.email || credentials.email === '+33 6 61 00 26 16') && 
        u.company.id === credentials.companyId
      );
      
     const correctPassword = testPasswords[credentials.email];
      
      if (foundUser && correctPassword === credentials.password) {
        // Vérifier si l'entreprise est active ou si c'est le super admin
        const company = companies.find(c => c.id === credentials.companyId);
        if (company && (company.isActive || foundUser.role === 'super_admin')) {
          setUser({
            ...foundUser,
            lastLogin: new Date().toISOString()
          });
          setIsAuthenticated(true);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateCompanyStatus = (companyId: string, isActive: boolean) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { ...company, isActive }
          : company
      )
    );
  };

  const addCompany = (newCompany: Omit<Company, 'id'>) => {
    const company: Company = {
      ...newCompany,
      id: newCompany.name.toLowerCase().replace(/\s+/g, '-')
    };
    setCompanies(prev => [...prev, company]);
  };

  const updateUserRole = (userId: string, role: User['role']) => {
    // Cette fonction serait implémentée pour mettre à jour les rôles des utilisateurs
    console.log('Mise à jour du rôle utilisateur:', userId, role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      companies,
      login,
      logout,
      updateCompanyStatus,
      addCompany,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};