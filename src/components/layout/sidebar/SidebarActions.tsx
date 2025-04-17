
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarActionsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const SidebarActions = ({ darkMode, toggleDarkMode, onLogout }: SidebarActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center">
          {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
          <span className="text-sm">Tema escuro</span>
        </div>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-start border-primary text-primary hover:bg-primary/10"
        onClick={() => navigate("/criar")}
      >
        <PlusCircle size={20} className="mr-2" />
        <span>Criar Evento</span>
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={onLogout}
      >
        <LogOut size={20} className="mr-2" />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default SidebarActions;
