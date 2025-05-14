
import { Eye, Type } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TextSectionProps {
  fontSize: number;
  onFontSizeChange: (value: number[]) => void;
  fontFamily: string;
  onFontFamilyChange: (value: 'sans' | 'serif' | 'mono' | 'dyslexic') => void;
}

const TextSection = ({
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange
}: TextSectionProps) => {
  return (
    <>
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
            onValueChange={onFontSizeChange} 
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
        <RadioGroup value={fontFamily} onValueChange={onFontFamilyChange}>
          <div className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-muted/50">
            <RadioGroupItem value="sans" id="sans" />
            <Label htmlFor="sans" className="font-sans cursor-pointer">Padrão (Poppins)</Label>
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
    </>
  );
};

export default TextSection;
