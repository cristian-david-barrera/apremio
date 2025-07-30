import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BoletasPage } from './pages/Boletas/BoletasPage';
import { UsuarioPage } from './pages/Usuario/UsuarioPage';
import './App.css';

type PageType = 'dashboard' | 'boletas' | 'usuario';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleNavigateToPage = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'boletas':
        return <BoletasPage onBack={handleBackToDashboard} />;
      case 'usuario':
        return <UsuarioPage onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onNavigateToPage={handleNavigateToPage} />;
    }
  };

  return (
    <Layout>
      {renderCurrentPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;