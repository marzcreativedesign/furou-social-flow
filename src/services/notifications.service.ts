
import { supabase } from '@/integrations/supabase/client';

export const NotificationsService = {
  getUserNotifications: async () => {
    return await supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);
  },

  markAsRead: async (id: string) => {
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  }
};
