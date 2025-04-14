
import { Users } from "lucide-react";

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
  eventType?: "public" | "private" | "group";
}

const EventParticipants = ({
  confirmedAttendees,
  pendingAttendees,
  cancelledAttendees,
  eventType
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
            <div 
              key={attendee.id}
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

  // If there are no confirmed or cancelled attendees, don't show the section
  if (confirmedAttendees.length === 0 && cancelledAttendees.length === 0 && 
     (eventType === 'public' || pendingAttendees.length === 0)) {
    return null;
  }

  return (
    <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
      <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Quem vai</h2>
      
      <div className="space-y-4">
        {confirmedAttendees.length > 0 && (
          renderParticipantsList(confirmedAttendees, "Confirmados", "#4CAF50")
        )}

        {/* Only show pending count for private or group events */}
        {(eventType === "private" || eventType === "group") && pendingAttendees.length > 0 && (
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2 dark:text-[#EDEDED]">
              <span className="h-3 w-3 rounded-full mr-2 bg-[#FFA000]"></span>
              <span className="flex items-center gap-2">
                Pendentes <span className="text-muted-foreground">({pendingAttendees.length})</span>
              </span>
            </h3>
          </div>
        )}

        {cancelledAttendees.length > 0 && (
          renderParticipantsList(cancelledAttendees, "Furaram", "#FF4C4C")
        )}
      </div>
    </div>
  );
};

export default EventParticipants;
