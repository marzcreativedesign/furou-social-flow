
import { supabase } from '@/integrations/supabase/client';

/**
 * Serviço para gerenciar operações relacionadas a notificações
 */
export const NotificationsService = {
  /**
   * Obter notificações do usuário atual
   */
  getUserNotifications: async () => {
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

  /**
   * Marcar notificação como lida
   */
  markAsRead: async (notificationId: string) => {
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  },

  /**
   * Marcar todas as notificações como lidas
   */
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

  /**
   * Criar uma nova notificação para um usuário
   */
  createNotification: async (userId: string, data: {
    type: 'info' | 'event_invite' | 'group_invite' | 'event_update' | 'location_change' | 'confirmation';
    title: string;
    content: string;
    related_id?: string;
  }) => {
    return await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: data.type,
        title: data.title,
        content: data.content,
        related_id: data.related_id
      });
  }
};
