
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import MainLayout from "@/components/MainLayout";
import EventHeader from "@/components/event-detail/EventHeader";
import EventCreator from "@/components/event-detail/EventCreator";
import EventInfo from "@/components/event-detail/EventInfo";
import EventParticipants from "@/components/event-detail/EventParticipants";
import EventEditDialog from "@/components/event-detail/EventEditDialog";
import EventDetailSkeleton from "@/components/event-detail/EventDetailSkeleton";
import EventNotFound from "@/components/event-detail/EventNotFound";
import EventBudget from "@/components/event-detail/EventBudget";
import EventDetailParticipation from "@/components/event-detail/EventDetailParticipation";
import EventDetailDiscussion from "@/components/event-detail/EventDetailDiscussion";
import EventGallery from "@/components/event-detail/EventGallery";
import { useEventDetail } from "@/hooks/use-event-detail";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { loading, event, editEventData, setEditEventData } = useEventDetail(id);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditEventDataChange = (changes: Partial<typeof editEventData>) => {
    setEditEventData(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSaveEditedEvent = async () => {
    toast({
      title: "Evento atualizado",
      description: "As alterações no evento foram salvas com sucesso",
    });
    setEditDialogOpen(false);
  };

  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, d 'de' MMMM • HH:mm", { locale: ptBR });
  };
  
  const formatCurrency = (value: number | string | null) => {
    if (value === null) return "";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
  };

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
      } else if (participant.status === 'pending' || participant.status === 'invited') {
        pending.push(attendee);
      } else if (participant.status === 'declined') {
        cancelled.push(attendee);
      }
    }
    
    return { confirmedAttendees: confirmed, pendingAttendees: pending, cancelledAttendees: cancelled };
  };

  if (loading) {
    return <EventDetailSkeleton onBack={handleBack} />;
  }
  
  if (!event) {
    return <EventNotFound onBack={handleBack} />;
  }

  const { confirmedAttendees, pendingAttendees, cancelledAttendees } = processParticipants();
  const isEventHost = event.creator_id === user?.id;
  const eventType = event.is_public ? "public" : (event.group_events && event.group_events.length > 0 ? "group" : "private");
  const groupName = event.group_events?.[0]?.groups?.name || null;

  return (
    <MainLayout showBack onBack={handleBack} title={event.title}>
      <EventHeader
        id={event.id}
        title={event.title}
        date={event.date}
        location={event.location || "Local não definido"}
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
        {/* Criador do evento component */}
        {event.profiles && (
          <EventCreator 
            host={{
              id: event.profiles.id,
              name: event.profiles.full_name || "Usuário",
              imageUrl: event.profiles.avatar_url || "https://i.pravatar.cc/150?u=" + event.profiles.id
            }}
          />
        )}
        
        <EventInfo
          fullDate={formatEventDate(event.date)}
          location={event.location || "Local não definido"}
          address={event.address || ""}
          participants={event.event_participants}
        />
        
        <div className="border-t border-b py-4 my-4 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-2 dark:text-[#EDEDED]">Sobre</h2>
          <p className="text-muted-foreground dark:text-[#B3B3B3]">{event.description}</p>
        </div>
        
        <EventDetailParticipation
          id={event.id}
          eventType={eventType}
          confirmedAttendeesCount={confirmedAttendees.length}
        />
        
        {event.estimated_budget && (
          <EventBudget 
            budget={event.estimated_budget} 
            formatCurrency={formatCurrency} 
          />
        )}
        
        <EventGallery eventId={event.id} />
        
        <EventParticipants
          confirmedAttendees={confirmedAttendees}
          pendingAttendees={pendingAttendees}
          cancelledAttendees={cancelledAttendees}
          showAllAttendees={showAllAttendees}
          onToggleShowAll={() => setShowAllAttendees(!showAllAttendees)}
          eventType={eventType}
        />
        
        <EventDetailDiscussion 
          eventId={event.id}
          comments={event.comments || []}
        />
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
