
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  
  const openWhatsApp = () => {
    window.open('https://wa.me/9542577626', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      {/* Navigation */}
      <header className="border-b bg-orange-50/95 backdrop-blur supports-[backdrop-filter]:bg-orange-50/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-understan font-bold text-xl">
                <span className="text-red-600">Per</span>
                <span className="text-green-600">fect</span>
                <span className="ml-1">⚡</span>
              </span>
            </a>
          </div>
          <div className="flex-1">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary font-understan text-gray-800">
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary font-understan text-gray-800">
                    Documentation
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary font-understan text-gray-800" onClick={openWhatsApp}>
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowLogin(true)} className="font-understan text-gray-800">
              Sign In
            </Button>
            <Button onClick={() => setShowLogin(false)} className="font-understan">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-10 md:py-0 trader-background">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
          <div className="flex flex-col space-y-6">
            <h1 className="font-understan text-4xl md:text-6xl font-bold text-gray-900 drop-shadow-lg animate-fade-in-down">
              <span className="text-red-600">Per</span><span className="text-green-600">fect</span> <span className="text-gray-900">⚡</span> Trade Chronicles
            </h1>
            <p className="font-understan text-xl text-gray-800 drop-shadow-md max-w-md animate-fade-in-down" style={{ animationDelay: "0.1s" }}>
              "Be in the Market with a plan to beat the Market." Track your trades, analyze your performance, and become a better trader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-down" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" onClick={() => setShowLogin(false)} className="font-understan">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="bg-orange-100/50 text-gray-800 border-orange-200 hover:bg-orange-100 font-understan">
                Learn More
              </Button>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-xl p-6 md:p-8 animate-fade-in-down" style={{ animationDelay: "0.3s" }}>
            {showLogin ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <RegisterForm onToggleForm={toggleForm} />
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-orange-100 py-16">
        <div className="container">
          <h2 className="font-understan text-3xl font-bold text-center mb-12">
            <span className="text-red-600">Per</span>
            <span className="text-green-600">fect</span>
            <span className="ml-1">⚡</span> Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Track Your Trades",
                description: "Log all your trades with entry/exit points, strategies, and outcomes."
              },
              {
                title: "Analyze Performance",
                description: "Visualize your trading history with advanced charts and insights."
              },
              {
                title: "Improve Strategy",
                description: "Learn from your trading patterns to refine your approach to the market."
              }
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-all bg-orange-50">
                <CardContent className="pt-6">
                  <h3 className="font-understan text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="font-understan text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-50 border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="font-understan text-sm text-gray-700">
              © 2025 <span className="text-red-600 font-understan">Per</span><span className="text-green-600 font-understan">fect</span> <span>⚡</span>. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="font-understan text-sm text-gray-700 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="font-understan text-sm text-gray-700 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" onClick={openWhatsApp} className="font-understan text-sm text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
