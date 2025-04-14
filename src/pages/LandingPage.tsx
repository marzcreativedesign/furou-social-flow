
import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 container mx-auto px-4 pt-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-6 text-primary">Furou?!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Conecte-se, organize eventos incríveis e mantenha seus amigos informados.
        </p>
        
        <div className="flex space-x-4">
          <Button 
            size="lg" 
            asChild
            className="text-lg px-8"
          >
            <Link to="/onboarding">Começar Agora</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="text-lg px-8"
          >
            <Link to="/explorar">Explorar Eventos</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
