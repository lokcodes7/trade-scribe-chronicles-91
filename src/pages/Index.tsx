
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TradeProvider } from '@/contexts/TradeContext';
import Home from './Home';
import Dashboard from './Dashboard';

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Dashboard /> : <Home />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <TradeProvider>
        <AuthenticatedApp />
      </TradeProvider>
    </AuthProvider>
  );
};

export default Index;
