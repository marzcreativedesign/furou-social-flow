
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Share2, MapPin, Calendar } from "lucide-react";
import EventShareButton from '@/components/EventShareButton';
import EventInviteDialog from "./EventInviteDialog";

interface EventHeaderProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  type?: string;
  groupName?: string | null;
  host?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  isEventHost?: boolean;
  onEditClick?: () => void;
}

const EventHeader = ({ 
  id, 
  title, 
  date, 
  location, 
  imageUrl,
  type,
  groupName,
  host,
  isEventHost,
  onEditClick
}: EventHeaderProps) => {
  const formattedDate = format(new Date(date), 'EEEE, dd \'de\' MMMM', { locale: ptBR });

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent text-white rounded-lg">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center text-sm mt-1">
          <Calendar className="mr-2 h-4 w-4" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm mt-1">
          <MapPin className="mr-2 h-4 w-4" />
          {location}
        </div>
        <div className="flex justify-end mt-4">
          <div className="flex gap-2">
            <EventShareButton 
              eventId={id} 
              eventTitle={title} 
              eventUrl={window.location.href}
            />
            <EventInviteDialog eventId={id} eventTitle={title} eventDate={date} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
