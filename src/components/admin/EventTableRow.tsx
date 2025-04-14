
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Event } from "@/hooks/useAdminEvents";

interface EventTableRowProps {
  event: Event;
  onEditEvent: (event: Event) => void;
  onDeletePrompt: (event: Event) => void;
}

const EventTableRow = ({ event, onEditEvent, onDeletePrompt }: EventTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{event.title}</TableCell>
      <TableCell>{event.location || '-'}</TableCell>
      <TableCell>
        {new Date(event.date).toLocaleDateString()} 
        {' '}
        {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </TableCell>
      <TableCell>{event.creator_name || '-'}</TableCell>
      <TableCell>
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
          event.is_public ? 
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {event.is_public ? 'Público' : 'Privado'}
        </span>
      </TableCell>
      <TableCell>
        {event.created_at ? new Date(event.created_at).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell className="text-right space-x-1">
        <Button variant="ghost" size="icon" onClick={() => onEditEvent(event)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDeletePrompt(event)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default EventTableRow;
