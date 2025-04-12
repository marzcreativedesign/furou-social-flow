
import { useState } from "react";
import { Moon, Sun, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [fontFamily, setFontFamily] = useState("default");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
    toast({
      title: !darkMode ? "Modo escuro ativado" : "Modo claro ativado",
      description: "Suas preferências foram salvas",
    });
  };

  const handleSaveSettings = () => {
    // In a real app, we would save these preferences to local storage or a user account
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de acessibilidade foram aplicadas",
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    document.documentElement.style.fontSize = `${value[0]}%`;
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    switch (value) {
      case "default":
        document.documentElement.style.fontFamily = "";
        break;
      case "sans":
        document.documentElement.style.fontFamily = "'Inter', sans-serif";
        break;
      case "serif":
        document.documentElement.style.fontFamily = "'Merriweather', serif";
        break;
      case "mono":
        document.documentElement.style.fontFamily = "'Roboto Mono', monospace";
        break;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">Configurações de Acessibilidade</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              {darkMode ? <Moon className="mr-2" size={20} /> : <Sun className="mr-2" size={20} />}
              Modo escuro
            </h2>
            <p className="text-sm text-muted-foreground">
              Alterna entre tema claro e escuro
            </p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium">Tamanho da fonte</h2>
            <p className="text-sm text-muted-foreground">
              Ajuste o tamanho da fonte para melhor leitura
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">A</span>
            <Slider 
              value={[fontSize]} 
              min={75} 
              max={150} 
              step={5} 
              onValueChange={handleFontSizeChange} 
              className="flex-1"
            />
            <span className="text-lg">A</span>
          </div>
          <p className="text-sm text-center">{fontSize}%</p>
        </div>

        {/* Font Family */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium">Família de fonte</h2>
            <p className="text-sm text-muted-foreground">
              Escolha a fonte que prefere para melhor legibilidade
            </p>
          </div>
          <RadioGroup value={fontFamily} onValueChange={handleFontFamilyChange}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="font-normal">Padrão do sistema</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="sans" id="sans" />
              <Label htmlFor="sans" className="font-sans">Sans-serif</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="serif" id="serif" />
              <Label htmlFor="serif" className="font-serif">Serif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mono" id="mono" />
              <Label htmlFor="mono" className="font-mono">Monospace</Label>
            </div>
          </RadioGroup>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Alto contraste</h2>
            <p className="text-sm text-muted-foreground">
              Aumenta o contraste para melhor visibilidade
            </p>
          </div>
          <Switch checked={highContrast} onCheckedChange={setHighContrast} />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Reduzir animações</h2>
            <p className="text-sm text-muted-foreground">
              Desativa ou reduz animações da interface
            </p>
          </div>
          <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
        </div>

        <Button className="w-full mt-8" onClick={handleSaveSettings}>
          <Check className="mr-2 h-4 w-4" />
          Salvar configurações
        </Button>
      </div>
    </div>
  );
};

export default Settings;
