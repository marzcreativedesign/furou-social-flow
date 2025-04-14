
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Event } from "@/hooks/useAdminEvents";
import EventTableRow from "./EventTableRow";
import EventTableSkeleton from "./EventTableSkeleton";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEditEvent: (event: Event) => void;
  onDeletePrompt: (event: Event) => void;
}

const EventsTable = ({ events, loading, onEditEvent, onDeletePrompt }: EventsTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Criador</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <EventTableSkeleton />
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Nenhum evento encontrado
              </TableCell>
            </TableRow>
          ) : (
            events.map(event => (
              <EventTableRow
                key={event.id}
                event={event}
                onEditEvent={onEditEvent}
                onDeletePrompt={onDeletePrompt}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTable;
