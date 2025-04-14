
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoGroupsProps {
  onCreateClick: () => void;
}

const NoGroups = ({ onCreateClick }: NoGroupsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Users size={48} className="text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-2">Nenhum grupo ainda</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Crie seu primeiro grupo para organizar seus eventos com amigos
      </p>
      <Button onClick={onCreateClick}>
        <Plus size={16} className="mr-2" />
        Criar meu primeiro grupo
      </Button>
    </div>
  );
};

export default NoGroups;
