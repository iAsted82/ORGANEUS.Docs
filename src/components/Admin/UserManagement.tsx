import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Activity,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { User as UserType } from '../../types/auth';
import { CreateUserForm } from './CreateUserForm';
import { EditUserForm } from './EditUserForm';
import { adminService } from '../../services/adminService';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [users, setUsers] = useState<UserType[]>([
    {
      id: 'super-admin',
      email: 'superadmin@organeus.com',
      name: 'Super Administrateur',
      role: 'super_admin',
      company: {
        id: 'organeus',
        name: 'ORGANEUS',
        displayName: 'ORGANEUS',
        isActive: true,
        color: '#7c3aed',
        description: 'Solutions d\'organisation et de gestion'
      },
      isActive: true,
      lastLogin: '2024-01-20T10:30:00Z'
    },
    {
      id: 'admin-oka',
      email: 'admin@okatech.com',
      name: 'Administrateur OKA Tech',
      role: 'admin',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: true,
      lastLogin: '2024-01-19T14:15:00Z'
    },
    {
      id: 'collab-oka',
      email: 'collaborateur@okatech.com',
      name: 'Collaborateur OKA Tech',
      role: 'collaborator',
      company: {
        id: 'oka-tech',
        name: 'OKA Tech',
        displayName: 'OKA Tech',
        isActive: true,
        color: '#2563eb',
        description: 'Société technologique spécialisée en solutions digitales'
      },
      isActive: true,
      lastLogin: '2024-01-18T16:45:00Z'
    },
    {
      id: 'admin-organeus-gabon',
      email: 'admin@organeus-gabon.com',
      name: 'Admin ORGANEUS Gabon',
      role: 'admin',
      company: {
        id: 'organeus-gabon',
        name: 'ORGANEUS Gabon',
        displayName: 'ORGANEUS Gabon',
        isActive: false,
        color: '#059669',
        description: 'Filiale gabonaise d\'ORGANEUS'
      },
      isActive: false,
      lastLogin: '2024-01-10T09:20:00Z'
    }
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return Crown;
      case 'admin': return Shield;
      case 'collaborator': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'collaborator': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrateur';
      case 'collaborator': return 'Collaborateur';
      default: return 'Utilisateur';
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await adminService.toggleUserStatus(userId);
      setUsers(users => 
        users.map(user => 
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users => users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleUserCreated = (newUser: UserType) => {
    setUsers(prev => [...prev, newUser]);
    setShowCreateForm(false);
  };

  const handleUserUpdated = (updatedUser: UserType) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowEditForm(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesCompany = selectedCompany === 'all' || user.company.id === selectedCompany;
    return matchesSearch && matchesRole && matchesCompany;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    superAdmins: users.filter(u => u.role === 'super_admin').length,
    admins: users.filter(u => u.role === 'admin').length,
    collaborators: users.filter(u => u.role === 'collaborator').length
  };

  return (
    <>
      <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total utilisateurs</p>
              <p className="text-2xl font-bold text-blue-900">{userStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Actifs</p>
              <p className="text-2xl font-bold text-green-900">{userStats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Administrateurs</p>
              <p className="text-2xl font-bold text-purple-900">{userStats.admins + userStats.superAdmins}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600">Collaborateurs</p>
              <p className="text-2xl font-bold text-amber-900">{userStats.collaborators}</p>
            </div>
            <User className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des utilisateurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Administrateur</option>
            <option value="collaborator">Collaborateur</option>
          </select>
          
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Toutes les entreprises</option>
            <option value="organeus">ORGANEUS</option>
            <option value="oka-tech">OKA Tech</option>
            <option value="organeus-gabon">ORGANEUS Gabon</option>
            <option value="coursi">COURSI</option>
            <option value="annast">ANNAST</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisateurs ({filteredUsers.length})
            </h3>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un utilisateur</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: user.company.color }}
                        ></div>
                        <span className="text-sm text-gray-900">{user.company.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastLogin ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Jamais</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          user.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.isActive ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                        <span>{user.isActive ? 'Actif' : 'Inactif'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.role !== 'super_admin' && (
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <CreateUserForm
          onClose={() => setShowCreateForm(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {/* Edit User Modal */}
      {showEditForm && selectedUser && (
        <EditUserForm
          user={selectedUser}
          onClose={() => {
            setShowEditForm(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
};