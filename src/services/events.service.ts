
import { EventCreationService } from "./event/event-creation.service";
import { EventQueriesService } from "./event/event-queries.service";
import { ParticipantManagementService } from "./event/participant-management.service";

export const EventsService = {
  ...EventCreationService,
  ...EventQueriesService,
  ...ParticipantManagementService
};
