
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, Calendar, Users, PlusCircle, LogOut,
  User, Calculator, Moon, Sun, ScrollText,
  Globe, Settings, Bell, ChevronDown, ChevronUp
} from "lucide-react";

interface NewSidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface MenuCategory {
  title: string;
  items: {
    title: string;
    icon: JSX.Element;
    href: string;
  }[];
}

const NewSidebar = ({ darkMode, toggleDarkMode }: NewSidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'Eventos', 'Grupos', 'Notificações', 'Conta']);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: "Usuário",
    email: user?.email || "usuario@exemplo.com",
    avatarUrl: "",
    initials: "U"
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }

          const fullName = profileData?.full_name || user.user_metadata?.full_name || "Usuário";
          const nameParts = fullName.split(' ');
          const initials = nameParts.length > 1 
            ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}` 
            : fullName.charAt(0);
          
          setUserProfile({
            name: fullName,
            email: user.email || "usuario@exemplo.com",
            avatarUrl: profileData?.avatar_url || "",
            initials: initials.toUpperCase()
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const menuCategories: MenuCategory[] = [
    {
      title: 'main',
      items: [
        { title: 'Início', icon: <Home size={20} />, href: '/' }
      ]
    },
    {
      title: 'Eventos',
      items: [
        { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
        { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
        { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' }
      ]
    },
    {
      title: 'Grupos',
      items: [
        { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' }
      ]
    },
    {
      title: 'Notificações',
      items: [
        { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' }
      ]
    },
    {
      title: 'Conta',
      items: [
        { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
        { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
        { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' }
      ]
    }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    // For other pages, check if the path is exactly matching or is a subpath
    return path !== '/' && (location.pathname === path || location.pathname.startsWith(`${path}/`));
  };

  return (
    <div className="hidden lg:block lg:w-64 p-4 border-r border-border dark:border-gray-800 min-h-[calc(100vh-64px)] fixed">
      <div className="sticky top-20 flex flex-col h-[calc(100vh-100px)]">
        {/* User Profile Section */}
        <div 
          onClick={() => navigate("/perfil")}
          className="flex items-center mb-2 px-2 cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/50 rounded-md p-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile.avatarUrl} />
            <AvatarFallback>{userProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground truncate">{userProfile.email}</p>
          </div>
        </div>

        <Separator className="my-2" />

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-1 pb-4">
            {menuCategories.map((category) => (
              <div key={category.title} className="mb-2">
                {category.title !== 'main' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-semibold"
                    onClick={() => toggleCategory(category.title)}
                  >
                    {category.title}
                    {expandedCategories.includes(category.title) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </Button>
                )}
                
                {expandedCategories.includes(category.title) && (
                  <div className={category.title === 'main' ? '' : 'pl-2 border-l border-gray-300 dark:border-gray-700 ml-2 mt-1'}>
                    {category.items.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className="w-full justify-start mb-1"
                        onClick={() => navigate(item.href)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="my-2" />
        
        {/* Bottom Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
              <span className="text-sm">Tema escuro</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate("/criar")}
          >
            <PlusCircle size={20} className="mr-2" />
            <span>Criar Evento</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;
