
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "./header/SearchBar";
import NotificationButton from "./header/NotificationButton";
import MobileMenu from "./header/MobileMenu";

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
  const navigate = useNavigate();
  const { user } = useAuth();
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

  return (
    <header className="sticky top-0 z-50 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          {!isDesktop && (
            <MobileMenu darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          )}
          {showBack && (
            <button
              onClick={onBack || (() => navigate(-1))}
              className="p-2 mr-2 rounded-full hover:bg-muted flex items-center"
              aria-label="Voltar"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <Link to={homeRoute} className="text-lg font-bold text-center">
            {path === '/' || path === '/home' ? 'Furou?!' : getTitleFromPath()}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && <SearchBar onSearch={onSearch} />}
          <NotificationButton />
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
