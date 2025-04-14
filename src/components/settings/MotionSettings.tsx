
import { useState } from "react";
import { ZoomOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const MotionSettings = ({ 
  reducedMotion, 
  setReducedMotion 
}: {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
}) => {
  const { toast } = useToast();
  
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

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">Movimento e Animações</h2>
        <p className="text-muted-foreground">Ajuste como os elementos se movem na tela</p>
      </div>
      
      <Separator />

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
    </>
  );
};

export default MotionSettings;
