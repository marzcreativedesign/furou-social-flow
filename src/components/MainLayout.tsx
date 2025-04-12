
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { 
  Home, 
  Calendar, 
  Users, 
  Bell, 
  Settings, 
  Menu,
  PlusCircle,
  LogOut,
  Search,
  User,
  Calculator,
  Moon,
  Sun,
  X,
  ScrollText
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Updated dockItems to include all functionality from hamburger menu
  const dockItems = [
    { title: 'Início', icon: <Home />, href: '/' },
    { title: 'Eventos', icon: <Calendar />, href: '/eventos' },
    { title: 'Agenda', icon: <ScrollText />, href: '/agenda' },
    { title: 'Grupos', icon: <Users />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell />, href: '/notificacoes' },
    { title: 'Calculadora', icon: <Calculator />, href: '/calculadora' },
    { title: 'Perfil', icon: <User />, href: '/perfil' },
    { title: 'Configurações', icon: <Settings />, href: '/configuracoes' },
  ];

  const menuItems = [
    { title: 'Início', icon: <Home size={20} />, href: '/' },
    { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
    { title: 'Agenda', icon: <Calendar size={20} />, href: '/agenda' },
    { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
    { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
    { title: 'Configurações', icon: <Settings size={20} />, href: '/configuracoes' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom navigation for mobile */}
      <div className="block lg:hidden">
        <BottomNav />
      </div>

      {/* Dock for desktop - now shown on all pages by default */}
      {showDock && (
        <TooltipProvider>
          <div className="hidden lg:block fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <Dock className="items-end pb-3">
              {dockItems.map((item, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <DockItem
                      key={idx}
                      className={`aspect-square rounded-full ${
                        location.pathname === item.href
                          ? "bg-primary text-white"
                          : "bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      }`}
                    >
                      <Link to={item.href} className="block h-full w-full flex items-center justify-center">
                        <DockLabel>{item.title}</DockLabel>
                        <DockIcon>{item.icon}</DockIcon>
                      </Link>
                    </DockItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* Additional special actions */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <DockItem
                    className="aspect-square rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <Link to="/criar" className="block h-full w-full flex items-center justify-center">
                      <DockLabel>Criar Evento</DockLabel>
                      <DockIcon><PlusCircle /></DockIcon>
                    </Link>
                  </DockItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Criar Evento
                </TooltipContent>
              </Tooltip>

              {/* Dark mode toggle in dock */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer">
                    <DockItem
                      className="aspect-square rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
                <TooltipContent side="top">
                  Modo {darkMode ? 'Claro' : 'Escuro'}
                </TooltipContent>
              </Tooltip>
            </Dock>
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};

export default MainLayout;
