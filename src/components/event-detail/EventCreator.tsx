
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface EventCreatorProps {
  host: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

const EventCreator = ({ host }: EventCreatorProps) => {
  const initials = host.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center gap-3 my-4">
      <Link to={`/perfil/${host.id}`} className="group">
        <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
          <AvatarImage src={host.imageUrl} alt={host.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials || <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">Criado por</p>
        <Link 
          to={`/perfil/${host.id}`}
          className="font-medium hover:text-primary transition-colors"
        >
          {host.name}
        </Link>
      </div>
    </div>
  );
};

export default EventCreator;
