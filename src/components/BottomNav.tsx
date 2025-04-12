
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, PlusCircle, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const getActiveClass = (currentPath: string) => {
    if (currentPath === "/" && path === "/") return "text-primary border-t-2 border-primary";
    if (path.includes(currentPath) && currentPath !== "/") return "text-primary border-t-2 border-primary";
    return "text-muted-foreground";
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background/80 backdrop-blur-md border-t border-border z-40">
      <Link to="/" className={`flex flex-col items-center pt-1 ${getActiveClass("/")}`}>
        <Home size={20} />
        <span className="text-xs mt-1">Início</span>
      </Link>
      
      <Link to="/agenda" className={`flex flex-col items-center pt-1 ${getActiveClass("/agenda")}`}>
        <Calendar size={20} />
        <span className="text-xs mt-1">Agenda</span>
      </Link>
      
      <Link to="/criar" className="flex flex-col items-center bg-primary text-white rounded-full p-2 -mt-5 shadow-lg">
        <PlusCircle size={28} />
      </Link>
      
      <Link to="/grupos" className={`flex flex-col items-center pt-1 ${getActiveClass("/grupo")}`}>
        <Users size={20} />
        <span className="text-xs mt-1">Grupos</span>
      </Link>
      
      <Link to="/perfil" className={`flex flex-col items-center pt-1 ${getActiveClass("/perfil")}`}>
        <User size={20} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
