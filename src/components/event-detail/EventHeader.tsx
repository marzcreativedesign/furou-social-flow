
import { Link } from "react-router-dom";
import { Tag, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import EventShareButton from "@/components/EventShareButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EventTag from "@/components/EventTag";

interface EventHeaderProps {
  id: string;
  title: string;
  imageUrl: string;
  type: "public" | "private" | "group";
  groupName?: string | null;
  host: {
    id: string;
    name: string;
    imageUrl: string;
  };
  isEventHost: boolean;
  onEditClick: () => void;
}

const EventHeader = ({
  id,
  title,
  imageUrl,
  type,
  groupName,
  host,
  isEventHost,
  onEditClick,
}: EventHeaderProps) => {
  const { toast } = useToast();
  const eventUrl = `${window.location.origin}/evento/${id}`;

  const handleCopyEventId = () => {
    navigator.clipboard.writeText(id).then(() => {
      toast({
        title: "ID copiado!",
        description: "O ID do evento foi copiado para sua área de transferência"
      });
    });
  };

  return (
    <div className="relative">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="absolute top-4 left-4 flex flex-wrap gap-1">
        <EventTag 
          type={type}
          label={type === "public" ? "Público" : type === "private" ? "Privado" : "Grupo"} 
        />
        {groupName && (
          <EventTag type="group" label={groupName} />
        )}
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        {isEventHost && (
          <Button 
            onClick={onEditClick}
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full dark:bg-card/80"
            size="icon"
            variant="ghost"
          >
            <Edit2 size={20} className="text-foreground" />
          </Button>
        )}
        
        <EventShareButton 
          eventId={id}
          eventTitle={title}
          eventUrl={eventUrl}
          variant="prominent"
          size="icon"
          showText={false}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 cursor-pointer border-[#FF8A1E] bg-[#FF8A1E]/5 hover:bg-[#FF8A1E]/10"
                  onClick={handleCopyEventId}
                >
                  <Tag size={12} className="text-[#FF8A1E]" />
                  <span className="text-xs font-medium text-[#FF8A1E]">ID: {id}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Clique para copiar o ID</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center mb-4">
          <Link to={`/usuario/${host.id}`}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={host.imageUrl} alt={host.name} />
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                {host.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link 
              to={`/usuario/${host.id}`} 
              className="text-sm font-medium hover:underline dark:text-[#EDEDED]"
            >
              {host.name}
            </Link>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Organizador</p>
          </div>
          
          <div className="ml-auto">
            <EventShareButton
              eventId={id}
              eventTitle={title}
              eventUrl={eventUrl}
              variant="secondary"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
