
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { 
  Home, 
  Calendar, 
  Users, 
  Bell, 
  Accessibility, 
  Menu,
  PlusCircle,
  LogOut,
  Search,
  User,
  Calculator,
  Moon,
  Sun,
  X,
  ScrollText,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const dockItems = [
    { title: 'Início', icon: <Home />, href: '/' },
    { title: 'Eventos', icon: <Calendar />, href: '/eventos' },
    { title: 'Agenda', icon: <ScrollText />, href: '/agenda' },
    { title: 'Grupos', icon: <Users />, href: '/grupos' },
    { title: 'Explorar', icon: <Globe />, href: '/explorar' },
    { title: 'Notificações', icon: <Bell />, href: '/notificacoes' },
    { title: 'Calculadora', icon: <Calculator />, href: '/calculadora' },
    { title: 'Perfil', icon: <User />, href: '/perfil' },
    { title: 'Acessibilidade', icon: <Accessibility />, href: '/acessibilidade' },
  ];
  
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
          <div className="hidden lg:block lg:w-64 p-4">
            <div className="sticky top-20 space-y-1">
              {dockItems.map((item) => (
                <Button
                  key={item.href}
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  className="w-full justify-start mb-1"
                  onClick={() => navigate(item.href)}
                >
                  {React.cloneElement(item.icon as React.ReactElement, { size: 20, className: "mr-2" })}
                  <span>{item.title}</span>
                </Button>
              ))}
              
              <Button 
                variant="default"
                className="w-full justify-start mt-4 bg-[#FFA756] text-white hover:bg-[#FF8A1E]"
                onClick={() => navigate("/criar")}
              >
                <PlusCircle size={20} className="mr-2" />
                <span>Criar Evento</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile and tablet content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>

      <div className="block lg:hidden">
        <BottomNav />
      </div>

      <div className="hidden lg:block fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <TooltipProvider delayDuration={0}>
          <Dock className="items-end pb-3">
            {dockItems.map((item, idx) => (
              <Tooltip key={idx} delayDuration={0}>
                <TooltipTrigger asChild>
                  <DockItem
                    key={idx}
                    className={`aspect-square rounded-full ${
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                        ? "bg-[#FFA756] text-primary-foreground"
                        : "bg-gray-200 hover:bg-gray-300 dark:bg-[#1E1E1E] dark:hover:bg-[#2C2C2C] dark:text-[#EDEDED]"
                    }`}
                  >
                    <Link to={item.href} className="block h-full w-full flex items-center justify-center">
                      <DockLabel>{item.title}</DockLabel>
                      <DockIcon>{item.icon}</DockIcon>
                    </Link>
                  </DockItem>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs dark:bg-[#1E1E1E] dark:text-[#EDEDED] dark:border-[#2C2C2C]">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ))}

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DockItem
                  className="aspect-square rounded-full bg-[#FFA756] text-primary-foreground hover:bg-[#FF8A1E]"
                >
                  <Link to="/criar" className="block h-full w-full flex items-center justify-center">
                    <DockLabel>Criar Evento</DockLabel>
                    <DockIcon><PlusCircle /></DockIcon>
                  </Link>
                </DockItem>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs dark:bg-[#1E1E1E] dark:text-[#EDEDED] dark:border-[#2C2C2C]">
                Criar Evento
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <DockItem
                    className="aspect-square rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-[#1E1E1E] dark:hover:bg-[#2C2C2C] dark:text-[#EDEDED]"
                  >
                    <div 
                      className="block h-full w-full flex items-center justify-center cursor-pointer"
                      onClick={toggleDarkMode}
                    >
                      <DockLabel>Modo {darkMode ? 'Claro' : 'Escuro'}</DockLabel>
                      <DockIcon>{darkMode ? <Sun /> : <Moon />}</DockIcon>
                    </div>
                  </DockItem>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs dark:bg-[#1E1E1E] dark:text-[#EDEDED] dark:border-[#2C2C2C]">
                Modo {darkMode ? 'Claro' : 'Escuro'}
              </TooltipContent>
            </Tooltip>
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MainLayout;
