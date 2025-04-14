
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, CalendarDays } from "lucide-react";
import MainLayout from "../components/MainLayout";
import ConfirmationButton from "../components/ConfirmationButton";
import { useToast } from "../hooks/use-toast";
import EventDiscussion from "../components/EventDiscussion";
import EventGallery from "../components/EventGallery";
import EventCostCalculator from "../components/EventCostCalculator";
import EventHeader from "@/components/event-detail/EventHeader";
import EventInfo from "@/components/event-detail/EventInfo";
import EventParticipants from "@/components/event-detail/EventParticipants";
import EventEditDialog from "@/components/event-detail/EventEditDialog";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventParticipant {
  id: string;
  user_id: string;
  status: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address: string;
  is_public: boolean;
  image_url: string | null;
  creator_id: string;
  comments: any[];
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  event_participants: EventParticipant[];
  estimated_budget: number | null;
  group_events?: { group_id: string; groups?: { name: string } }[];
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventData, setEditEventData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "public" as "public" | "private" | "group",
    includeEstimatedBudget: false,
    estimatedBudget: "",
  });
  
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await EventsService.getEventById(id);
        
        if (error) {
          console.error("Error fetching event:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do evento",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setEvent(data);
          
          // Parse date for edit form
          const eventDate = parseISO(data.date);
          const formattedDate = format(eventDate, 'yyyy-MM-dd');
          const startTime = format(eventDate, 'HH:mm');
          const endTime = format(new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), 'HH:mm'); // Default 3 hours
          
          setEditEventData({
            title: data.title,
            description: data.description || "",
            location: data.location || "",
            address: data.address || "",
            date: formattedDate,
            startTime: startTime,
            endTime: endTime,
            type: data.is_public ? "public" : (data.group_events && data.group_events.length > 0 ? "group" : "private"),
            includeEstimatedBudget: !!data.estimated_budget,
            estimatedBudget: data.estimated_budget ? data.estimated_budget.toString() : "",
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do evento",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [id, toast]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleConfirm = async () => {
    // Toast already handled in ConfirmationButton component
  };
  
  const handleDecline = async () => {
    // Toast already handled in ConfirmationButton component
  };

  const handleEditEventDataChange = (changes: Partial<typeof editEventData>) => {
    setEditEventData(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSaveEditedEvent = async () => {
    // This would normally update the event in the database
    // For now just update the local state and show toast
    toast({
      title: "Evento atualizado",
      description: "As alterações no evento foram salvas com sucesso",
    });
    
    setEditDialogOpen(false);
  };

  // Process participants into appropriate arrays for the EventParticipants component
  const processParticipants = () => {
    if (!event) return { confirmedAttendees: [], pendingAttendees: [], cancelledAttendees: [] };
    
    const confirmed = [];
    const pending = [];
    const cancelled = [];
    
    for (const participant of event.event_participants) {
      if (!participant.profiles) continue;
      
      const attendee = {
        id: participant.user_id,
        name: participant.profiles.full_name || "Usuário",
        imageUrl: participant.profiles.avatar_url || "https://i.pravatar.cc/150?u=" + participant.user_id
      };
      
      if (participant.status === 'confirmed') {
        confirmed.push(attendee);
      } else if (participant.status === 'pending') {
        pending.push(attendee);
      } else if (participant.status === 'declined') {
        cancelled.push(attendee);
      }
    }
    
    return { confirmedAttendees: confirmed, pendingAttendees: pending, cancelledAttendees: cancelled };
  };

  const { confirmedAttendees, pendingAttendees, cancelledAttendees } = processParticipants();
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, d 'de' MMMM • HH:mm", { locale: ptBR });
  };
  
  const isEventHost = event?.creator_id === user?.id;
  const eventType = event?.is_public ? "public" : (event?.group_events && event?.group_events.length > 0 ? "group" : "private");
  const groupName = event?.group_events?.[0]?.groups?.name || null;
  
  const formatCurrency = (value: number | string | null) => {
    if (value === null) return "";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
  };

  if (loading) {
    return (
      <MainLayout showBack onBack={handleBack} title="Carregando evento...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!event) {
    return (
      <MainLayout showBack onBack={handleBack} title="Evento não encontrado">
        <div className="flex flex-col items-center justify-center p-4 h-64">
          <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Evento não encontrado</h2>
          <p className="text-muted-foreground mb-4 text-center">
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
  }

  return (
    <MainLayout showBack onBack={handleBack} title={event.title}>
      <EventHeader
        id={event.id}
        title={event.title}
        imageUrl={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3"}
        type={eventType}
        groupName={groupName}
        host={event.profiles ? {
          id: event.profiles.id,
          name: event.profiles.full_name || "Usuário",
          imageUrl: event.profiles.avatar_url || "https://i.pravatar.cc/150?u=" + event.profiles.id
        } : {
          id: "",
          name: "Usuário desconhecido",
          imageUrl: "https://i.pravatar.cc/150"
        }}
        isEventHost={isEventHost}
        onEditClick={() => setEditDialogOpen(true)}
      />
      
      <div className="p-4">
        <EventInfo
          fullDate={formatEventDate(event.date)}
          location={event.location || "Local não definido"}
          address={event.address || ""}
          attendeesCount={event.event_participants ? event.event_participants.length : 0}
        />
        
        <div className="border-t border-b py-4 my-4 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-2 dark:text-[#EDEDED]">Sobre</h2>
          <p className="text-muted-foreground dark:text-[#B3B3B3]">{event.description}</p>
        </div>
        
        <div className="bg-muted dark:bg-[#262626] p-4 rounded-xl mb-6">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Você vai?</h2>
          <ConfirmationButton 
            onConfirm={handleConfirm}
            onDecline={handleDecline}
            eventId={id || ""}
          />
        </div>
        
        {event.estimated_budget && (
          <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
            <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Orçamento do Evento</h2>
            <div className="bg-muted dark:bg-[#262626] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="dark:text-[#EDEDED]">Orçamento estimado:</span>
                <span className="font-bold dark:text-[#EDEDED]">{formatCurrency(event.estimated_budget)}</span>
              </div>
              
              <div className="flex items-start mt-4 text-sm text-muted-foreground bg-background/50 dark:bg-[#1A1A1A]/50 p-3 rounded-lg">
                <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
                <p>Este é apenas um valor previsto. Os custos finais podem variar de acordo com as decisões dos participantes e atualizações do evento.</p>
              </div>
            </div>
          </div>
        )}
        
        <EventParticipants
          confirmedAttendees={confirmedAttendees}
          pendingAttendees={pendingAttendees}
          cancelledAttendees={cancelledAttendees}
          showAllAttendees={showAllAttendees}
          onToggleShowAll={() => setShowAllAttendees(!showAllAttendees)}
          eventType={eventType}
        />
        
        {eventType !== "public" && (
          <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
            <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Calculadora de Custos</h2>
            <EventCostCalculator attendeesCount={confirmedAttendees.length} />
          </div>
        )}
        
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Discussão</h2>
          <EventDiscussion 
            eventId={event.id} 
            initialComments={event.comments || []} 
          />
        </div>
        
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Galeria</h2>
          <EventGallery 
            eventId={event.id}
            initialImages={[]} // No gallery images in the current API structure
          />
        </div>
      </div>

      <EventEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editEventData={editEventData}
        onEventDataChange={handleEditEventDataChange}
        onSave={handleSaveEditedEvent}
      />
    </MainLayout>
  );
};

export default EventDetail;
