
import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Share2, 
  MessageCircle, 
  DollarSign,
  Image as ImageIcon,
  Copy,
  Link as LinkIcon,
  Facebook,
  Mail,
  Twitter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ConfirmationButton from "../components/ConfirmationButton";
import { useToast } from "../hooks/use-toast";
import EventTag from "../components/EventTag";
import EventDiscussion from "../components/EventDiscussion";
import EventGallery from "../components/EventGallery";
import EventCostCalculator from "../components/EventCostCalculator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  totalContribution: 200,
  targetContribution: 400,
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
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  
  const visibleAttendees = showAllAttendees 
    ? event.attendees 
    : event.attendees.slice(0, 6);
  
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
  
  const handleShareLink = () => {
    // Create URL for sharing
    const eventURL = `${window.location.origin}/evento/${id}`;
    
    // Check if the browser supports the share API
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Junte-se a mim no evento: ${event.title}`,
        url: eventURL
      })
      .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(eventURL).then(() => {
        toast({
          title: "Link copiado!",
          description: "O link do evento foi copiado para sua área de transferência"
        });
      });
    }
  };
  
  const handleCopyLink = () => {
    const eventURL = `${window.location.origin}/evento/${id}`;
    navigator.clipboard.writeText(eventURL).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link do evento foi copiado para sua área de transferência"
      });
    });
  };
  
  const handleShareVia = (platform: string) => {
    const eventURL = `${window.location.origin}/evento/${id}`;
    let shareURL = '';
    
    switch (platform) {
      case 'facebook':
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventURL)}`;
        break;
      case 'twitter':
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Junte-se a mim no evento: ${event.title}`)}&url=${encodeURIComponent(eventURL)}`;
        break;
      case 'email':
        shareURL = `mailto:?subject=${encodeURIComponent(`Convite para: ${event.title}`)}&body=${encodeURIComponent(`Olá! Venha participar deste evento comigo: ${event.title}\n\n${eventURL}`)}`;
        break;
      default:
        break;
    }
    
    if (shareURL) {
      window.open(shareURL, '_blank');
    }
  };
  
  return (
    <div className="pb-20">
      <Header showBack onBack={handleBack} title={event.title} />
      
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
        
        <Button 
          onClick={handleShareLink}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
          size="icon"
          variant="ghost"
          ref={shareButtonRef}
        >
          <Share2 size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
              size="icon"
              variant="ghost"
            >
              <Share2 size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              <span>Copiar link</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShareVia('facebook')} className="cursor-pointer">
              <Facebook className="mr-2 h-4 w-4" />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShareVia('twitter')} className="cursor-pointer">
              <Twitter className="mr-2 h-4 w-4" />
              <span>Twitter</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShareVia('email')} className="cursor-pointer">
              <Mail className="mr-2 h-4 w-4" />
              <span>Email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        
        {/* Host info */}
        <div className="flex items-center mb-4">
          <Link to={`/usuario/${event.host.id}`}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={event.host.imageUrl} alt={event.host.name} />
              <AvatarFallback>{event.host.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link 
              to={`/usuario/${event.host.id}`} 
              className="text-sm font-medium hover:underline"
            >
              {event.host.name}
            </Link>
            <p className="text-xs text-muted-foreground">Organizador</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Calendar size={18} className="text-primary mr-3" />
            <span>{event.fullDate}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={18} className="text-primary mr-3" />
            <div>
              <div>{event.location}</div>
              <div className="text-sm text-muted-foreground">{event.address}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users size={18} className="text-primary mr-3" />
            <span>{event.attendees.length} confirmados</span>
          </div>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <h2 className="font-bold mb-2">Sobre</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        
        {/* RSVP Section - More Prominent */}
        <div className="bg-muted p-4 rounded-xl mb-6">
          <h2 className="font-bold mb-3">Você vai?</h2>
          <ConfirmationButton 
            onConfirm={handleConfirm}
            onDecline={handleDecline}
          />
        </div>
        
        <div className="border-t pt-4 mt-6">
          <h2 className="font-bold mb-3">Quem vai</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {visibleAttendees.map((attendee) => (
              <Link 
                key={attendee.id}
                to={`/usuario/${attendee.id}`}
              >
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden"
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
          
          {event.attendees.length > 6 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllAttendees(!showAllAttendees)}
              className="text-primary flex gap-1 items-center"
            >
              {showAllAttendees ? (
                <>Ver menos <ChevronUp size={16} /></>
              ) : (
                <>Ver todos ({event.attendees.length}) <ChevronDown size={16} /></>
              )}
            </Button>
          )}
        </div>
        
        {/* Add cost calculator for private events */}
        {event.type === "private" && (
          <div className="border-t pt-4 mt-6">
            <h2 className="font-bold mb-3">Calculadora de Custos</h2>
            <EventCostCalculator attendeesCount={event.attendees.length} />
          </div>
        )}
        
        {/* Vaquinha for public events */}
        {event.type === "public" && (
          <div className="border-t pt-4 mt-6">
            <h2 className="font-bold mb-3">Vaquinha</h2>
            <div className="bg-muted rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span>Meta: R$ {event.targetContribution.toFixed(2)}</span>
                <span className="font-bold">R$ {event.totalContribution.toFixed(2)}</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 mb-3">
                <div 
                  className="bg-secondary h-3 rounded-full"
                  style={{ width: `${(event.totalContribution / event.targetContribution) * 100}%` }}
                />
              </div>
              <Button className="w-full flex items-center justify-center">
                <DollarSign size={18} className="mr-2" />
                Contribuir
              </Button>
            </div>
          </div>
        )}
        
        {/* Tabs for Discussion and Gallery */}
        <div className="border-t pt-4 mt-6">
          <Tabs defaultValue="discussion">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discussion">Discussão</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussion" className="pt-4">
              <EventDiscussion 
                eventId={event.id} 
                initialComments={event.comments} 
              />
            </TabsContent>
            
            <TabsContent value="gallery" className="pt-4">
              <EventGallery 
                eventId={event.id}
                initialImages={event.gallery}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {event.offers.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <h2 className="font-bold mb-3">Ofertas especiais</h2>
            <div className="space-y-3">
              {event.offers.map((offer) => (
                <div key={offer.id} className="bg-muted rounded-xl p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.businessName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{offer.title}</div>
                    <div className="text-sm text-muted-foreground">{offer.businessName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default EventDetail;
