
import { Search, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
}

const Header = ({
  title,
  showSearch = false,
  showBack = false,
  onBack,
  children,
}: HeaderProps) => {
  const location = useLocation();
  const path = location.pathname;

  const getTitleFromPath = () => {
    switch (path) {
      case "/":
        return "Furou?!";
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
      default:
        return title || "Furou?!";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 mr-2 rounded-full hover:bg-muted"
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
            </button>
          )}
          <h1 className="text-lg font-bold">{getTitleFromPath()}</h1>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <button className="p-2 rounded-full hover:bg-muted">
              <Search size={20} />
            </button>
          )}
          
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
