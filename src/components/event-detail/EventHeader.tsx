
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Edit, UserPlus } from "lucide-react";
import EventShareButton from '@/components/event-detail/EventShareButton';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const isMobile = useIsMobile();
  
  const isPrivateEvent = type === 'private';
  
  const InviteUserContent = () => (
    <div className="p-4">
      <p className="mb-4">Compartilhe este link de convite com os usuários que deseja convidar:</p>
      <div className="p-3 bg-gray-100 rounded-md flex items-center justify-between dark:bg-gray-800">
        <code className="text-sm overflow-auto">{`${window.location.origin}/convite/${id}`}</code>
        <Button 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/convite/${id}`);
            alert("Link copiado para a área de transferência!");
          }}
          size="sm"
          variant="outline"
        >
          Copiar
        </Button>
      </div>
    </div>
  );

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
            {isEventHost && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEditClick}
                className="bg-white/20 hover:bg-white/30 border-transparent"
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Editar</span>
              </Button>
            )}
            
            {isPrivateEvent && (
              isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 border-transparent"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span>Convidar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[80vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Convidar Usuários</SheetTitle>
                      <SheetDescription>
                        Compartilhe este evento privado com outros usuários.
                      </SheetDescription>
                    </SheetHeader>
                    <InviteUserContent />
                  </SheetContent>
                </Sheet>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 border-transparent"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span>Convidar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Convidar Usuários</DialogTitle>
                      <DialogDescription>
                        Compartilhe este evento privado com outros usuários.
                      </DialogDescription>
                    </DialogHeader>
                    <InviteUserContent />
                  </DialogContent>
                </Dialog>
              )
            )}

            <EventShareButton 
              eventId={id} 
              eventTitle={title} 
              eventUrl={window.location.href}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
