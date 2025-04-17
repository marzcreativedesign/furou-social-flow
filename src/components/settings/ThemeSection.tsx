
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Contrast } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-[#EDEDED]">Tema</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <Label htmlFor="dark-mode" className="text-base cursor-pointer">
              Modo escuro
            </Label>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={onToggleDarkMode}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Contrast className="h-5 w-5" />
            <Label htmlFor="high-contrast" className="text-base cursor-pointer">
              Alto contraste
            </Label>
          </div>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={onToggleHighContrast}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          O alto contraste aumenta a diferença entre textos e fundos, melhorando a legibilidade.
        </p>
      </div>
    </div>
  );
};

export default ThemeSection;
