
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

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#121212] dark:text-[#EDEDED]">
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

      <main className="flex-1 dark:bg-[#121212] pb-16 lg:pb-0 max-w-7xl mx-auto w-full">
        <div className="lg:flex">
          {/* Desktop sidebar */}
          {isDesktop && (
            <div className="hidden lg:block lg:w-64 p-4">
              <div className="sticky top-20 space-y-1">
                {[
                  { title: 'Início', icon: <Home size={20} />, href: '/' },
                  { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
                  { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
                  { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
                  { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
                  { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' },
                  { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
                  { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
                  { title: 'Configurações', icon: <Settings size={20} />, href: '/acessibilidade' }
                ].map((item) => (
                  <Button
                    key={item.href}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start mb-1 ${
                      isActive(item.href) 
                        ? "bg-[#FF8A1E] hover:bg-[#FF7A00] text-white" 
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
                
                <Button 
                  variant="outline"
                  className="w-full justify-start mt-4 border-[#FF8A1E] text-[#FF8A1E] hover:bg-[#FF8A1E]/10"
                  onClick={() => navigate("/criar")}
                >
                  <PlusCircle size={20} className="mr-2" />
                  <span>Criar Evento</span>
                </Button>

                <div className="flex items-center justify-between mt-8 px-2">
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
              </div>
            </div>
          )}
          
          {/* Mobile and tablet content */}
          <div className="flex-1">
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
