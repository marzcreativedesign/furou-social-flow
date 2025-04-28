
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, UserPlus, Trophy } from "lucide-react";

interface GroupsComingSoonProps {
  onExploreEvents: () => void;
}

const GroupsComingSoon = ({ onExploreEvents }: GroupsComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-4 bg-background rounded-full border border-border mb-4">
        <Users className="text-primary w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">Grupos Disponíveis!</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Agora você pode criar e gerenciar grupos, enviar convites e ver rankings de participação.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" size="lg">
          <Link to="/grupos">
            <Users className="mr-2 h-4 w-4" />
            Ver Meus Grupos
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/grupos/criar">
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Novo Grupo
          </Link>
        </Button>
        <Button onClick={onExploreEvents} variant="ghost" size="lg">
          Explorar Eventos
        </Button>
      </div>
      <div className="mt-12 border-t pt-6 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Trophy className="text-amber-500 w-6 h-6" />
          <h3 className="text-lg font-medium ml-2">Rankings Disponíveis</h3>
        </div>
        <div className="flex justify-between gap-4">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/rankings/confirmados">Top Confirmados</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/rankings/furoes">Top Furões</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupsComingSoon;
