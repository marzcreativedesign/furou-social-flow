
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  imageUrl: string;
}

interface EventParticipantsProps {
  confirmedAttendees: Attendee[];
  pendingAttendees: Attendee[];
  cancelledAttendees: Attendee[];
  showAllAttendees: boolean;
  onToggleShowAll: () => void;
  eventType: "public" | "private";
}

const EventParticipants = ({
  confirmedAttendees,
  pendingAttendees,
  cancelledAttendees,
  showAllAttendees,
  onToggleShowAll,
  eventType
}: EventParticipantsProps) => {
  const hasConfirmed = confirmedAttendees.length > 0;
  const hasPending = pendingAttendees.length > 0;
  const hasCancelled = cancelledAttendees.length > 0;

  if (!hasConfirmed && !hasPending && !hasCancelled) {
    return (
      <div className="mt-6 mb-4">
        <h2 className="font-bold mb-2 dark:text-[#EDEDED]">Participantes</h2>
        <p className="text-muted-foreground text-sm dark:text-[#B3B3B3]">
          Nenhum participante confirmado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-4">
      <h2 className="font-bold mb-2 dark:text-[#EDEDED]">Participantes</h2>
      
      {hasConfirmed && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 dark:text-[#EDEDED]">
            Confirmados ({confirmedAttendees.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {confirmedAttendees
              .slice(0, showAllAttendees ? confirmedAttendees.length : 8)
              .map(attendee => (
                <div key={attendee.id} className="flex flex-col items-center">
                  <Avatar className="mb-1">
                    <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                    <AvatarFallback>
                      {attendee.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center w-16 truncate dark:text-[#EDEDED]">
                    {attendee.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {hasPending && eventType === "private" && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-amber-600 dark:text-amber-400">
            Aguardando ({pendingAttendees.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {pendingAttendees
              .slice(0, showAllAttendees ? pendingAttendees.length : 4)
              .map(attendee => (
                <div key={attendee.id} className="flex flex-col items-center">
                  <Avatar className="mb-1 border-2 border-amber-200 dark:border-amber-900">
                    <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                    <AvatarFallback>
                      {attendee.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center w-16 truncate dark:text-[#EDEDED]">
                    {attendee.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {hasCancelled && showAllAttendees && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-rose-600 dark:text-rose-400">
            Declinaram ({cancelledAttendees.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {cancelledAttendees.map(attendee => (
              <div key={attendee.id} className="flex flex-col items-center">
                <Avatar className="mb-1 border-2 border-rose-200 dark:border-rose-900">
                  <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                  <AvatarFallback>
                    {attendee.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-center w-16 truncate dark:text-[#EDEDED]">
                  {attendee.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {((confirmedAttendees.length > 8) || 
        (hasPending && pendingAttendees.length > 4) || 
        hasCancelled) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleShowAll}
          className="flex items-center mt-2"
        >
          {showAllAttendees ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Mostrar todos
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default EventParticipants;
