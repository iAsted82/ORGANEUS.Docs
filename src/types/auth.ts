export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'collaborator';
  company: Company;
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  displayName: string;
  logo?: string;
  isActive: boolean;
  description?: string;
  color: string;
  users?: User[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  companies: Company[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  companyId: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateCompanyStatus: (companyId: string, isActive: boolean) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateUserRole: (userId: string, role: User['role']) => void;
}