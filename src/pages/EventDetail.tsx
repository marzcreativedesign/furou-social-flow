
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Share2, 
  MessageCircle, 
  DollarSign,
  Image
} from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ConfirmationButton from "../components/ConfirmationButton";

const MOCK_EVENT = {
  id: "1",
  title: "Happy Hour no Bar do Zé",
  date: "Hoje, 19:00",
  fullDate: "Sexta-feira, 8 de Abril • 19:00 - 23:00",
  location: "Bar do Zé",
  address: "Rua Augusta, 1492, São Paulo",
  description: "Vamos nos encontrar para tomar umas cervejas e conversar! Primeira rodada por minha conta.",
  imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  host: "Carlos Oliveira",
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
  totalContribution: 200,
  targetContribution: 400,
  offers: [
    { id: "1", title: "15% OFF na primeira rodada", businessName: "Bar do Zé", imageUrl: "https://i.pravatar.cc/150?u=business1" },
    { id: "2", title: "Porção de batata frita grátis", businessName: "Bar do Zé", imageUrl: "https://i.pravatar.cc/150?u=business2" },
  ],
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event] = useState(MOCK_EVENT);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleConfirm = () => {
    console.log("Confirmed attendance");
  };
  
  const handleDecline = () => {
    console.log("Declined attendance");
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
        
        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
          <Share2 size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        
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
        
        <h2 className="font-bold mb-2">Você vai?</h2>
        <ConfirmationButton 
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        />
        
        <div className="border-t pt-4 mt-6">
          <h2 className="font-bold mb-3">Quem vai</h2>
          <div className="flex flex-wrap gap-2">
            {event.attendees.map((attendee) => (
              <div 
                key={attendee.id} 
                className="w-10 h-10 rounded-full overflow-hidden"
                title={attendee.name}
              >
                <img 
                  src={attendee.imageUrl} 
                  alt={attendee.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
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
            <button className="btn-secondary w-full flex items-center justify-center">
              <DollarSign size={18} className="mr-2" />
              Contribuir
            </button>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-6">
          <h2 className="font-bold mb-3">Discussão</h2>
          <button className="border border-border rounded-xl p-3 w-full flex items-center text-muted-foreground">
            <MessageCircle size={18} className="mr-2" />
            <span>Escrever uma mensagem...</span>
          </button>
        </div>
        
        <div className="border-t pt-4 mt-6">
          <h2 className="font-bold mb-3">Galeria</h2>
          <button className="border border-border rounded-xl p-3 w-full flex items-center justify-center text-primary">
            <Image size={18} className="mr-2" />
            <span>Adicionar fotos</span>
          </button>
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
