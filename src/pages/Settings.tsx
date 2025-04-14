
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";

// Import our new component files
import VisualSettings from "@/components/settings/VisualSettings";
import TextSettings from "@/components/settings/TextSettings";
import MotionSettings from "@/components/settings/MotionSettings";
import SettingsPreview from "@/components/settings/SettingsPreview";

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

  const applySettings = () => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Apply font family
    document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    switch (fontFamily) {
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
        <VisualSettings 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          highContrast={highContrast} 
          setHighContrast={setHighContrast} 
        />
        
        <TextSettings 
          fontSize={fontSize} 
          setFontSize={setFontSize} 
          fontFamily={fontFamily} 
          setFontFamily={setFontFamily} 
        />
        
        <MotionSettings 
          reducedMotion={reducedMotion} 
          setReducedMotion={setReducedMotion} 
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
