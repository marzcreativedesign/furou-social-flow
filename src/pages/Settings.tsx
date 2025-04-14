import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft, Check, Contrast, Eye, Type, ZoomOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('fontSize') || '100');
  });
  
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('fontFamily') || 'default';
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('reducedMotion') === 'true';
  });

  useEffect(() => {
    applySettings();
  }, []);

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

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    localStorage.setItem('fontFamily', value);
    
    applyFontFamily(value);
  };

  const applyFontFamily = (family: string) => {
    document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    
    switch (family) {
      case 'default':
        document.documentElement.classList.add('font-sans');
        break;
      case 'serif':
        document.documentElement.classList.add('font-serif');
        break;
      case 'mono':
        document.documentElement.classList.add('font-mono');
        break;
      case 'dyslexic':
        document.documentElement.classList.add('font-dyslexic');
        break;
    }
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

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('reducedMotion', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    toast({
      title: newValue ? "Animações reduzidas" : "Animações normais",
      description: "Suas preferências foram salvas",
    });
  };

  const applySettings = () => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    applyFontFamily(fontFamily);
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleSaveSettings = () => {
    applySettings();
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de acessibilidade foram aplicadas",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout title="Configurações de Acessibilidade" showBack={true} onBack={handleBack}>
      <div className="p-6 space-y-8 max-w-2xl mx-auto">
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
        
        <Separator />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold">Texto e Legibilidade</h2>
          <p className="text-muted-foreground">Ajuste o tamanho e estilo do texto para facilitar a leitura</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center">
              <Eye className="mr-2" size={20} />
              Tamanho da fonte
            </h3>
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

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center">
              <Type className="mr-2" size={20} />
              Família de fonte
            </h3>
            <p className="text-sm text-muted-foreground">
              Escolha a fonte que prefere para melhor legibilidade
            </p>
          </div>
          <RadioGroup value={fontFamily} onValueChange={handleFontFamilyChange}>
            <div className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="font-sans cursor-pointer">Padrão (Poppins)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="serif" id="serif" />
              <Label htmlFor="serif" className="font-serif cursor-pointer">Serif (Georgia)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="mono" id="mono" />
              <Label htmlFor="mono" className="font-mono cursor-pointer">Monospace (Courier)</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="dyslexic" id="dyslexic" />
              <Label htmlFor="dyslexic" className="font-dyslexic cursor-pointer">OpenDyslexic</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold">Movimento e Animações</h2>
          <p className="text-muted-foreground">Ajuste como os elementos se movem na tela</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center">
              <ZoomOut className="mr-2" size={20} />
              Reduzir animações
            </h3>
            <p className="text-sm text-muted-foreground">
              Desativa ou reduz animações da interface
            </p>
          </div>
          <Switch checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
        </div>

        <div className="pt-4">
          <Button 
            className="w-full mt-8" 
            onClick={handleSaveSettings}
          >
            <Check className="mr-2 h-4 w-4" />
            Salvar configurações
          </Button>
        </div>

        <div className="mt-8 space-y-4 border border-border rounded-xl p-4">
          <h3 className="text-lg font-medium">Visualização das configurações</h3>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Botões</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary">Primário</button>
                <button className="btn-secondary">Secundário</button>
                <button className="btn-outline">Contorno</button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Cards</p>
              <div className="event-card p-4">
                <p className="font-medium">Card de Evento</p>
                <p className="text-sm text-muted-foreground">Exemplo de card</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Feedback</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm">Sucesso</span>
                <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm">Erro</span>
                <span className="px-3 py-1 rounded-full bg-warning text-warning-foreground text-sm">Aviso</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Textos</p>
              <div className="space-y-1">
                <p className="text-lg font-bold">Título</p>
                <p className="text-base">Texto normal</p>
                <p className="text-sm text-muted-foreground">Texto secundário</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
