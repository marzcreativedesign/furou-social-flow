
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CostCalculator from "@/components/CostCalculator";
import MainLayout from "@/components/MainLayout";

const CostCalculatorPage = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout 
      title="Calculadora de Rateio" 
      showBack 
      onBack={() => navigate(-1)} 
      showDock
    >
      <div className="container mx-auto max-w-md px-4 py-6">
        <p className="text-muted-foreground mb-6 text-center">
          Calcule facilmente quanto cada pessoa deve pagar em um evento compartilhado.
        </p>
        
        <CostCalculator />
        
        <div className="mt-8">
          <h3 className="font-medium mb-2">Como usar:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
              <p>Digite o valor total da conta</p>
            </li>
            <li className="flex">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
              <p>Insira o número de pessoas que vão dividir a conta</p>
            </li>
            <li className="flex">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
              <p>Opcionalmente, adicione uma taxa de serviço em percentual</p>
            </li>
            <li className="flex">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
              <p>Veja o resultado por pessoa e copie o valor com um toque</p>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default CostCalculatorPage;
