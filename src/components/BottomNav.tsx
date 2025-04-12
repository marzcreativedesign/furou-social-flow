
import { Home, Calendar, Plus, Bell, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Eventos", path: "/eventos", icon: Calendar },
    { name: "Criar", path: "/criar", icon: Plus, special: true },
    { name: "Grupos", path: "/grupos", icon: Users },
    { name: "Perfil", path: "/perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              item.special ? "w-16 h-16 bg-primary rounded-full -mt-6" : "px-2"
            } ${
              currentPath === item.path && !item.special
                ? "text-primary"
                : item.special
                ? "text-white"
                : "text-muted-foreground"
            }`}
          >
            <item.icon
              size={item.special ? 24 : 20}
              className={`${item.special ? "mb-0" : "mb-1"}`}
            />
            {!item.special && (
              <span className="text-xs font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
