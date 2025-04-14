
import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  Users,
  Info,
  Link as LinkIcon
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "../components/MainLayout";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [eventId] = useState(uuidv4().substring(0, 6).toUpperCase());
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
    isPublic: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggle = () => {
    setEventData(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
      toast({
        title: "Informações incompletas",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Creating event:", eventData);
    toast({
      title: "Evento criado com sucesso!",
      description: "Seu evento foi criado e já está disponível.",
    });
    navigate("/");
  };
  
  return (
    <MainLayout showBack onBack={handleBack} title="Criar Evento">
      <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div 
              className="w-full h-48 bg-muted rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              {eventData.imagePreview ? (
                <img 
                  src={eventData.imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Adicionar imagem de capa</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <Input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Nome do evento"
            className="w-full text-2xl font-bold mb-4 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
            required
          />
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center border border-border rounded-xl p-3">
            <CalendarIcon size={18} className="text-primary mr-3" />
            <Input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="bg-transparent flex-1 border-none focus:outline-none focus:ring-0 p-0"
              required
            />
          </div>
          
          <div className="flex items-center border border-border rounded-xl p-3">
            <Clock size={18} className="text-primary mr-3" />
            <Input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="bg-transparent flex-1 border-none focus:outline-none focus:ring-0 p-0"
              required
            />
          </div>
          
          <div className="flex items-center border border-border rounded-xl p-3">
            <MapPin size={18} className="text-primary mr-3" />
            <Input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder="Localização"
              className="bg-transparent flex-1 border-none focus:outline-none focus:ring-0 p-0"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block font-medium mb-2">Descrição</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Sobre o evento..."
            className="w-full min-h-[120px] rounded-xl border border-border p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center justify-between">
            <div className="flex items-center">
              <Users size={18} className="text-primary mr-2" />
              <span>Evento público</span>
            </div>
            <div 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                eventData.isPublic ? "bg-primary" : "bg-muted"
              }`}
              onClick={handleToggle}
            >
              <div 
                className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${
                  eventData.isPublic ? "translate-x-6" : "translate-x-0.5"
                }`} 
              />
            </div>
          </label>
          <p className="text-sm text-muted-foreground mt-1 flex items-start">
            <Info size={14} className="mr-1 mt-0.5" />
            Eventos públicos podem ser descobertos por qualquer pessoa no Furou?!
          </p>
        </div>

        <div className="mb-6 bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center">
            <LinkIcon size={16} className="text-primary mr-2" />
            <span className="text-sm">ID do evento: <strong>{eventId}</strong></span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Este ID pode ser usado para convidar pessoas para o seu evento
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full md:w-auto md:min-w-[200px] md:mx-auto md:block"
        >
          Criar Evento
        </Button>
      </form>
    </MainLayout>
  );
};

export default CreateEvent;
