
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { menuCategories } from "@/config/menuConfig";
import SidebarUserProfile from "./sidebar/SidebarUserProfile";
import SidebarMenuCategory from "./sidebar/SidebarMenuCategory";
import SidebarActions from "./sidebar/SidebarActions";

interface NewSidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
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
    return path !== '/' && (location.pathname === path || location.pathname.startsWith(`${path}/`));
  };

  return (
    <div className="hidden lg:block lg:w-64 min-h-[calc(100vh-64px)] fixed bg-card/30 backdrop-blur-sm">
      <div className="sticky top-20 flex flex-col h-[calc(100vh-100px)]">
        <div className="px-4 py-3">
          <SidebarUserProfile {...userProfile} />
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 py-2">
            {menuCategories.map((category) => (
              <SidebarMenuCategory
                key={category.title}
                title={category.title}
                items={category.items}
                isExpanded={expandedCategories.includes(category.title)}
                onToggle={() => toggleCategory(category.title)}
                isActive={isActive}
              />
            ))}
          </div>
        </ScrollArea>
        
        <div className="px-4 pt-2 pb-4">
          <Separator className="my-2" />
          <SidebarActions 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;
