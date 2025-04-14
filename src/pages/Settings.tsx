import { useState, useEffect } from "react";
import { Check, Contrast } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import ThemeSection from "@/components/settings/ThemeSection";
import TextSection from "@/components/settings/TextSection";
import AnimationSection from "@/components/settings/AnimationSection";
import SettingsPreview from "@/components/settings/SettingsPreview";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [fontFamily, setFontFamily] = useState("default");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
    
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize !== null) {
      setFontSize(parseInt(savedFontSize));
    }
    
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily !== null) {
      setFontFamily(savedFontFamily);
    }
    
    const savedHighContrast = localStorage.getItem('highContrast');
    if (savedHighContrast !== null) {
      setHighContrast(savedHighContrast === 'true');
    }
    
    const savedReducedMotion = localStorage.getItem('reducedMotion');
    if (savedReducedMotion !== null) {
      setReducedMotion(savedReducedMotion === 'true');
    }

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
        <ThemeSection
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          highContrast={highContrast}
          onToggleHighContrast={toggleHighContrast}
        />
        
        <Separator />
        
        <TextSection
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
          fontFamily={fontFamily}
          onFontFamilyChange={handleFontFamilyChange}
        />
        
        <Separator />
        
        <AnimationSection
          reducedMotion={reducedMotion}
          onToggleReducedMotion={toggleReducedMotion}
        />

        <div className="pt-4">
          <Button 
            className="w-full mt-8" 
            onClick={handleSaveSettings}
          >
            <Check className="mr-2 h-4 w-4" />
            Salvar configurações
          </Button>
        </div>

        <SettingsPreview />
      </div>
    </MainLayout>
  );
};

export default Settings;
