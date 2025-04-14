
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

const LandingHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { role } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-primary z-10">Furou?!</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/explorar" className="text-muted-foreground hover:text-foreground transition-colors">
            Explorar
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </Link>
          
          {user ? (
            // User is logged in
            <>
              <Button 
                variant="outline" 
                className="mr-2"
                asChild
              >
                <Link to={role === 'admin' ? '/admin' : '/home'}>Minha conta</Link>
              </Button>
            </>
          ) : (
            // User is not logged in
            <>
              <Button 
                variant="outline" 
                className="mr-2"
                asChild
              >
                <Link to="/auth">Entrar</Link>
              </Button>
              
              <Button 
                className=""
                asChild
              >
                <Link to="/auth">Cadastre-se</Link>
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-background z-40 md:hidden">
            <div className="flex flex-col p-6 space-y-4">
              <Link 
                to="/explorar" 
                className="text-foreground hover:text-primary py-2 border-b border-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar
              </Link>
              <Link 
                to="#" 
                className="text-foreground hover:text-primary py-2 border-b border-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link 
                to="#" 
                className="text-foreground hover:text-primary py-2 border-b border-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {user ? (
                <Link 
                  to={role === 'admin' ? '/admin' : '/home'} 
                  className="text-center bg-primary text-white py-2 rounded-md w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minha conta
                </Link>
              ) : (
                <>
                  <Link 
                    to="/auth" 
                    className="text-center text-primary border border-primary py-2 rounded-md w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/auth" 
                    className="text-center bg-primary text-white py-2 rounded-md w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
