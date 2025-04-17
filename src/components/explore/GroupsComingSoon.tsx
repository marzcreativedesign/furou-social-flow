
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";

interface GroupsComingSoonProps {
  onExploreEvents: () => void;
  onCreateGroup: () => void;
}

const GroupsComingSoon = ({ onExploreEvents, onCreateGroup }: GroupsComingSoonProps) => {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">Recursos de grupos em breve</h3>
      <p className="text-muted-foreground mb-4">
        Estamos trabalhando para trazer a descoberta de grupos em breve!
      </p>
      <Button 
        variant="outline"
        onClick={onExploreEvents}
        className="mr-2"
      >
        Ver eventos
      </Button>
      <Button onClick={onCreateGroup}>
        <PlusCircle size={16} className="mr-1" />
        Criar grupo
      </Button>
    </div>
  );
};

export default GroupsComingSoon;
