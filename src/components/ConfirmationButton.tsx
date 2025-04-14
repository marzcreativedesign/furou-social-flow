
import { useState } from "react";
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
  initialState = null,
  eventId,
}: ConfirmationButtonProps) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(initialState);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
      const { error } = await EventsService.updateParticipationStatus(eventId, 'confirmed');
      
      if (error) {
        console.error("Error confirming event:", error);
        toast.error("Erro ao confirmar presença");
        return;
      }
      
      setConfirmed(true);
      toast.success("Presença confirmada!");
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
      const { error } = await EventsService.updateParticipationStatus(eventId, 'declined');
      
      if (error) {
        console.error("Error declining event:", error);
        toast.error("Erro ao cancelar presença");
        return;
      }
      
      setConfirmed(false);
      toast.success("Presença cancelada");
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
