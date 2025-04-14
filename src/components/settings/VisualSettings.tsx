
import { useState } from "react";
import { Moon, Sun, Contrast } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const VisualSettings = ({ 
  darkMode, 
  setDarkMode, 
  highContrast, 
  setHighContrast 
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}) => {
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newDarkMode ? "Modo escuro ativado" : "Modo claro ativado",
      description: "Suas preferências foram salvas",
    });
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    toast({
      title: newValue ? "Alto contraste ativado" : "Alto contraste desativado",
      description: "Suas preferências foram salvas",
    });
  };

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">Personalização Visual</h2>
        <p className="text-muted-foreground">Ajuste a aparência do aplicativo conforme sua preferência</p>
      </div>
      
      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium flex items-center">
            {darkMode ? <Moon className="mr-2" size={20} /> : <Sun className="mr-2" size={20} />}
            Modo escuro
          </h3>
          <p className="text-sm text-muted-foreground">
            Alterna entre tema claro e escuro
          </p>
        </div>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium flex items-center">
            <Contrast className="mr-2" size={20} />
            Alto contraste
          </h3>
          <p className="text-sm text-muted-foreground">
            Aumenta o contraste para melhor visibilidade
          </p>
        </div>
        <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
      </div>
    </>
  );
};

export default VisualSettings;
