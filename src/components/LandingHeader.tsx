
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-primary">Furou?!</Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="mr-2"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
          
          <Button 
            className=""
            asChild
          >
            <Link to="/onboarding">Cadastre-se</Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
