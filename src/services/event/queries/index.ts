
import { GetEventsService } from "./get-events.service";
import { GetEventByIdService } from "./get-event-by-id.service";

export const EventQueriesService = {
  ...GetEventsService,
  ...GetEventByIdService
};
