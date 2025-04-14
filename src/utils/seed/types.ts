
export interface SeedUserDataResult {
  success: boolean;
  eventIds?: string[];
  groupIds?: string[];
  eventCount?: number;
  groupCount?: number;
  notificationCount?: number;
  error?: string;
}

export interface NotificationTemplate {
  title: string;
  content: string;
  type: string;
}
