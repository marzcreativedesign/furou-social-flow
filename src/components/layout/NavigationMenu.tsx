
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, Calendar, Users, Bell, Settings,
  Calculator, ScrollText, Globe, User
} from "lucide-react";

interface NavigationMenuProps {
  isActive: (path: string) => boolean;
}

const NavigationMenu = ({ isActive }: NavigationMenuProps) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: 'Início', icon: <Home size={20} />, href: '/' },
    { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
    { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
    { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
    { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' },
    { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
    { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
    { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' }
  ];

  return (
    <div className="space-y-1 flex-1">
      {menuItems.map((item) => (
        <Button
          key={item.href}
          variant={isActive(item.href) ? "default" : "ghost"}
          className={`w-full justify-start mb-1 ${
            isActive(item.href) 
              ? "bg-primary hover:bg-primary-hover text-primary-foreground" 
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => navigate(item.href)}
        >
          {React.cloneElement(item.icon as React.ReactElement, { 
            size: 20, 
            className: "mr-2" 
          })}
          <span>{item.title}</span>
        </Button>
      ))}
    </div>
  );
};

export default NavigationMenu;
