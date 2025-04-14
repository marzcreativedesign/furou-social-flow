
import { AlertCircle } from "lucide-react";

interface EventBudgetProps {
  budget: number;
  formatCurrency: (value: number) => string;
}

const EventBudget = ({ budget, formatCurrency }: EventBudgetProps) => {
  return (
    <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
      <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Orçamento do Evento</h2>
      <div className="bg-muted dark:bg-[#262626] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="dark:text-[#EDEDED]">Orçamento estimado:</span>
          <span className="font-bold dark:text-[#EDEDED]">{formatCurrency(budget)}</span>
        </div>
        
        <div className="flex items-start mt-4 text-sm text-muted-foreground bg-background/50 dark:bg-[#1A1A1A]/50 p-3 rounded-lg">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
          <p>Este é apenas um valor previsto. Os custos finais podem variar de acordo com as decisões dos participantes e atualizações do evento.</p>
        </div>
      </div>
    </div>
  );
};

export default EventBudget;
