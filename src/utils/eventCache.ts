
import { ExploreEventsData } from "@/types/explore";
import { getCache, setCache, generateCacheKey } from "./clientCache";

export const getEventsCacheKey = (prefix: string, params: Record<string, any>) => {
  return generateCacheKey(prefix, params);
};

export const getCachedEvents = (cacheKey: string): ExploreEventsData | null => {
  return getCache<ExploreEventsData>(cacheKey);
};

export const cacheEvents = (
  cacheKey: string, 
  data: ExploreEventsData, 
  expireTimeInMinutes: number = 5
): void => {
  setCache(cacheKey, data, { expireTimeInMinutes });
};
