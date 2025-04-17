
import { GetEventsService } from "./get-events.service";
import { GetEventByIdService } from "./get-event-by-id.service";
import { GetEventsPaginatedService } from "./get-events-paginated.service";

export const EventQueriesService = {
  ...GetEventsService,
  ...GetEventByIdService,
  ...GetEventsPaginatedService
};
