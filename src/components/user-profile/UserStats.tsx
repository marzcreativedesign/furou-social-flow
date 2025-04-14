
import { Users } from "lucide-react";

interface UserStatsProps {
  stats: {
    eventsCreated: number;
    eventsAttended: number;
    eventsMissed: number;
  };
}

const UserStats = ({ stats }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-primary dark:text-primary">{stats.eventsCreated}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Eventos criados</p>
      </div>
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-green-500 dark:text-[#4CAF50]">{stats.eventsAttended}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Participações</p>
      </div>
      <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
        <p className="text-lg font-bold text-rose-500 dark:text-[#FF4C4C]">{stats.eventsMissed}</p>
        <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Furadas</p>
      </div>
    </div>
  );
};

export default UserStats;
