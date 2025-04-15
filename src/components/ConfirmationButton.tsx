import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EventQueriesService } from "@/services/event/queries";
import { ParticipantManagementService } from "@/services/event/participant-management.service";
import { supabase } from "@/integrations/supabase/client";

interface ConfirmationButtonProps {
  onConfirm: () => void;
  onDecline: () => void;
  eventId: string;
}

const ConfirmationButton = ({
  onConfirm,
  onDecline,
  eventId,
}: ConfirmationButtonProps) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialStatus = async () => {
      if (!user || !eventId) return;
      
      try {
        const { data: event } = await EventQueriesService.getEventById(eventId);
        
        if (event) {
          const { data: confirmations } = await supabase
            .from('event_confirmations')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (confirmations) {
            setConfirmed(confirmations.status === 'confirmed' ? true : 
                        confirmations.status === 'declined' ? false : null);
          }
        }
      } catch (error) {
        console.error("Error checking confirmation status:", error);
      }
    };
    
    checkInitialStatus();
  }, [user, eventId]);

  const handleAuthRequired = () => {
    toast({
      title: "Atenção",
      description: "Faça login para participar deste evento",
      variant: "destructive",
    });
    navigate("/auth");
  };

  const handleConfirm = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setLoading(true);
    try {
      const result = await ParticipantManagementService.joinEvent(eventId, 'confirmed');
      
      if (result.error) {
        toast({
          title: "Erro",
          description: "Erro ao confirmar presença",
          variant: "destructive",
        });
        return;
      }
      
      setConfirmed(true);
      toast({
        title: "Sucesso",
        description: "Presença confirmada!",
      });
      onConfirm();
      window.location.reload();
    } catch (error) {
      console.error("Error confirming event:", error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar presença",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setLoading(true);
    try {
      const result = await ParticipantManagementService.joinEvent(eventId, 'declined');
      
      if (result.error) {
        toast({
          title: "Erro",
          description: "Erro ao cancelar presença",
          variant: "destructive",
        });
        return;
      }
      
      setConfirmed(false);
      toast({
        title: "Sucesso",
        description: "Presença cancelada",
      });
      onDecline();
      window.location.reload();
    } catch (error) {
      console.error("Error declining event:", error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar presença",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 my-4 justify-center">
      <button
        onClick={handleDecline}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full transition-all ${
          confirmed === false
            ? "bg-destructive text-white"
            : "border-2 border-destructive text-destructive hover:bg-destructive/10"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <X size={18} />
        <span className="font-semibold">Furei</span>
      </button>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full transition-all ${
          confirmed === true
            ? "bg-green-500 text-white"
            : "border-2 border-green-500 text-green-700 hover:bg-green-50"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Check size={18} />
        <span className="font-semibold">Eu vou!</span>
      </button>
    </div>
  );
};

export default ConfirmationButton;
