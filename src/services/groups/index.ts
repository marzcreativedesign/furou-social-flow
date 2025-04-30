
import { GetGroupByIdService } from './queries/get-group-by-id.service';
import { GetGroupsService } from './queries/get-groups.service';
import { GroupMembersService } from './members.service';
import { GroupManagementService } from './management.service';
import { GroupInvitesService } from './invites.service';

// Combine query services
export const GroupQueryService = {
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

// Re-export the individual services for use when needed
export { 
  GroupQueryService,
  GroupMembersService,
  GroupManagementService,
  GroupInvitesService,
  GetGroupByIdService,
  GetGroupsService
};
