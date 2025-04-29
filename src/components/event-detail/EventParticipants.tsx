
import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Attendee {
  id: string;
  name: string;
  imageUrl: string;
}

interface EventParticipantsProps {
  confirmedAttendees: Attendee[];
  pendingAttendees?: Attendee[];
  cancelledAttendees?: Attendee[];
  showAllAttendees: boolean;
  onToggleShowAll: () => void;
  eventType: string;
}

const EventParticipants = ({
  confirmedAttendees,
  pendingAttendees = [],
  cancelledAttendees = [],
  showAllAttendees,
  onToggleShowAll,
  eventType
}: EventParticipantsProps) => {
  const hasConfirmed = confirmedAttendees.length > 0;
  const hasPending = pendingAttendees.length > 0;
  const hasCancelled = cancelledAttendees.length > 0;
  const hasAttendees = hasConfirmed || hasPending || hasCancelled;

  if (!hasAttendees) return null;

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayedConfirmedAttendees = showAllAttendees ? confirmedAttendees : confirmedAttendees.slice(0, 5);
  const displayedPendingAttendees = showAllAttendees ? pendingAttendees : pendingAttendees.slice(0, 3);
  const displayedCancelledAttendees = showAllAttendees ? cancelledAttendees : cancelledAttendees.slice(0, 3);
  const totalHidden = confirmedAttendees.length + pendingAttendees.length + cancelledAttendees.length - 
    displayedConfirmedAttendees.length - displayedPendingAttendees.length - displayedCancelledAttendees.length;

  return (
    <div className="my-6">
      <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Participantes</h2>
      
      <div className="space-y-4">
        {/* Confirmed attendees */}
        {hasConfirmed && (
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
              Confirmados ({confirmedAttendees.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {displayedConfirmedAttendees.map((attendee) => (
                <Avatar key={attendee.id} className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(attendee.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}
        
        {/* Pending attendees */}
        {hasPending && eventType !== 'public' && (
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
              Aguardando confirmação ({pendingAttendees.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {displayedPendingAttendees.map((attendee) => (
                <Avatar key={attendee.id} className="h-10 w-10 border-2 border-muted/40">
                  <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getInitials(attendee.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}
        
        {/* Cancelled attendees */}
        {hasCancelled && (
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
              Declinaram ({cancelledAttendees.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {displayedCancelledAttendees.map((attendee) => (
                <Avatar key={attendee.id} className="h-10 w-10 border-2 border-destructive/20">
                  <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                  <AvatarFallback className="bg-destructive/10 text-destructive">
                    {getInitials(attendee.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}

        {/* Show/Hide toggle button */}
        {totalHidden > 0 && (
          <button
            className="flex items-center gap-1 text-sm text-primary hover:underline"
            onClick={onToggleShowAll}
          >
            {showAllAttendees ? (
              <>
                <ChevronUp size={16} />
                <span>Mostrar menos</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Ver mais {totalHidden} participantes</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventParticipants;
