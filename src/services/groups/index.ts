
import { GetGroupByIdService } from './queries/get-group-by-id.service';
import { GetGroupsService } from './queries/get-groups.service';
import { GroupMembersService } from './members.service';
import { GroupManagementService } from './management.service';
import { GroupInvitesService } from './invites.service';

// Combine query services - defined here to avoid duplicate exports
const GroupQueryService = {
  ...GetGroupByIdService,
  ...GetGroupsService
};

// Export a consolidated API of all group services
export const GroupService = {
  ...GroupQueryService,
  ...GroupMembersService,
  ...GroupManagementService,
  ...GroupInvitesService
};

// Export individual services directly
export {
  GroupMembersService,
  GroupManagementService,
  GroupInvitesService,
  GetGroupByIdService,
  GetGroupsService
};

// Export combined query service
export { GroupQueryService };
