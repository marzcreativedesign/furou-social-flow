
import { useState } from "react";
import { Calculator, DollarSign, Users, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface CostCalculatorProps {
  isDrawer?: boolean;
}

const CostCalculator = ({ isDrawer = false }: CostCalculatorProps) => {
  const [totalCost, setTotalCost] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<string>("2");
  const [serviceFee, setServiceFee] = useState<boolean>(false);
  const [serviceFeePercentage, setServiceFeePercentage] = useState<string>("10");

  const handleTotalCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "");
    setTotalCost(value);
  };

  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "" || parseInt(value) >= 1) {
      setPeopleCount(value);
    }
  };

  const handleServiceFeePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "");
    setServiceFeePercentage(value);
  };

  const getCalculatedResult = () => {
    const formattedTotalCost = parseFloat(totalCost.replace(",", "."));
    const formattedPeopleCount = parseInt(peopleCount || "1");
    
    if (isNaN(formattedTotalCost) || isNaN(formattedPeopleCount) || formattedPeopleCount === 0) {
      return "0,00";
    }

    let finalCost = formattedTotalCost;
    
    if (serviceFee) {
      const feePercentage = parseFloat(serviceFeePercentage.replace(",", ".")) || 0;
      const feeAmount = formattedTotalCost * (feePercentage / 100);
      finalCost += feeAmount;
    }
    
    const perPersonCost = finalCost / formattedPeopleCount;
    return perPersonCost.toFixed(2).replace(".", ",");
  };

  const getFormattedTotalWithFee = () => {
    const formattedTotalCost = parseFloat(totalCost.replace(",", "."));
    
    if (isNaN(formattedTotalCost)) {
      return "0,00";
    }

    let finalCost = formattedTotalCost;
    
    if (serviceFee) {
      const feePercentage = parseFloat(serviceFeePercentage.replace(",", ".")) || 0;
      const feeAmount = formattedTotalCost * (feePercentage / 100);
      finalCost += feeAmount;
    }
    
    return finalCost.toFixed(2).replace(".", ",");
  };

  const handleCopyValue = () => {
    navigator.clipboard.writeText(`R$ ${getCalculatedResult()}`);
  };

  return (
    <Card className={isDrawer ? "border-0 shadow-none" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Calculator className="mr-2" size={20} />
          Calculadora de Rateio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totalCost">Valor total da conta</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              id="totalCost"
              placeholder="0,00"
              className="pl-9"
              value={totalCost}
              onChange={handleTotalCostChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="peopleCount">Número de pessoas</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              id="peopleCount"
              placeholder="2"
              className="pl-9"
              value={peopleCount}
              onChange={handlePeopleCountChange}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="serviceFee">Incluir taxa de serviço</Label>
            <Switch id="serviceFee" checked={serviceFee} onCheckedChange={setServiceFee} />
          </div>
          {serviceFee && (
            <div className="flex items-center">
              <Input
                className="w-16 h-8 text-center"
                value={serviceFeePercentage}
                onChange={handleServiceFeePercentageChange}
              />
              <span className="ml-1">%</span>
            </div>
          )}
        </div>
        
        {serviceFee && (
          <div className="text-sm text-muted-foreground">
            Total com taxa: R$ {getFormattedTotalWithFee()}
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Divide className="mr-2 text-primary" size={20} />
              <span className="text-sm">Valor por pessoa:</span>
            </div>
            <span className="text-xl font-bold">R$ {getCalculatedResult()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleCopyValue}>
          Copiar valor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CostCalculator;
