
import { supabase } from "@/integrations/supabase/client";
import { handleError, getCurrentUser } from "./utils";

export const GroupInvitesService = {
  /**
   * Retrieves all pending invites for the current user
   */
  async getPendingInvites() {
    try {
      const user = await getCurrentUser();
      
      // Use any type to bypass type checking until Supabase types are updated
      const { data, error } = await supabase
        .from("group_invites" as any)
        .select("*, groups(*)")
        .eq("invitee_email", user.email)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString());

      return { data, error };
    } catch (error) {
      return handleError(error, "Error retrieving pending group invites");
    }
  },

  /**
   * Creates a new group invite
   */
  async createInvite(groupId: string, inviteeEmail: string) {
    try {
      const user = await getCurrentUser();
      
      const inviteCode = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
      
      const { data, error } = await supabase
        .from("group_invites" as any)
        .insert([{
          group_id: groupId,
          inviter_id: user.id,
          invitee_email: inviteeEmail,
          invite_code: inviteCode,
          status: "pending",
          expires_at: expiresAt.toISOString()
        }])
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      return handleError(error, "Error creating group invite");
    }
  },

  /**
   * Accepts a group invite
   */
  async acceptInvite(inviteCode: string) {
    try {
      const user = await getCurrentUser();
      
      // First, get the invite to verify it's valid and not expired
      const { data: invite, error: inviteError } = await supabase
        .from("group_invites" as any)
        .select("*")
        .eq("invite_code", inviteCode)
        .eq("invitee_email", user.email)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();
        
      if (inviteError || !invite) {
        return { data: null, error: inviteError || new Error("Invalid or expired invite") };
      }

      // Update invite status to accepted
      const { error: updateError } = await supabase
        .from("group_invites" as any)
        .update({ status: "accepted" })
        .eq("id", (invite as any).id);
        
      if (updateError) {
        return { data: null, error: updateError };
      }

      // Add user to group members
      const { data, error } = await supabase
        .from("group_members" as any)
        .insert([{
          group_id: (invite as any).group_id,
          user_id: user.id,
          is_admin: false
        }])
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      return handleError(error, "Error accepting group invite");
    }
  }
};
