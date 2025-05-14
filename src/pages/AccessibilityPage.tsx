
import { useState } from "react";
import { Check, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/MainLayout";
import ThemeSection from "@/components/settings/ThemeSection";
import TextSection from "@/components/settings/TextSection";
import AnimationSection from "@/components/settings/AnimationSection";
import SettingsPreview from "@/components/settings/SettingsPreview";
import { useSettings } from "@/hooks/use-settings";
import { toast } from "@/components/ui/use-toast";

const AccessibilityPage = () => {
  const { settings, updateSetting, saveAllSettings, isDirty } = useSettings();
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Proper type definition for font families
  type FontFamily = "sans" | "serif" | "mono" | "dyslexic";

  // Create a type-safe font family change handler
  const handleFontChange = (font: FontFamily) => {
    updateSetting('fontFamily', font, false);
  };

  const handleSave = () => {
    saveAllSettings();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <MainLayout 
      title="Acessibilidade" 
      showBack={true}
    >
      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Accessibility className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Configurações de Acessibilidade</h1>
        </div>
        
        <p className="text-muted-foreground">
          Ajuste as configurações visuais e de interação para tornar o aplicativo mais acessível às suas necessidades.
        </p>
        
        <ThemeSection
          darkMode={settings.darkMode}
          onToggleDarkMode={() => updateSetting('darkMode', !settings.darkMode)}
          highContrast={settings.highContrast}
          onToggleHighContrast={() => updateSetting('highContrast', !settings.highContrast)}
        />
        
        <Separator />
        
        <TextSection
          fontSize={settings.fontSize}
          onFontSizeChange={(value) => updateSetting('fontSize', value[0], false)}
          fontFamily={settings.fontFamily}
          onFontFamilyChange={handleFontChange}
        />
        
        <Separator />
        
        <AnimationSection
          reducedMotion={settings.reducedMotion}
          onToggleReducedMotion={() => updateSetting('reducedMotion', !settings.reducedMotion)}
        />

        <div className="pt-4 relative">
          {isDirty && (
            <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 animate-fade-in">
              <Button 
                className="rounded-full px-6 shadow-lg" 
                onClick={handleSave}
              >
                <Check className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          )}
          {showSaveMessage && (
            <div className="fixed bottom-20 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
              Configurações salvas com sucesso!
            </div>
          )}
        </div>

        <SettingsPreview />
      </div>
    </MainLayout>
  );
};

export default AccessibilityPage;
