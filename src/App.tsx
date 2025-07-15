import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/Landing/LandingPage';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TemplateLibrary } from './components/Templates/TemplateLibrary';
import { DocumentList } from './components/Documents/DocumentList';
import { DocumentEditor } from './components/Editor/DocumentEditor';
import { AdminPanel } from './components/Admin/AdminPanel';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'templates':
        return <TemplateLibrary />;
      case 'documents':
      case 'recent':
      case 'favorites':
      case 'archived':
        return <DocumentList />;
      case 'create':
        return <DocumentEditor />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;