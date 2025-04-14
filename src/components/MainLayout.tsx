
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { 
  Home, 
  Calendar, 
  Users, 
  Bell, 
  Settings,
  PlusCircle,
  LogOut,
  Search,
  User,
  Calculator,
  Moon,
  Sun,
  ScrollText,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  showDock?: boolean;
  rightContent?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearch,
  showDock = true,
  rightContent
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Mock user data - em uma implementação real seria obtido do contexto de autenticação
  const userData = {
    name: "Carlos Oliveira",
    email: "carlos@exemplo.com",
    avatarUrl: "https://i.pravatar.cc/150?u=1"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title={title}
        showBack={showBack}
        onBack={onBack}
        showSearch={showSearch}
        onSearch={handleSearchChange}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {rightContent}
      </Header>

      <main className="flex-1 pb-16 lg:pb-0 max-w-7xl mx-auto w-full">
        <div className="lg:flex">
          {isDesktop && (
            <div className="hidden lg:block lg:w-64 p-4 border-r border-border dark:border-gray-800 min-h-[calc(100vh-64px)] fixed">
              <div className="sticky top-20 space-y-4 flex flex-col h-[calc(100vh-100px)]">
                {/* Perfil do Usuário - Transformado em link clicável */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 p-2 mb-2 justify-start w-full hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  onClick={() => navigate('/perfil')}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData.avatarUrl} />
                    <AvatarFallback>CO</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm truncate">{userData.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{userData.email}</span>
                  </div>
                </Button>
                
                <Separator className="my-2" />
                
                {/* Menu de Navegação */}
                <div className="space-y-1 flex-1">
                  {[
                    { title: 'Início', icon: <Home size={20} />, href: '/' },
                    { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
                    { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
                    { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
                    { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
                    { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' },
                    { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
                    { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
                    { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' }
                  ].map((item) => (
                    <Button
                      key={item.href}
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start mb-1 ${
                        isActive(item.href) 
                          ? "bg-primary hover:bg-primary-hover text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      onClick={() => navigate(item.href)}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, { 
                        size: 20, 
                        className: "mr-2" 
                      })}
                      <span>{item.title}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="mt-auto space-y-4">
                  <Button 
                    variant="outline"
                    className="w-full justify-start border-primary text-primary hover:bg-primary/10"
                    onClick={() => navigate("/criar")}
                  >
                    <PlusCircle size={20} className="mr-2" />
                    <span>Criar Evento</span>
                  </Button>

                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center">
                      {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
                      <span className="text-sm">Tema escuro</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-1" 
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => navigate("/login")}
                  >
                    <LogOut size={20} className="mr-2" />
                    <span>Sair</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className={`flex-1 ${isDesktop ? 'lg:ml-64' : ''}`}>
            {children}
          </div>
        </div>
      </main>

      {!isDesktop && (
        <BottomNav />
      )}
    </div>
  );
};

export default MainLayout;
