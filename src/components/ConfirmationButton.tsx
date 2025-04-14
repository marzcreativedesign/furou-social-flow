
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ConfirmationButtonProps {
  onConfirm: () => void;
  onDecline: () => void;
  initialState?: boolean | null;
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

  useEffect(() => {
    // Check the initial status when the component mounts
    const checkInitialStatus = async () => {
      if (!user || !eventId) return;
      
      try {
        const { data, error } = await EventsService.getEventById(eventId);
        
        if (error) {
          console.error("Error getting event:", error);
          return;
        }
        
        if (data?.event_participants) {
          const userParticipation = data.event_participants.find(
            (p) => p.user_id === user.id
          );
          
          if (userParticipation) {
            setConfirmed(userParticipation.status === 'confirmed' ? true : 
                        userParticipation.status === 'declined' ? false : null);
          }
        }
      } catch (error) {
        console.error("Error checking participant status:", error);
      }
    };
    
    checkInitialStatus();
  }, [user, eventId]);

  const handleAuthRequired = () => {
    toast.error("Faça login para participar deste evento");
    navigate("/auth");
  };

  const handleConfirm = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setLoading(true);
    try {
      let result;
      if (confirmed === true) {
        // User is already confirmed, do nothing
        setLoading(false);
        return;
      } else if (confirmed === null) {
        // User has not responded yet, join the event
        result = await EventsService.joinEvent(eventId);
      } else {
        // User previously declined, update to confirmed
        result = await EventsService.updateParticipationStatus(eventId, 'confirmed');
      }
      
      if (result.error) {
        console.error("Error confirming event:", result.error);
        toast.error("Erro ao confirmar presença");
        return;
      }
      
      setConfirmed(true);
      toast.success("Presença confirmada!");
      // Reload the page to update participants lists
      window.location.reload();
      onConfirm();
    } catch (error) {
      console.error("Error confirming event:", error);
      toast.error("Erro ao confirmar presença");
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
      let result;
      if (confirmed === false) {
        // User is already declined, do nothing
        setLoading(false);
        return;
      } else if (confirmed === null) {
        // User has not responded yet, join with declined status
        result = await EventsService.joinEvent(eventId);
        if (!result.error) {
          result = await EventsService.updateParticipationStatus(eventId, 'declined');
        }
      } else {
        // User previously confirmed, update to declined
        result = await EventsService.updateParticipationStatus(eventId, 'declined');
      }
      
      if (result.error) {
        console.error("Error declining event:", result.error);
        toast.error("Erro ao cancelar presença");
        return;
      }
      
      setConfirmed(false);
      toast.success("Presença cancelada");
      // Reload the page to update participants lists
      window.location.reload();
      onDecline();
    } catch (error) {
      console.error("Error declining event:", error);
      toast.error("Erro ao cancelar presença");
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
