
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">TradeScribe</span>
            </a>
          </div>
          <div className="flex-1">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                    Documentation
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowLogin(true)}>
              Sign In
            </Button>
            <Button onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-10 md:py-0 trading-background">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in-down">
              Trade Scribe Chronicles
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md max-w-md animate-fade-in-down" style={{ animationDelay: "0.1s" }}>
              "Be in the Market with a plan to beat the Market." Track your trades, analyze your performance, and become a better trader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-down" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" onClick={() => setShowLogin(false)}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
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
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
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
              <Card key={i} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2025 TradeScribe Chronicles. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
