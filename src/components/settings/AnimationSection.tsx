
import { ZoomOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AnimationSectionProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

const AnimationSection = ({
  reducedMotion,
  onToggleReducedMotion
}: AnimationSectionProps) => {
  return (
    <>
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
        <Switch checked={reducedMotion} onCheckedChange={onToggleReducedMotion} />
      </div>
    </>
  );
};

export default AnimationSection;
