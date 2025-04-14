
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout";

interface EventNotFoundProps {
  onBack: () => void;
}

const EventNotFound = ({ onBack }: EventNotFoundProps) => {
  const navigate = useNavigate();
  
  return (
    <MainLayout showBack onBack={onBack} title="Evento não encontrado">
      <div className="flex flex-col items-center justify-center p-4 h-64">
        <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Evento não encontrado</h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          O evento que você está procurando não existe ou foi removido.
        </p>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/eventos')}
        >
          Ver todos os eventos
        </button>
      </div>
    </MainLayout>
  );
};

export default EventNotFound;
