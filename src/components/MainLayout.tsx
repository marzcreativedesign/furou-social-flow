
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DesktopSidebar from "./layout/DesktopSidebar";

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

const MainLayout = ({ 
  children, 
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearch,
  showDock = true,
  rightContent
}: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: "Usuário",
    email: "usuario@exemplo.com",
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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title={title}
        showBack={showBack}
        onBack={onBack}
        showSearch={showSearch}
        onSearch={onSearch}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {rightContent}
      </Header>

      <main className="flex-1 pb-16 lg:pb-0 max-w-7xl mx-auto w-full">
        <div className="lg:flex">
          {isDesktop && (
            <DesktopSidebar
              userProfile={userProfile}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              isActive={isActive}
            />
          )}
          
          <div className={`flex-1 ${isDesktop ? 'lg:ml-64' : ''}`}>
            {children}
          </div>
        </div>
      </main>

      {!isDesktop && <BottomNav />}
    </div>
  );
};

export default MainLayout;
