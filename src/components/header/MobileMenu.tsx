
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Hamburger } from "@/components/ui/hamburger";
import { useAuth } from "@/contexts/AuthContext"; // Added import for auth
import { supabase } from "@/integrations/supabase/client"; // Added import for supabase
import { 
  Home, Calendar, Users, PlusCircle, LogOut,
  User, Calculator, Moon, Sun, ScrollText,
  Globe, Settings, Bell
} from "lucide-react";

interface MobileMenuProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const MobileMenu = ({ darkMode, toggleDarkMode }: MobileMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user
  
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: "Usuário",
    email: user?.email || "usuario@exemplo.com",
    avatarUrl: "",
    initials: "U"
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }

          const fullName = profileData?.full_name || user.user_metadata?.full_name || "Usuário";
          const nameParts = fullName.split(' ');
          const initials = nameParts.length > 1 
            ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}` 
            : fullName.charAt(0);
          
          setUserProfile({
            name: fullName,
            email: user.email || "usuario@exemplo.com",
            avatarUrl: profileData?.avatar_url || "",
            initials: initials.toUpperCase()
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const menuItems = [
    { title: 'Início', icon: <Home size={20} />, href: '/' },
    { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
    { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
    { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' },
    { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' },
    { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' },
    { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
    { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
    { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' },
  ];

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Hamburger onClick={() => {}} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-gray-900 dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <span className="text-2xl font-bold">Furou?!</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <Link 
          to="/perfil" 
          onClick={() => setMenuOpen(false)}
          className="flex items-center mb-6 px-2 hover:bg-muted/50 dark:hover:bg-gray-800/50 rounded-md p-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile.avatarUrl} />
            <AvatarFallback>{userProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          </div>
        </Link>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => { 
                  navigate(item.href); 
                  setMenuOpen(false); 
                }}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="px-4 py-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? <Moon className="mr-2" size={20} /> : <Sun className="mr-2" size={20} />}
                <span>Modo escuro</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { 
                navigate("/criar"); 
                setMenuOpen(false); 
              }}
            >
              <PlusCircle className="mr-2" size={20} />
              <span>Criar evento</span>
            </Button>
            
            <Button 
              variant="destructive"
              className="w-full justify-start"
              onClick={() => navigate("/login")}
            >
              <LogOut className="mr-2" size={20} />
              <span>Sair</span>
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
