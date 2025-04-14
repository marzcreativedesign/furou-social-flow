
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  imageUrl: string;
}

interface EventParticipantsProps {
  confirmedAttendees: Participant[];
  pendingAttendees: Participant[];
  cancelledAttendees: Participant[];
  showAllAttendees: boolean;
  onToggleShowAll: () => void;
}

const EventParticipants = ({
  confirmedAttendees,
  pendingAttendees,
  cancelledAttendees,
  showAllAttendees,
  onToggleShowAll
}: EventParticipantsProps) => {
  const renderParticipantsList = (participants: Participant[], type: string, borderColor: string) => {
    const maxVisible = 5;
    const visibleParticipants = participants.slice(0, maxVisible);
    const overflow = participants.length - maxVisible;

    return (
      <div>
        <h3 className="text-sm font-medium flex items-center mb-2 dark:text-[#EDEDED]">
          <span className={`h-3 w-3 rounded-full mr-2`} style={{ backgroundColor: borderColor }}></span>
          {type} ({participants.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {visibleParticipants.map(attendee => (
            <Link 
              key={attendee.id}
              to={`/usuario/${attendee.id}`}
            >
              <div 
                className="w-10 h-10 rounded-full overflow-hidden border-2"
                style={{ borderColor }}
                title={attendee.name}
              >
                <img 
                  src={attendee.imageUrl} 
                  alt={attendee.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
          {overflow > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">+{overflow}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
      <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Quem vai</h2>
      
      <div className="space-y-4">
        {confirmedAttendees.length > 0 && (
          renderParticipantsList(confirmedAttendees, "Confirmados", "#4CAF50")
        )}

        {pendingAttendees.length > 0 && (
          renderParticipantsList(pendingAttendees, "Pendentes", "#FFA000")
        )}

        {cancelledAttendees.length > 0 && (
          renderParticipantsList(cancelledAttendees, "Furaram", "#FF4C4C")
        )}
      </div>
      
      {(confirmedAttendees.length + pendingAttendees.length + cancelledAttendees.length > 6) && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleShowAll}
          className="text-[#FF8A1E] dark:text-[#FF8A1E] flex gap-1 items-center mt-2"
        >
          {showAllAttendees ? (
            <>Ver menos <ChevronUp size={16} /></>
          ) : (
            <>Ver todos <ChevronDown size={16} /></>
          )}
        </Button>
      )}
    </div>
  );
};

export default EventParticipants;
