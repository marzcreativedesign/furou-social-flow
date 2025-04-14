
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ThemeSectionProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

const ThemeSection = ({
  darkMode,
  onToggleDarkMode,
  highContrast,
  onToggleHighContrast
}: ThemeSectionProps) => {
  const { toast } = useToast();

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
        <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
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
        <Switch checked={highContrast} onCheckedChange={onToggleHighContrast} />
      </div>
    </>
  );
};

export default ThemeSection;
