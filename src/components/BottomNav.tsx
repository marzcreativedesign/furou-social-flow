
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  User,
  PlusCircle,
  Globe
} from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border dark:bg-gray-900/90 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around h-16 relative">
        {/* Botão Início */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            path === "/" ? "text-[#FFA756]" : "text-muted-foreground"
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
              ? "text-[#FFA756]"
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
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FFA756] text-white shadow-lg relative -top-5">
            <PlusCircle size={30} />
          </div>
          <span className="text-xs mt-1 text-[#FFA756]">Criar</span>
        </Link>
        
        {/* Botão Grupos */}
        <Link
          to="/grupos"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            path === "/grupos" || path.startsWith("/grupo/")
              ? "text-[#FFA756]"
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
            path === "/explorar" ? "text-[#FFA756]" : "text-muted-foreground"
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
