
import React from 'react';

export interface ProfileStatsProps {
  eventsCreated?: number;
  eventsAttended?: number;
  eventsMissed?: number;
  eventsCount?: number;
  reliability?: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  eventsCreated = 0,
  eventsAttended = 0,
  eventsMissed = 0,
  eventsCount = 0,
  reliability = 0
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-primary dark:text-primary">{eventsCreated || eventsCount}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Eventos criados</p>
      </div>
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-green-500 dark:text-[#4CAF50]">{eventsAttended}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Participações</p>
      </div>
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-rose-500 dark:text-[#FF4C4C]">{eventsMissed}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Furadas</p>
      </div>
    </div>
  );
};
