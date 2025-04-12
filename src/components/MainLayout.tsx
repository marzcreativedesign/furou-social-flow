
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { Hamburger } from "@/components/ui/hamburger";

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
  showDock = false,
  rightContent
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  const toggleSearch = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery("");
      if (onSearch) onSearch("");
    }
  };

  const dockItems = [
    { title: 'Home', icon: <Home />, href: '/' },
    { title: 'Eventos', icon: <Calendar />, href: '/eventos' },
    { title: 'Grupos', icon: <Users />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell />, href: '/notificacoes' },
    { title: 'Perfil', icon: <User />, href: '/perfil' },
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
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            {showBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack || (() => navigate(-1))}
                className="mr-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            ) : (
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Hamburger onClick={() => setMenuOpen(!menuOpen)} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center">
                      <span className="text-2xl font-bold">Furou?!</span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <div className="flex items-center mb-6 px-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">Carlos Oliveira</p>
                      <p className="text-sm text-muted-foreground">carlos@exemplo.com</p>
                    </div>
                  </div>
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
            )}

            {!showSearchInput ? (
              <h1 className="text-lg font-bold">{title}</h1>
            ) : (
              <div className="flex-1 ml-2">
                <input
                  type="text"
                  placeholder="Buscar eventos, locais ou grupos..."
                  className="w-full input-primary h-9 pl-3"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showSearch && (
              <Button 
                variant={showSearchInput ? "secondary" : "ghost"} 
                size="icon"
                onClick={toggleSearch}
              >
                {showSearchInput ? <X size={18} /> : <Search size={18} />}
              </Button>
            )}
            
            {rightContent}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/configuracoes")}
              className="hidden sm:flex"
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom navigation for mobile */}
      <div className="block lg:hidden">
        <BottomNav />
      </div>

      {/* Dock for desktop */}
      {showDock && (
        <div className="hidden lg:block fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Dock className="items-end pb-3">
            {dockItems.map((item, idx) => (
              <DockItem
                key={idx}
                className={`aspect-square rounded-full ${
                  location.pathname === item.href
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                }`}
              >
                <Link to={item.href}>
                  <DockLabel>{item.title}</DockLabel>
                  <DockIcon>{item.icon}</DockIcon>
                </Link>
              </DockItem>
            ))}
          </Dock>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
