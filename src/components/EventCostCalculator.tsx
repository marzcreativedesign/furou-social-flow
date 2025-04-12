
import { useState, useEffect } from "react";
import { Calculator, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type EventCostCalculatorProps = {
  attendeesCount: number;
};

const EventCostCalculator = ({ attendeesCount }: EventCostCalculatorProps) => {
  const [totalCost, setTotalCost] = useState<string>("100");
  const [serviceFee, setServiceFee] = useState<string>("10");
  const [costPerPerson, setCostPerPerson] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const calculateCost = () => {
      const cost = parseFloat(totalCost) || 0;
      const fee = parseFloat(serviceFee) || 0;
      
      if (attendeesCount <= 0) return;
      
      const totalWithFee = cost * (1 + fee / 100);
      const perPerson = totalWithFee / attendeesCount;
      
      setCostPerPerson(perPerson);
    };
    
    calculateCost();
  }, [totalCost, serviceFee, attendeesCount]);
  
  const handleCopyValue = () => {
    navigator.clipboard.writeText(`R$ ${costPerPerson.toFixed(2)}`);
    toast({
      title: "Valor copiado!",
      description: "O valor por pessoa foi copiado para sua área de transferência."
    });
  };
  
  return (
    <div className="bg-muted rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-bold">Simulador de Custos</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="total-cost">Custo total estimado (R$)</Label>
          <Input
            id="total-cost"
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
          />
        </div>
        
        <div className="grid gap-1.5">
          <Label htmlFor="service-fee">Taxa extra/Segurança (%)</Label>
          <Input
            id="service-fee"
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
          />
        </div>
        
        <div className="grid gap-1.5">
          <Label>Número de participantes confirmados</Label>
          <p className="bg-background border border-input rounded-md px-3 py-2">
            {attendeesCount}
          </p>
        </div>
        
        <div className="bg-background border border-input rounded-md p-3">
          <p className="text-sm text-muted-foreground text-center">Custo por pessoa</p>
          <p className="text-2xl font-bold text-primary text-center">
            R$ {costPerPerson.toFixed(2)}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 flex gap-2 items-center justify-center"
            onClick={handleCopyValue}
          >
            <Copy size={16} /> 
            Copiar valor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCostCalculator;
