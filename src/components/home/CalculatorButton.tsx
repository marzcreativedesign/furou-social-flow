import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CostCalculator from "@/components/CostCalculator";
const CalculatorButton = () => {
  const navigate = useNavigate();
  return <Sheet>
      <SheetTrigger asChild>
        
      </SheetTrigger>
      <SheetContent className="dark:bg-card dark:border-[#2C2C2C]">
        <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Calculadora de Rateio</h2>
        <p className="text-muted-foreground mb-4 dark:text-[#B3B3B3]">
          Divida facilmente o valor de um evento entre os participantes
        </p>
        <CostCalculator isDrawer />
        
        <Button className="w-full mt-4 dark:bg-primary dark:hover:bg-accent" onClick={() => navigate("/calculadora")}>
          Abrir calculadora completa
        </Button>
      </SheetContent>
    </Sheet>;
};
export default CalculatorButton;