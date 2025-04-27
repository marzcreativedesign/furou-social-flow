
import React from 'react';

interface GroupStatsProps {
  membersCount: number;
  eventsCount: number;
  activeEventsCount: number;
}

const GroupStats = ({ membersCount, eventsCount, activeEventsCount }: GroupStatsProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-lg font-bold">{membersCount}</div>
        <div className="text-sm text-muted-foreground">Membros</div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-lg font-bold">{eventsCount}</div>
        <div className="text-sm text-muted-foreground">Eventos</div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-lg font-bold">{activeEventsCount}</div>
        <div className="text-sm text-muted-foreground">Ativos</div>
      </div>
    </div>
  );
};

export default GroupStats;
