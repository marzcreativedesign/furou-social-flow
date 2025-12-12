
import { EventService } from './event';

// Este arquivo existe apenas para manter a compatibilidade com código existente
// Utilize o novo EventService em novos desenvolvimentos
export class EventsService {
  static async getEvents(page?: number, pageSize?: number) {
    if (page !== undefined && pageSize !== undefined) {
      return EventService.getEventsPaginated(page, pageSize);
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: new Error("User not authenticated") };
    
    return EventService.getUserEvents(user.id);
  }
  
  static async getPublicEvents(page?: number, pageSize?: number) {
    return EventService.getPublicEvents(page || 1, pageSize || 10);
  }
  
  static async getEventById(id: string) {
    return EventService.getEventById(id);
  }
  
  static async createEvent(eventData: any) {
    return EventService.createEvent(eventData);
  }
  
  static async updateEvent(id: string, eventData: any) {
    return EventService.updateEvent(id, eventData);
  }
  
  static async deleteEvent(id: string) {
    return EventService.deleteEvent(id);
  }
  
  static async joinEvent(eventId: string) {
    return EventService.joinEvent(eventId);
  }
  
  static async declineEvent(eventId: string) {
    return EventService.declineEvent(eventId);
  }
  
  static async getPendingInvites() {
    return EventService.getPendingInvites();
  }
}

import { supabase } from "@/integrations/supabase/client";

// Re-exportamos EventService para facilitar a migração gradual
export { EventService };
