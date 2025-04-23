
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotificationsService } from "@/services/notifications.service";
import { GroupsService } from "@/services/groups.service"; 
import { EventsService } from "@/services/events.service";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from "react-router-dom";

interface PendingAction {
  id: string;
  title: string;
  content: string;
  eventName?: string;
  imageUrl?: string;
  created_at: string;
  related_id: string | null;
  type: string;
}

interface PendingActionsProps {
  actions: PendingAction[];
  onActionComplete: (id: string) => void;
}

const PendingActions = ({ actions, onActionComplete }: PendingActionsProps) => {
  const navigate = useNavigate();

  const handleAcceptAction = async (id: string, relatedId: string | null, type: string) => {
    try {
      // Primeiro, marcar a notificação como lida para evitar duplicações
      await NotificationsService.markAsRead(id);
      
      // Realizar ação específica dependendo do tipo de notificação
      if (type === 'event_invite' && relatedId) {
        // Aceitar convite para evento
        await EventsService.joinEvent(relatedId);
        toast.success("Você aceitou participar do evento!");
        navigate(`/evento/${relatedId}`);
      } else if (type === 'group_invite' && relatedId) {
        // Aceitar convite para grupo
        const { error } = await GroupsService.addMemberToGroup(relatedId, 
          (await supabase.auth.getUser()).data.user?.id || '', false);
          
        if (error) {
          throw error;
        }
        
        toast.success("Você aceitou participar do grupo!");
        navigate(`/grupo/${relatedId}`);
      } else {
        toast.success("Ação aceita com sucesso");
      }
      
      onActionComplete(id);
    } catch (error) {
      console.error("Error accepting action:", error);
      toast.error("Erro ao aceitar ação");
    }
  };

  const handleRejectAction = async (id: string) => {
    try {
      await NotificationsService.markAsRead(id);
      onActionComplete(id);
      toast.success("Ação rejeitada");
    } catch (error) {
      console.error("Error rejecting action:", error);
      toast.error("Erro ao rejeitar ação");
    }
  };

  if (actions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Ações Pendentes</h2>
      <div className="space-y-3">
        {actions.map(action => (
          <div key={action.id} className="bg-accent/10 dark:bg-[#FF6B00]/20 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={action.imageUrl} alt={action.eventName || action.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium dark:text-[#EDEDED]">{action.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{action.content}</p>
                <span className="text-xs text-muted-foreground dark:text-[#B3B3B3]">
                  {new Date(action.created_at).toLocaleString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full w-9 h-9 p-0 dark:border-[#2C2C2C] dark:bg-[#262626] dark:hover:bg-[#2C2C2C] dark:text-[#EDEDED]" 
                onClick={() => handleRejectAction(action.id)}
              >
                <X size={16} />
              </Button>
              <Button 
                size="sm" 
                className="rounded-full w-9 h-9 p-0 dark:bg-primary dark:hover:bg-accent" 
                onClick={() => handleAcceptAction(action.id, action.related_id, action.type)}
              >
                <Check size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingActions;
