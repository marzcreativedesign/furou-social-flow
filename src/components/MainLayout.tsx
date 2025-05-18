
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import NewSidebar from "./layout/NewSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

  return (
    <ErrorBoundary>
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

        <main className="flex-1 pb-16 lg:pb-0 max-w-7xl mx-auto w-full relative">
          <div className="flex w-full">
            {isDesktop && (
              <NewSidebar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            )}
            
            <div className={`flex-1 ${isDesktop ? 'lg:ml-64' : ''}`}>
              {children}
            </div>
          </div>
        </main>

        {!isDesktop && <BottomNav />}
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
