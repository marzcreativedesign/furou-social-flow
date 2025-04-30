
import { GroupQueryService } from './queries';
import { GroupMembersService } from './members.service';
import { GroupManagementService } from './management.service';
import { GroupInvitesService } from './invites.service';

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
  GroupInvitesService
};

// Do NOT re-export from each individual module to avoid conflicts
