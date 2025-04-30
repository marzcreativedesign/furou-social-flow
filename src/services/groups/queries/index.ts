
import { GetGroupByIdService } from './get-group-by-id.service';
import { GetGroupsService } from './get-groups.service';

// Export a combined service for queries
export const GroupQueryService = {
  ...GetGroupByIdService,
  ...GetGroupsService
};

// Export individual services
export { GetGroupByIdService, GetGroupsService };
