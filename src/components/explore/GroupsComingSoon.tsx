
import { Button } from "@/components/ui/button";

interface GroupsComingSoonProps {
  onExploreEvents: () => void;
}

const GroupsComingSoon = ({ onExploreEvents }: GroupsComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="p-4 bg-background rounded-full border border-border mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">Grupos em breve!</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Estamos trabalhando para trazer a funcionalidade de grupos em breve.
        Enquanto isso, você pode explorar eventos existentes.
      </p>
      <Button onClick={onExploreEvents} size="lg">
        Explorar Eventos
      </Button>
    </div>
  );
};

export default GroupsComingSoon;
