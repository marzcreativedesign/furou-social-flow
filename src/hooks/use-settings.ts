
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
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
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      document.documentElement.style.fontSize = `${fontSize}%`;
      
      document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
      document.documentElement.classList.add(`font-${fontFamily}`);
      
      if (reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };
    
    loadSettings();
  }, []);
  
  // Update a single setting
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
    setDirty = true
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
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
  };
  
  // Save all settings to localStorage
  const saveAllSettings = () => {
    Object.entries(settings).forEach(([key, value]) => {
      if (key === 'fontSize') {
        localStorage.setItem(key, value.toString());
      } else {
        localStorage.setItem(key, value.toString());
      }
    });
    
    setIsDirty(false);
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de acessibilidade foram atualizadas",
    });
  };
  
  return {
    settings,
    updateSetting,
    saveAllSettings,
    isDirty
  };
};
