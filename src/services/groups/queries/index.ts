
import { GetGroupsService } from "./get-groups.service";
import { GetGroupByIdService } from "./get-group-by-id.service";

export const GroupQueryService = {
  ...GetGroupsService,
  ...GetGroupByIdService
};

export { 
  GetGroupsService,
  GetGroupByIdService
};
