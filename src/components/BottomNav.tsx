
import { Home, Calendar, Plus, Bell, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Dock, 
  DockIcon, 
  DockItem, 
  DockLabel 
} from "@/components/ui/dock";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Eventos", path: "/eventos", icon: Calendar },
    { name: "Criar", path: "/criar", icon: Plus, special: true },
    { name: "Grupos", path: "/grupos", icon: Users },
    { name: "Perfil", path: "/perfil", icon: User },
  ];

  // For smaller screens: standard navigation
  const StandardNav = () => (
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

  // For desktop: dock-style navigation
  const DockNav = () => (
    <div className="fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50">
      <Dock className="items-end pb-3">
        {navItems.map((item) => (
          <Link key={item.name} to={item.path}>
            <DockItem
              className={`${
                item.special 
                  ? "aspect-square rounded-full bg-primary text-white"
                  : currentPath === item.path
                  ? "aspect-square rounded-full bg-primary/10"
                  : "aspect-square rounded-full bg-gray-200"
              }`}
            >
              <DockLabel>{item.name}</DockLabel>
              <DockIcon>
                <item.icon 
                  className={`h-full w-full ${
                    item.special 
                      ? "text-white" 
                      : currentPath === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );

  return isDesktop ? <DockNav /> : <StandardNav />;
};

export default BottomNav;
