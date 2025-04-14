import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Edit2 } from "lucide-react";
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

const MOCK_EVENT = {
  id: "1",
  title: "Happy Hour no Bar do Zé",
  date: "Hoje, 19:00",
  fullDate: "Sexta-feira, 8 de Abril • 19:00 - 23:00",
  location: "Bar do Zé",
  address: "Rua Augusta, 1492, São Paulo",
  description: "Vamos nos encontrar para tomar umas cervejas e conversar! Primeira rodada por minha conta.",
  imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  host: {
    id: "1",
    name: "Carlos Oliveira",
    imageUrl: "https://i.pravatar.cc/150?u=1"
  },
  attendees: [
    { id: "1", name: "Carlos Oliveira", imageUrl: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Ana Silva", imageUrl: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Marcos Pereira", imageUrl: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Julia Santos", imageUrl: "https://i.pravatar.cc/150?u=4" },
    { id: "5", name: "Roberto Alves", imageUrl: "https://i.pravatar.cc/150?u=5" },
    { id: "6", name: "Fernanda Lima", imageUrl: "https://i.pravatar.cc/150?u=6" },
    { id: "7", name: "Gustavo Mendes", imageUrl: "https://i.pravatar.cc/150?u=7" },
    { id: "8", name: "Carolina Costa", imageUrl: "https://i.pravatar.cc/150?u=8" },
  ],
  type: "public" as const,
  groupId: null,
  groupName: null,
  estimatedBudget: 400,
  offers: [
    { id: "1", title: "15% OFF na primeira rodada", businessName: "Bar do Zé", imageUrl: "https://i.pravatar.cc/150?u=business1" },
    { id: "2", title: "Porção de batata frita grátis", businessName: "Bar do Zé", imageUrl: "https://i.pravatar.cc/150?u=business2" },
  ],
  comments: [
    {
      id: "1",
      userId: "2",
      userName: "Ana Silva",
      userAvatar: "https://i.pravatar.cc/150?u=2",
      content: "Estou ansiosa para este evento! Alguém sabe se é possível reservar mesa?",
      timestamp: "2025-04-12T12:30:00Z"
    },
    {
      id: "2",
      userId: "1",
      userName: "Carlos Oliveira",
      userAvatar: "https://i.pravatar.cc/150?u=1",
      content: "Sim, já fiz a reserva para 8 pessoas. Cheguem no horário!",
      timestamp: "2025-04-12T13:15:00Z"
    }
  ],
  gallery: [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1557&q=80",
      userId: "1",
      userName: "Carlos Oliveira",
      timestamp: "2025-04-11T14:30:00Z"
    }
  ]
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(MOCK_EVENT);
  const { toast } = useToast();
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventData, setEditEventData] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    address: event.address,
    date: "2025-04-08",
    startTime: "19:00",
    endTime: "23:00",
    type: event.type,
    includeEstimatedBudget: event.estimatedBudget ? true : false,
    estimatedBudget: event.estimatedBudget ? event.estimatedBudget.toString() : "",
  });
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleConfirm = () => {
    toast({
      title: "Presença confirmada",
      description: "Você confirmou presença neste evento"
    });
  };
  
  const handleDecline = () => {
    toast({
      title: "Presença cancelada",
      description: "Você recusou este evento"
    });
  };

  const handleEditEventDataChange = (changes: Partial<typeof editEventData>) => {
    setEditEventData(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSaveEditedEvent = () => {
    const formattedDate = "Sexta-feira, 8 de Abril";
    setEvent(prev => ({
      ...prev,
      title: editEventData.title,
      description: editEventData.description,
      location: editEventData.location,
      address: editEventData.address,
      fullDate: `${formattedDate} • ${editEventData.startTime} - ${editEventData.endTime}`,
      type: editEventData.type,
      estimatedBudget: editEventData.includeEstimatedBudget ? parseFloat(editEventData.estimatedBudget) : null,
    }));
    
    setEditDialogOpen(false);
    
    toast({
      title: "Evento atualizado",
      description: "As alterações no evento foram salvas com sucesso",
    });
  };

  const isEventHost = event.host.id === "1";

  const confirmedAttendees = event.attendees.filter(attendee => 
    event.id === "1" || Math.random() > 0.3);
  
  const pendingAttendees = event.attendees.filter(attendee => 
    event.id === "2" || (Math.random() > 0.7 && Math.random() < 0.9));
  
  const cancelledAttendees = event.attendees.filter(attendee => 
    event.id === "3" || Math.random() < 0.2);
  
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
  };

  const renderCostCalculator = event.type !== "public" && event.type !== "group";

  return (
    <MainLayout showBack onBack={handleBack} title={event.title}>
      <EventHeader
        id={event.id}
        title={event.title}
        imageUrl={event.imageUrl}
        type={event.type}
        groupName={event.groupName}
        host={event.host}
        isEventHost={isEventHost}
        onEditClick={() => setEditDialogOpen(true)}
      />
      
      <div className="p-4">
        <EventInfo
          fullDate={event.fullDate}
          location={event.location}
          address={event.address}
          attendeesCount={event.attendees.length}
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
        
        {event.estimatedBudget && (
          <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
            <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Orçamento do Evento</h2>
            <div className="bg-muted dark:bg-[#262626] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="dark:text-[#EDEDED]">Orçamento estimado:</span>
                <span className="font-bold dark:text-[#EDEDED]">{formatCurrency(event.estimatedBudget)}</span>
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
        />
        
        {renderCostCalculator && (
          <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
            <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Calculadora de Custos</h2>
            <EventCostCalculator attendeesCount={event.attendees.length} />
          </div>
        )}
        
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Discussão</h2>
          <EventDiscussion 
            eventId={event.id} 
            initialComments={event.comments} 
          />
        </div>
        
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Galeria</h2>
          <EventGallery 
            eventId={event.id}
            initialImages={event.gallery}
          />
        </div>
        
        {event.offers.length > 0 && (
          <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
            <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Ofertas especiais</h2>
            <div className="space-y-3">
              {event.offers.map((offer) => (
                <div key={offer.id} className="bg-muted dark:bg-[#262626] rounded-xl p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.businessName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium dark:text-[#EDEDED]">{offer.title}</div>
                    <div className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{offer.businessName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
