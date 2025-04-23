
import { supabase } from '@/integrations/supabase/client';

export const NotificationsService = {
  getUserNotifications: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Limitamos o número de colunas selecionadas e reduzimos o limite para 5
      return await supabase
        .from('notifications')
        .select('id, title, content, type, is_read, related_id, created_at, user_id')
        .eq('user_id', user.user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return { data: [], error };
    }
  },

  getAllNotifications: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Limitamos o número de colunas e adicionamos paginação
      return await supabase
        .from('notifications')
        .select('id, title, content, type, is_read, related_id, created_at, user_id')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
    } catch (error) {
      console.error('Erro ao buscar todas notificações:', error);
      return { data: [], error };
    }
  },

  markAsRead: async (id: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.user.id);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return { data: null, error };
    }
  },
  
  markAllAsRead: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      return { data: null, error };
    }
  },
  
  createNotification: async (notification: {
    title: string;
    content: string;
    type: string;
    related_id?: string;
    user_id: string;
  }) => {
    try {
      // Verificamos se o user_id foi fornecido
      if (!notification.user_id) {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          throw new Error('Usuário não autenticado');
        }
        notification.user_id = user.user.id;
      }
      
      return await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          content: notification.content,
          type: notification.type,
          related_id: notification.related_id,
          user_id: notification.user_id
        });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return { data: null, error };
    }
  }
};
