import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/MainLayout";
import ThemeSection from "@/components/settings/ThemeSection";
import TextSection from "@/components/settings/TextSection";
import AnimationSection from "@/components/settings/AnimationSection";
import SettingsPreview from "@/components/settings/SettingsPreview";
import { useSettings } from "@/hooks/use-settings";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, saveAllSettings } = useSettings();

  const handleBack = () => {
    navigate(-1);
  };

  // Proper type definition for font families
  type FontFamily = "sans" | "serif" | "mono" | "dyslexic";

  // Create a type-safe font family change handler
  const handleFontChange = (font: FontFamily) => {
    updateSetting('fontFamily', font, false);
  };

  return (
    <MainLayout title="Configurações de Acessibilidade" showBack={true} onBack={handleBack}>
      <div className="p-6 space-y-8 max-w-2xl mx-auto">
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

        <div className="pt-4">
          <Button 
            className="w-full mt-8" 
            onClick={saveAllSettings}
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
