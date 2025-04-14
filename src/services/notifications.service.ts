
import { supabase } from '@/integrations/supabase/client';

export const NotificationsService = {
  getUserNotifications: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);
  },

  getAllNotifications: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
  },

  markAsRead: async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', user.user.id);
  },
  
  markAllAsRead: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.user.id)
      .eq('is_read', false);
  },
  
  createNotification: async (notification: {
    title: string;
    content: string;
    type: string;
    related_id?: string;
    user_id?: string;
  }) => {
    if (!notification.user_id) {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      notification.user_id = user.user.id;
    }
    
    return await supabase
      .from('notifications')
      .insert(notification);
  }
};
