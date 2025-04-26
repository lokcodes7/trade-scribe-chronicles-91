
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen trading-background flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-8 z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in-down">
            Trade Scribe Chronicles
          </h1>
          <p className="text-xl md:text-2xl text-white italic drop-shadow-md animate-fade-in-down">
            "Be in the Market with a plan to beat the Market"
          </p>
        </div>

        <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-xl p-6 md:p-8 animate-fade-in-down">
          {showLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
