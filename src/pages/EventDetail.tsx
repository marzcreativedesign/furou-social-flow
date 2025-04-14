
import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  DollarSign,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Edit2,
  Copy,
  Info,
  Tag,
  AlertCircle
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import ConfirmationButton from "../components/ConfirmationButton";
import EventShareButton from "../components/EventShareButton";
import EventMapButton from "../components/EventMapButton";
import { useToast } from "../hooks/use-toast";
import EventTag from "../components/EventTag";
import EventDiscussion from "../components/EventDiscussion";
import EventGallery from "../components/EventGallery";
import EventCostCalculator from "../components/EventCostCalculator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

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
  type: "public", // public, private, group
  groupId: null,
  groupName: null,
  estimatedBudget: 400, // Novo campo para orçamento estimado
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
    date: "2025-04-08", // Would be extracted from event.fullDate in a real app
    startTime: "19:00", // Would be extracted from event.fullDate in a real app
    endTime: "23:00", // Would be extracted from event.fullDate in a real app
    type: event.type,
    includeEstimatedBudget: event.estimatedBudget ? true : false,
    estimatedBudget: event.estimatedBudget ? event.estimatedBudget.toString() : "",
  });
  
  const visibleAttendees = showAllAttendees 
    ? event.attendees 
    : event.attendees.slice(0, 6);

  const confirmedAttendees = event.attendees.filter(attendee => 
    event.id === "1" || Math.random() > 0.3);
  
  const pendingAttendees = event.attendees.filter(attendee => 
    event.id === "2" || (Math.random() > 0.7 && Math.random() < 0.9));
  
  const cancelledAttendees = event.attendees.filter(attendee => 
    event.id === "3" || Math.random() < 0.2);
  
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
  
  const handleCopyEventId = () => {
    navigator.clipboard.writeText(event.id).then(() => {
      toast({
        title: "ID copiado!",
        description: "O ID do evento foi copiado para sua área de transferência"
      });
    });
  };

  const eventUrl = `${window.location.origin}/evento/${id}`;

  const handleEditEvent = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEditedEvent = () => {
    // Format the date and times back into a display format
    const formattedDate = "Sexta-feira, 8 de Abril"; // This would be properly formatted from editEventData.date in a real app
    
    setEvent(prev => ({
      ...prev,
      title: editEventData.title,
      description: editEventData.description,
      location: editEventData.location,
      address: editEventData.address,
      fullDate: `${formattedDate} • ${editEventData.startTime} - ${editEventData.endTime}`,
      type: editEventData.type as "public" | "private" | "group",
      estimatedBudget: editEventData.includeEstimatedBudget ? parseFloat(editEventData.estimatedBudget) : null,
    }));
    
    setEditDialogOpen(false);
    
    toast({
      title: "Evento atualizado",
      description: "As alterações no evento foram salvas com sucesso",
    });
  };

  const handleEditEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditEventData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
  };

  // Check if current user is the event host (for edit button display)
  const isEventHost = event.host.id === "1"; // In a real app, this would compare with the authenticated user ID
  
  return (
    <MainLayout showBack onBack={handleBack} title={event.title}>
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
          <EventTag 
            type={event.type as "public" | "private" | "group"} 
            label={event.type === "public" ? "Público" : event.type === "private" ? "Privado" : "Grupo"} 
          />
          {event.groupName && (
            <EventTag type="group" label={event.groupName} />
          )}
        </div>

        {/* Event actions menu (edit, share, etc.) */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isEventHost && (
            <Button 
              onClick={handleEditEvent}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full dark:bg-card/80"
              size="icon"
              variant="ghost"
            >
              <Edit2 size={20} className="text-foreground" />
            </Button>
          )}
          
          <EventShareButton 
            eventId={event.id}
            eventTitle={event.title}
            eventUrl={eventUrl}
            variant="prominent"
            size="icon"
            showText={false}
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold">{event.title}</h1>
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
                  <span className="text-xs font-medium text-[#FF8A1E]">ID: {event.id}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Clique para copiar o ID</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center mb-4">
          <Link to={`/usuario/${event.host.id}`}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={event.host.imageUrl} alt={event.host.name} />
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                {event.host.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link 
              to={`/usuario/${event.host.id}`} 
              className="text-sm font-medium hover:underline dark:text-[#EDEDED]"
            >
              {event.host.name}
            </Link>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Organizador</p>
          </div>
          
          <div className="ml-auto">
            <EventShareButton
              eventId={event.id}
              eventTitle={event.title}
              eventUrl={eventUrl}
              variant="secondary"
              size="sm"
            />
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Calendar size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
            <span className="dark:text-[#EDEDED]">{event.fullDate}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="dark:text-[#EDEDED]">{event.location}</div>
                <div className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{event.address}</div>
              </div>
              <EventMapButton 
                address={event.address} 
                location={event.location}
                variant="outline"
                size="sm"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <Users size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
            <span className="dark:text-[#EDEDED]">{event.attendees.length} confirmados</span>
          </div>
        </div>
        
        <div className="border-t border-b py-4 my-4 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-2 dark:text-[#EDEDED]">Sobre</h2>
          <p className="text-muted-foreground dark:text-[#B3B3B3]">{event.description}</p>
        </div>
        
        <div className="bg-muted dark:bg-[#262626] p-4 rounded-xl mb-6">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Você vai?</h2>
          <ConfirmationButton 
            onConfirm={handleConfirm}
            onDecline={handleDecline}
          />
        </div>
        
        {/* Seção de orçamento estimado (substitui a vaquinha) */}
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
        
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Quem vai</h2>
          
          <div className="space-y-4">
            {confirmedAttendees.length > 0 && (
              <div>
                <h3 className="text-sm font-medium flex items-center mb-2 dark:text-[#EDEDED]">
                  <span className="h-3 w-3 rounded-full bg-green-500 dark:bg-[#4CAF50] mr-2"></span>
                  Confirmados ({confirmedAttendees.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {confirmedAttendees.slice(0, showAllAttendees ? undefined : 6).map(attendee => (
                    <Link 
                      key={attendee.id}
                      to={`/usuario/${attendee.id}`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 dark:border-[#4CAF50]"
                        title={attendee.name}
                      >
                        <img 
                          src={attendee.imageUrl} 
                          alt={attendee.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pendingAttendees.length > 0 && (
              <div>
                <h3 className="text-sm font-medium flex items-center mb-2 dark:text-[#EDEDED]">
                  <span className="h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-500 mr-2"></span>
                  Pendentes ({pendingAttendees.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pendingAttendees.slice(0, showAllAttendees ? undefined : 6).map(attendee => (
                    <Link 
                      key={attendee.id}
                      to={`/usuario/${attendee.id}`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500"
                        title={attendee.name}
                      >
                        <img 
                          src={attendee.imageUrl} 
                          alt={attendee.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {cancelledAttendees.length > 0 && (
              <div>
                <h3 className="text-sm font-medium flex items-center mb-2 dark:text-[#EDEDED]">
                  <span className="h-3 w-3 rounded-full bg-red-500 dark:bg-[#FF4C4C] mr-2"></span>
                  Furaram ({cancelledAttendees.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cancelledAttendees.slice(0, showAllAttendees ? undefined : 6).map(attendee => (
                    <Link 
                      key={attendee.id}
                      to={`/usuario/${attendee.id}`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 dark:border-[#FF4C4C]"
                        title={attendee.name}
                      >
                        <img 
                          src={attendee.imageUrl} 
                          alt={attendee.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {event.attendees.length > 6 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllAttendees(!showAllAttendees)}
              className="text-[#FF8A1E] dark:text-[#FF8A1E] flex gap-1 items-center mt-2"
            >
              {showAllAttendees ? (
                <>Ver menos <ChevronUp size={16} /></>
              ) : (
                <>Ver todos ({event.attendees.length}) <ChevronDown size={16} /></>
              )}
            </Button>
          )}
        </div>
        
        {event.type === "private" && (
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

      {/* Edit Event Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="dark:bg-card dark:border-[#2C2C2C]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#EDEDED]">Editar Evento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="dark:text-[#EDEDED]">Título</Label>
              <Input 
                id="title" 
                name="title"
                value={editEventData.title}
                onChange={handleEditEventInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="dark:text-[#EDEDED]">Descrição</Label>
              <textarea 
                id="description" 
                name="description"
                value={editEventData.description}
                onChange={handleEditEventInputChange}
                rows={3}
                className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="dark:text-[#EDEDED]">Data</Label>
                <Input 
                  id="date" 
                  name="date"
                  type="date"
                  value={editEventData.date}
                  onChange={handleEditEventInputChange}
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="startTime" className="dark:text-[#EDEDED]">Hora de início</Label>
                <Input 
                  id="startTime" 
                  name="startTime"
                  type="time"
                  value={editEventData.startTime}
                  onChange={handleEditEventInputChange}
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endTime" className="dark:text-[#EDEDED]">Hora de término</Label>
                <Input 
                  id="endTime" 
                  name="endTime"
                  type="time"
                  value={editEventData.endTime}
                  onChange={handleEditEventInputChange}
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="dark:text-[#EDEDED]">Tipo de evento</Label>
                <RadioGroup
                  name="type"
                  value={editEventData.type}
                  onValueChange={(value) => setEditEventData({ ...editEventData, type: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="public" value="public" className="dark:border-[#2C2C2C]" />
                    <Label htmlFor="public" className="dark:text-[#EDEDED]">Público</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="private" value="private" className="dark:border-[#2C2C2C]" />
                    <Label htmlFor="private" className="dark:text-[#EDEDED]">Privado</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location" className="dark:text-[#EDEDED]">Local</Label>
              <Input 
                id="location" 
                name="location"
                value={editEventData.location}
                onChange={handleEditEventInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address" className="dark:text-[#EDEDED]">Endereço</Label>
              <Input 
                id="address" 
                name="address"
                value={editEventData.address}
                onChange={handleEditEventInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
            
            {/* Campo para orçamento estimado */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="includeEstimatedBudget"
                checked={editEventData.includeEstimatedBudget}
                onCheckedChange={(checked) => {
                  setEditEventData(prev => ({
                    ...prev,
                    includeEstimatedBudget: checked === true
                  }));
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="includeEstimatedBudget"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir orçamento estimado para o evento
                </Label>
              </div>
            </div>
            
            {editEventData.includeEstimatedBudget && (
              <div className="grid gap-2">
                <Label htmlFor="estimatedBudget" className="dark:text-[#EDEDED]">
                  Valor do orçamento estimado
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input 
                    id="estimatedBudget" 
                    name="estimatedBudget"
                    type="text"
                    value={editEventData.estimatedBudget}
                    onChange={(e) => {
                      // Allow only numbers and dot
                      const value = e.target.value.replace(/[^\d.,]/g, '');
                      setEditEventData(prev => ({
                        ...prev,
                        estimatedBudget: value
                      }));
                    }}
                    placeholder="500,00"
                    className="pl-9 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEditedEvent}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EventDetail;
