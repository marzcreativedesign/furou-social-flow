
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EventsService } from "@/services/events.service";
import type { EventData } from "@/types/event";
import { parseISO, format } from "date-fns";

export const useEventDetail = (id: string | undefined) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [editEventData, setEditEventData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "public" as "public" | "private",
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
          setEvent(data as unknown as EventData);
          
          // Parse date for edit form
          const eventDate = parseISO(data.date);
          const formattedDate = format(eventDate, 'yyyy-MM-dd');
          const startTime = format(eventDate, 'HH:mm');
          const endTime = format(new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), 'HH:mm');
          
          setEditEventData({
            title: data.title,
            description: data.description || "",
            location: data.location || "",
            address: data.address || "",
            date: formattedDate,
            startTime: startTime,
            endTime: endTime,
            type: data.is_public ? "public" : "private",
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

  return {
    loading,
    event,
    editEventData,
    setEditEventData
  };
};
