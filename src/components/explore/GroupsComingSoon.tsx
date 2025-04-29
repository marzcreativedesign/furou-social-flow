
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupsComingSoonProps {
  onExploreEvents: () => void;
}

const GroupsComingSoon = ({ onExploreEvents }: GroupsComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-muted/50 rounded-full p-6 mb-6">
        <Construction className="h-12 w-12 text-primary/70" />
      </div>
      <h2 className="text-xl font-bold mb-2">Recurso em desenvolvimento</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        A funcionalidade de grupos está sendo desenvolvida e estará disponível em breve. 
        Enquanto isso, você pode explorar eventos disponíveis.
      </p>
      <Button onClick={onExploreEvents}>
        Explorar eventos
      </Button>
    </div>
  );
};

export default GroupsComingSoon;
