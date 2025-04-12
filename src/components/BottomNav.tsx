
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, PlusCircle, Users, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  // Helper function to determine if a menu item is active
  const isActive = (currentPath: string) => {
    if (currentPath === "/" && path === "/") return true;
    if (path.includes(currentPath) && currentPath !== "/") return true;
    return false;
  };
  
  // Bottom dock menu items
  const menuItems = [
    { title: 'Início', icon: <Home size={20} />, href: '/' },
    { title: 'Agenda', icon: <Calendar size={20} />, href: '/agenda' },
    { title: 'Grupos', icon: <Users size={20} />, href: '/grupos' },
    { title: 'Perfil', icon: <User size={20} />, href: '/perfil' },
  ];
  
  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-background/80 dark:bg-[#121212]/90 backdrop-blur-md border-t border-border dark:border-[#2C2C2C] z-40 px-2">
        {menuItems.map((item, index) => (
          <Tooltip key={index} delayDuration={300}>
            <TooltipTrigger asChild>
              <Link 
                to={item.href} 
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  isActive(item.href) 
                    ? "text-primary bg-primary/10 dark:bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground dark:text-[#B3B3B3] dark:hover:text-[#EDEDED]"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs dark:bg-[#1E1E1E] dark:text-[#EDEDED] dark:border-[#2C2C2C]">
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
        
        {/* Special create button in the middle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link 
              to="/criar" 
              className="flex flex-col items-center justify-center bg-primary text-primary-foreground dark:bg-[#FF6B00] dark:text-white hover:bg-primary-600 dark:hover:bg-[#FF8333] rounded-full p-3 -mt-5 shadow-lg"
            >
              <PlusCircle size={24} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs dark:bg-[#1E1E1E] dark:text-[#EDEDED] dark:border-[#2C2C2C]">
            Criar Evento
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default BottomNav;
