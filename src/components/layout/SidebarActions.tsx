
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LogOut, Moon, Sun } from "lucide-react";

interface SidebarActionsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SidebarActions = ({ darkMode, toggleDarkMode }: SidebarActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-auto space-y-4">
      <Button 
        variant="outline"
        className="w-full justify-start border-primary text-primary hover:bg-primary/10"
        onClick={() => navigate("/criar")}
      >
        <PlusCircle size={20} className="mr-2" />
        <span>Criar Evento</span>
      </Button>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center">
          {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
          <span className="text-sm">Tema escuro</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-1" 
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>

      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={() => navigate("/login")}
      >
        <LogOut size={20} className="mr-2" />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default SidebarActions;
