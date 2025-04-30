import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { StorageService } from "@/services/storage.service";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "19:00",
    endTime: "22:00",
    type: "public" as "public" | "private",
    includeEstimatedBudget: false,
    estimatedBudget: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const handleTypeChange = (value: "public" | "private") => {
    setEventData((prev) => ({
      ...prev,
      type: value
    }));
  };
  
  const handleCheckboxChange = () => {
    setEventData((prev) => ({
      ...prev,
      includeEstimatedBudget: !prev.includeEstimatedBudget,
      estimatedBudget: !prev.includeEstimatedBudget ? prev.estimatedBudget : ""
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um evento",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format date and time
      const eventDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      
      // Upload image if selected
      let imageUrl = null;
      if (imageFile) {
        const uploadResult = await StorageService.uploadEventImage(imageFile);
        if (uploadResult.error) throw new Error("Falha ao enviar imagem");
        imageUrl = uploadResult.publicUrl;
      }
      
      // Create event
      const eventDataToSend = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        address: eventData.address,
        date: eventDateTime.toISOString(),
        is_public: eventData.type === "public",
        creator_id: user.id,
        image_url: imageUrl,
        estimated_budget: eventData.includeEstimatedBudget ? parseFloat(eventData.estimatedBudget) : null
      };
      
      const { data: createdEvent, error } = await EventsService.createEvent(eventDataToSend);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Seu evento foi criado com sucesso",
      });
      
      // Navigate to event page
      if (createdEvent && createdEvent.id) {
        navigate(`/evento/${createdEvent.id}`);
      } else {
        navigate("/eventos");
      }
      
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar evento",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout title="Criar Evento" showBack onBack={handleBack}>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Evento</Label>
            <Input
              id="title"
              name="title"
              placeholder="Insira um título para seu evento"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva seu evento"
              value={eventData.description}
              onChange={handleChange}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              name="location"
              placeholder="Nome do local"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              placeholder="Endereço completo"
              value={eventData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={eventData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Término</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={eventData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="image">Imagem do evento</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Tipo de Evento</Label>
            <RadioGroup value={eventData.type} onValueChange={handleTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Público - Qualquer pessoa pode ver e participar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Privado - Apenas convidados podem participar</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="estimatedBudget" 
                checked={eventData.includeEstimatedBudget} 
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="estimatedBudget"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Incluir orçamento estimado
              </label>
            </div>
            
            {eventData.includeEstimatedBudget && (
              <div>
                <Label htmlFor="budgetAmount">Valor estimado (R$)</Label>
                <Input
                  id="budgetAmount"
                  name="estimatedBudget"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={eventData.estimatedBudget}
                  onChange={handleChange}
                  required={eventData.includeEstimatedBudget}
                />
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Evento"}
        </Button>
      </form>
    </MainLayout>
  );
};

export default CreateEvent;
