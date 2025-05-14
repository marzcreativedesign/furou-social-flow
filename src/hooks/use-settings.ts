import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface Settings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'mono' | 'dyslexic';
  reducedMotion: boolean;
}

const defaultSettings: Settings = {
  darkMode: false,
  highContrast: false,
  fontSize: 100,
  fontFamily: 'sans',
  reducedMotion: false
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const highContrast = localStorage.getItem('highContrast') === 'true';
        const fontSizeString = localStorage.getItem('fontSize');
        const fontSize = fontSizeString ? parseInt(fontSizeString) : 100;
        const fontFamily = localStorage.getItem('fontFamily') as Settings['fontFamily'] || 'sans';
        const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
        
        setSettings({
          darkMode,
          highContrast,
          fontSize,
          fontFamily,
          reducedMotion
        });
        
        // Apply settings
        applySettings({
          darkMode,
          highContrast,
          fontSize,
          fontFamily,
          reducedMotion
        });
      } catch (error) {
        console.error("Error loading settings:", error);
        // Apply default settings if there's an error
        applySettings(defaultSettings);
      }
    };
    
    loadSettings();
  }, []);
  
  // Function to apply settings to the document
  const applySettings = (settingsToApply: Settings) => {
    // Dark mode
    if (settingsToApply.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // High contrast
    if (settingsToApply.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Font size
    document.documentElement.style.fontSize = `${settingsToApply.fontSize}%`;
    
    // Font family
    document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    document.documentElement.classList.add(`font-${settingsToApply.fontFamily}`);
    
    // Reduced motion
    if (settingsToApply.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };
  
  // Update a single setting
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
    setDirty = true
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Apply the setting immediately
      switch (key) {
        case 'darkMode':
          if (value) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          break;
          
        case 'highContrast':
          if (value) {
            document.documentElement.classList.add('high-contrast');
          } else {
            document.documentElement.classList.remove('high-contrast');
          }
          break;
          
        case 'fontSize':
          document.documentElement.style.fontSize = `${value as number}%`;
          break;
          
        case 'fontFamily':
          document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
          document.documentElement.classList.add(`font-${value as string}`);
          break;
          
        case 'reducedMotion':
          if (value) {
            document.documentElement.classList.add('reduce-motion');
          } else {
            document.documentElement.classList.remove('reduce-motion');
          }
          break;
      }
      
      if (setDirty) {
        setIsDirty(true);
      }
      
      return newSettings;
    });
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    setIsDirty(true);
  };
  
  // Save all settings to localStorage
  const saveAllSettings = () => {
    try {
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value.toString());
      });
      
      setIsDirty(false);
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de acessibilidade foram atualizadas"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações",
        variant: "destructive"
      });
    }
  };
  
  return {
    settings,
    updateSetting,
    resetSettings,
    saveAllSettings,
    isDirty
  };
};
