
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import EventSearch from "./EventSearch";
import EventsTable from "./EventsTable";
import EventEditDialog from "./EventEditDialog";
import EventDeleteDialog from "./EventDeleteDialog";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import type { Event } from "@/hooks/useAdminEvents";

const EventManagement = () => {
  const { events, loading, fetchEvents } = useAdminEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setOpenEditDialog(true);
  };

  const handleDeletePrompt = (event: Event) => {
    setEditingEvent(event);
    setOpenDeleteDialog(true);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Eventos</h2>
        <Button onClick={fetchEvents} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <EventSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <EventsTable
        events={filteredEvents}
        loading={loading}
        onEditEvent={handleEditEvent}
        onDeletePrompt={handleDeletePrompt}
      />

      <EventEditDialog
        event={editingEvent}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        onEventUpdate={fetchEvents}
      />

      <EventDeleteDialog
        event={editingEvent}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onEventDelete={fetchEvents}
      />
    </div>
  );
};

export default EventManagement;
