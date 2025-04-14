
import { supabase } from '@/integrations/supabase/client';
import { 
  EVENT_NAMES, EVENT_DESCRIPTIONS, LOCATIONS, 
  GROUP_NAMES, GROUP_DESCRIPTIONS, IMAGE_URLS, 
  NOTIFICATION_DEFAULTS 
} from './constants';

export const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getRandomFutureDate = (): Date => {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) + 1;
  const result = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
  result.setHours(Math.floor(Math.random() * 12) + 8); // Between 8 AM and 8 PM
  result.setMinutes(Math.floor(Math.random() * 4) * 15); // 0, 15, 30, or 45 mins
  
  return result;
};

export const createEvent = async (userId: string) => {
  const isPublic = Math.random() > 0.5;
  const eventDate = getRandomFutureDate();
  
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert({
      title: getRandomItem(EVENT_NAMES),
      description: getRandomItem(EVENT_DESCRIPTIONS),
      date: eventDate.toISOString(),
      location: getRandomItem(LOCATIONS),
      is_public: isPublic,
      image_url: getRandomItem(IMAGE_URLS),
      creator_id: userId
    })
    .select();

  if (eventError) {
    console.error("Error creating event:", eventError);
    return null;
  }

  if (eventData && eventData.length > 0) {
    await supabase
      .from('event_participants')
      .insert({
        event_id: eventData[0].id,
        user_id: userId,
        status: 'confirmed'
      });
    
    return eventData[0];
  }
  
  return null;
};

export const createGroup = async (userId: string, eventId?: string) => {
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .insert({
      name: getRandomItem(GROUP_NAMES),
      description: getRandomItem(GROUP_DESCRIPTIONS),
      image_url: getRandomItem(IMAGE_URLS)
    })
    .select();
    
  if (groupError) {
    console.error("Error creating group:", groupError);
    return null;
  }
  
  if (groupData && groupData.length > 0) {
    const groupId = groupData[0].id;
    
    await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        is_admin: true
      });
      
    if (eventId) {
      await supabase
        .from('group_events')
        .insert({
          group_id: groupId,
          event_id: eventId
        });
    }
    
    return groupId;
  }
  
  return null;
};

export const createNotification = async (
  userId: string, 
  index: number, 
  relatedId: string | null = null
) => {
  const notificationTypes = ['info', 'event_invite', 'group_invite', 'event_update', 'location_change', 'confirmation'];
  
  return await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: notificationTypes[index % notificationTypes.length],
      title: NOTIFICATION_DEFAULTS.titles[index % NOTIFICATION_DEFAULTS.titles.length],
      content: NOTIFICATION_DEFAULTS.contents[index % NOTIFICATION_DEFAULTS.contents.length],
      related_id: relatedId,
      is_read: Math.random() > 0.7
    });
};
