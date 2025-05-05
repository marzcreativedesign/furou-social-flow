
import { Users, UserX } from "lucide-react";
import type { EventParticipant } from "@/types/event";

interface EventAttendeesCountProps {
  participants: EventParticipant[];
}

const EventAttendeesCount = ({ participants }: EventAttendeesCountProps) => {
  // Verificar se participants existe antes de filtrar
  if (!participants || !Array.isArray(participants)) {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <Users size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
          <span className="dark:text-[#EDEDED]">0 confirmados</span>
        </div>
      </div>
    );
  }

  const confirmedCount = participants.filter(p => p.status === 'confirmed').length;
  const declinedCount = participants.filter(p => p.status === 'declined').length;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Users size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
        <span className="dark:text-[#EDEDED]">{confirmedCount} confirmados</span>
      </div>
      
      {declinedCount > 0 && (
        <div className="flex items-center">
          <UserX size={18} className="text-destructive mr-3 flex-shrink-0" />
          <span className="text-destructive">{declinedCount} recusaram</span>
        </div>
      )}
    </div>
  );
};

export default EventAttendeesCount;
