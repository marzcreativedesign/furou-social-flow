
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
  status?: "invited" | "pending";
}

interface PendingInvitesProps {
  events: Event[];
  loading: boolean;
  onStatusUpdate: (eventId: string, status: 'confirmed' | 'declined') => void;
}

export const PendingInvitesLoading = () => (
  <div className="mb-8">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PendingInvites = ({ events, loading, onStatusUpdate }: PendingInvitesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (loading) return <PendingInvitesLoading />;
  
  if (!events || events.length === 0) return null;
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "EEEE, dd 'de' MMMM • HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleAccept = async (eventId: string) => {
    try {
      await EventsService.joinEvent(eventId);
      toast({
        title: "Convite aceito",
        description: "Você está confirmado para o evento!",
      });
      onStatusUpdate(eventId, 'confirmed');
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar o convite. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDecline = async (eventId: string) => {
    try {
      await EventsService.declineEvent(eventId);
      toast({
        title: "Convite recusado",
        description: "Você recusou o convite para o evento.",
      });
      onStatusUpdate(eventId, 'declined');
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível recusar o convite. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">
        Convites Pendentes ({events.length})
      </h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div 
                className="h-16 w-16 rounded-md flex-shrink-0 bg-cover bg-center cursor-pointer" 
                style={{ 
                  backgroundImage: `url(${event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"})` 
                }}
                onClick={() => handleEventClick(event.id)}
              />
              
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => handleEventClick(event.id)}
              >
                <h3 className="font-medium text-lg dark:text-[#EDEDED]">{event.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(event.date)}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                  onClick={() => handleDecline(event.id)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => handleAccept(event.id)}
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInvites;
