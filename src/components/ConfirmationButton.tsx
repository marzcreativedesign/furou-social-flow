
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
        // Query the event_participants table directly with the new status field
        const { data: participant, error } = await supabase
          .from('event_participants')
          .select('status')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (participant) {
          setConfirmed(participant.status === 'confirmed' ? true : 
                      participant.status === 'declined' ? false : null);
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
      // Use the direct table API with the new status field
      const { error } = await supabase
        .from('event_participants')
        .upsert(
          {
            event_id: eventId,
            user_id: user.id,
            status: 'confirmed'
          },
          {
            onConflict: 'event_id,user_id',
            ignoreDuplicates: false,
          }
        );
      
      if (error) throw error;
      
      setConfirmed(true);
      toast({
        title: "Sucesso",
        description: "Presença confirmada!",
      });
      onConfirm();
      window.location.reload(); // Refresh to see changes
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
      // Use the direct table API with the new status field
      const { error } = await supabase
        .from('event_participants')
        .upsert(
          {
            event_id: eventId,
            user_id: user.id,
            status: 'declined'
          },
          {
            onConflict: 'event_id,user_id',
            ignoreDuplicates: false,
          }
        );
      
      if (error) throw error;
      
      setConfirmed(false);
      toast({
        title: "Sucesso",
        description: "Presença cancelada",
      });
      onDecline();
      window.location.reload(); // Refresh to see changes
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
