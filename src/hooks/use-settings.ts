
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface Settings {
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
  highContrast: boolean;
  reducedMotion: boolean;
}

export function useSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    fontSize: 100,
    fontFamily: 'default',
    highContrast: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedReducedMotion = localStorage.getItem('reducedMotion');

    setSettings({
      darkMode: savedDarkMode === 'true',
      fontSize: savedFontSize ? parseInt(savedFontSize) : 100,
      fontFamily: savedFontFamily || 'default',
      highContrast: savedHighContrast === 'true',
      reducedMotion: savedReducedMotion === 'true'
    });
  }, []);

  const applySettings = () => {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    // Apply font family
    document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    document.documentElement.classList.add(`font-${settings.fontFamily}`);
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
    showToast = true
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value.toString());

    if (showToast) {
      let message = '';
      switch (key) {
        case 'darkMode':
          message = value ? "Modo escuro ativado" : "Modo claro ativado";
          break;
        case 'highContrast':
          message = value ? "Alto contraste ativado" : "Alto contraste desativado";
          break;
        case 'reducedMotion':
          message = value ? "Animações reduzidas" : "Animações normais";
          break;
      }
      
      if (message) {
        toast({
          title: message,
          description: "Suas preferências foram salvas",
        });
      }
    }
  };

  const saveAllSettings = () => {
    applySettings();
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de acessibilidade foram aplicadas",
    });
  };

  return {
    settings,
    updateSetting,
    saveAllSettings
  };
}
