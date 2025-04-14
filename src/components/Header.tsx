import { useState } from "react";
import { Search, Bell, ArrowLeft, Menu, X } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Hamburger } from "./ui/hamburger";
import { 
  Home, 
  Calendar, 
  Users, 
  PlusCircle,
  LogOut,
  User,
  Calculator,
  Moon,
  Sun,
  ScrollText,
  Globe,
  Settings
} from "lucide-react";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
  onSearch?: (query: string) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Header = ({
  title,
  showSearch = false,
  showBack = false,
  onBack,
  children,
  onSearch,
  darkMode = false,
  toggleDarkMode,
}: HeaderProps) => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isDesktop = window.innerWidth >= 1024;

  const homeRoute = user ? "/home" : "/";

  const getTitleFromPath = () => {
    switch (path) {
      case "/":
        return "Furou?!";
      case "/home":
        return "Dashboard";
      case "/eventos":
        return "Meus Eventos";
      case "/notificacoes":
        return "Notificações";
      case "/perfil":
        return "Meu Perfil";
      case "/criar":
        return "Criar Evento";
      case "/grupos":
        return "Meus Grupos";
      case "/agenda":
        return "Agenda";
      case "/acessibilidade":
        return "Acessibilidade";
      case "/calculadora":
        return "Calculadora de Rateio";
      case "/explorar":
        return "Explorar";
      default:
        return title || "Furou?!";
    }
  };
  
  const handleSearchClick = () => {
    setIsSearchActive(prev => !prev);
    if (isSearchActive) {
      setSearchQuery("");
      if (onSearch) onSearch("");
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const menuItems = [
    { title: 'Início', icon: <Home size={20} />, href: '/' },
    { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
    { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
    { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
    { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' },
    { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
    { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
    { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' },
  ];

  const renderLeftButton = () => {
    if (showBack) {
      return (
        <button
          onClick={onBack || (() => navigate(-1))}
          className="p-2 mr-2 rounded-full hover:bg-muted flex items-center"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
      );
    } else if (!isDesktop) {
      return (
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Hamburger onClick={() => {}} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-gray-900 dark:text-white">
            <SheetHeader>
              <SheetTitle className="text-left flex items-center">
                <Link to={homeRoute} onClick={() => setMenuOpen(false)}>
                  <span className="text-2xl font-bold">Furou?!</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            <Link 
              to="/perfil" 
              onClick={() => setMenuOpen(false)}
              className="flex items-center mb-6 px-2 hover:bg-muted/50 dark:hover:bg-gray-800/50 rounded-md p-2"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                <AvatarFallback>CO</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">Carlos Oliveira</p>
                <p className="text-sm text-muted-foreground">carlos@exemplo.com</p>
              </div>
            </Link>
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => { 
                      navigate(item.href); 
                      setMenuOpen(false); 
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="px-4 py-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {darkMode ? <Moon className="mr-2" size={20} /> : <Sun className="mr-2" size={20} />}
                    <span>Modo escuro</span>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => { 
                    navigate("/criar"); 
                    setMenuOpen(false); 
                  }}
                >
                  <PlusCircle className="mr-2" size={20} />
                  <span>Criar evento</span>
                </Button>
                
                <Button 
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => navigate("/login")}
                >
                  <LogOut className="mr-2" size={20} />
                  <span>Sair</span>
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          {renderLeftButton()}
          {!isSearchActive && (
            <Link to={homeRoute} className="text-lg font-bold text-center">
              {path === '/' || path === '/home' ? 'Furou?!' : getTitleFromPath()}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <button 
              className={`p-2 rounded-full hover:bg-muted ${isSearchActive ? 'bg-muted' : ''}`}
              onClick={handleSearchClick}
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          )}

          {isSearchActive && (
            <div className="fixed inset-0 z-50 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md">
              <div className="flex items-center p-4">
                <button
                  onClick={handleSearchClick}
                  className="p-2 mr-2 rounded-full hover:bg-muted"
                  aria-label="Voltar"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Link to="/notificacoes" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
            </Button>
          </Link>
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
