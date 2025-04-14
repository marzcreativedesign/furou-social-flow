
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Calendar,
  Users,
  PlusCircle,
  Globe
} from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  // Determine home route based on auth state
  const homeRoute = user ? "/home" : "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border dark:bg-gray-900/90 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around h-16 relative">
        {/* Botão Início - agora com rota condicional */}
        <Link
          to={homeRoute}
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            (path === "/" && !user) || (path === "/home" && user) 
              ? "text-[#FF8A1E]" 
              : "text-muted-foreground"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Início</span>
        </Link>

        {/* Botão Eventos */}
        <Link
          to="/eventos"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            path === "/eventos" || path.startsWith("/evento/")
              ? "text-[#FF8A1E]"
              : "text-muted-foreground"
          }`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Eventos</span>
        </Link>

        {/* Botão Criar Evento - agora no centro e mais destacado */}
        <Link
          to="/criar"
          className="flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF8A1E] text-white shadow-lg relative -top-5 hover:bg-[#FF7A00] transition-colors">
            <PlusCircle size={30} />
          </div>
        </Link>
        
        {/* Botão Grupos */}
        <Link
          to="/grupos"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            path === "/grupos" || path.startsWith("/grupo/")
              ? "text-[#FF8A1E]"
              : "text-muted-foreground"
          }`}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Grupos</span>
        </Link>

        {/* Botão Explorar */}
        <Link
          to="/explorar"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            path === "/explorar" ? "text-[#FF8A1E]" : "text-muted-foreground"
          }`}
        >
          <Globe size={24} />
          <span className="text-xs mt-1">Explorar</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
