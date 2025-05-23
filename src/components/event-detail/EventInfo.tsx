
import { Calendar, MapPin } from "lucide-react";
import EventMapButton from "@/components/EventMapButton";
import EventAttendeesCount from "./EventAttendeesCount";
import type { EventParticipant } from "@/types/event";

interface EventInfoProps {
  fullDate: string;
  location: string;
  address: string;
  participants: EventParticipant[];
}

const EventInfo = ({ fullDate, location, address, participants }: EventInfoProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center">
        <Calendar size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
        <span className="dark:text-[#EDEDED]">{fullDate}</span>
      </div>
      
      <div className="flex items-center">
        <MapPin size={18} className="text-[#FF8A1E] dark:text-[#FF8A1E] mr-3 flex-shrink-0" />
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="dark:text-[#EDEDED]">{location}</div>
            <div className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{address}</div>
          </div>
          <EventMapButton 
            address={address} 
            location={location}
            variant="outline"
            size="sm"
          />
        </div>
      </div>
      
      <EventAttendeesCount participants={participants} />
    </div>
  );
};

export default EventInfo;
