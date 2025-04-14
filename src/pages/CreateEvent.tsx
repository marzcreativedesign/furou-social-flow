
import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  Users,
  Info,
  Link as LinkIcon,
  DollarSign
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MainLayout from "../components/MainLayout";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast: toastUI } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [eventId] = useState(uuidv4().substring(0, 6).toUpperCase());
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
    isPublic: false,
    includeEstimatedBudget: false,
    estimatedBudget: ""
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
      toastUI({
        title: "Informações incompletas",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar orçamento se incluído
    if (eventData.includeEstimatedBudget && !eventData.estimatedBudget) {
      toastUI({
        title: "Orçamento inválido",
        description: "Por favor insira um valor para o orçamento estimado ou desmarque a opção.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      // Combine date and time into an ISO date string
      const dateTimeStr = `${eventData.date}T${eventData.time}`;
      const dateTime = new Date(dateTimeStr);
      const isoDateTime = dateTime.toISOString();
      
      // In a real app, we'd upload the image first to storage and then get the URL
      // For simplicity, we'll use a placeholder if no image is selected
      const imageUrl = eventData.imagePreview || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3";
      
      // Parse estimated budget if included
      let estimatedBudget = null;
      if (eventData.includeEstimatedBudget && eventData.estimatedBudget) {
        // Remove non-numeric characters except decimal point
        const numericValue = eventData.estimatedBudget.replace(/[^\d.,]/g, '').replace(',', '.');
        estimatedBudget = parseFloat(numericValue);
      }
      
      // Create the event
      const { data, error } = await EventsService.createEvent({
        title: eventData.title,
        description: eventData.description,
        date: isoDateTime,
        location: eventData.location,
        is_public: eventData.isPublic,
        image_url: imageUrl,
        estimated_budget: estimatedBudget
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Evento criado com sucesso!");
      
      // Redirect to the event page
      if (data && data.length > 0) {
        navigate(`/evento/${data[0].id}`);
      } else {
        // Fallback to events list if we don't have the event ID
        navigate("/eventos");
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toastUI({
        title: "Erro ao criar evento",
        description: error.message || "Ocorreu um erro ao criar o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
        
        {/* Seção de orçamento estimado */}
        <div className="mb-6">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="includeEstimatedBudget"
              checked={eventData.includeEstimatedBudget}
              onCheckedChange={(checked) => {
                setEventData(prev => ({
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
              <p className="text-sm text-muted-foreground">
                Defina um valor aproximado para os custos do evento
              </p>
            </div>
          </div>
          
          {eventData.includeEstimatedBudget && (
            <div className="mt-4">
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  name="estimatedBudget"
                  value={eventData.estimatedBudget}
                  onChange={(e) => {
                    // Permitir apenas números e pontos/vírgulas
                    const value = e.target.value.replace(/[^\d.,]/g, '');
                    setEventData(prev => ({
                      ...prev,
                      estimatedBudget: value
                    }));
                  }}
                  placeholder="R$ 500,00"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                <Info size={12} className="flex-shrink-0 mt-0.5" />
                Este valor é apenas uma estimativa e será exibido para os participantes.
              </p>
            </div>
          )}
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
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
              Criando...
            </span>
          ) : (
            "Criar Evento"
          )}
        </Button>
      </form>
    </MainLayout>
  );
};

export default CreateEvent;
