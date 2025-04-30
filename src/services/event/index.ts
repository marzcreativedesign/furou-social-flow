
import { EventQueryService } from './queries';
import { EventParticipantService } from './participant.service';
import { EventCreationService } from './creation.service';
import { EventManagementService } from './management.service';

// Exporta uma API consolidada de todos os serviços de eventos
export const EventService = {
  ...EventQueryService,
  ...EventParticipantService,
  ...EventCreationService,
  ...EventManagementService
};

// Re-exporta os serviços individuais para uso quando necessário
export { 
  EventQueryService,
  EventParticipantService,
  EventCreationService,
  EventManagementService
};
