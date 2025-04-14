
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, ChevronRight, LogOut } from "lucide-react";

interface ProfileActionsProps {
  onSignOut?: () => void;
  groupsCount?: number;
}

export const ProfileActions = ({ onSignOut, groupsCount = 0 }: ProfileActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <button 
        className="flex items-center justify-between w-full bg-white dark:bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
        onClick={() => navigate("/grupos")}
      >
        <div className="flex items-center">
          <Users className="text-accent dark:text-[#FF9E3D] mr-3" size={20} />
          <span>Meus Grupos</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground dark:text-[#B3B3B3] mr-2">{groupsCount}</span>
          <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
        </div>
      </button>
      
      <button 
        className="flex items-center justify-between w-full bg-white dark:bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
        onClick={() => navigate("/eventos")}
      >
        <div className="flex items-center">
          <CalendarDays className="text-accent dark:text-[#FF9E3D] mr-3" size={20} />
          <span>Meus Eventos</span>
        </div>
        <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
      </button>

      {onSignOut && (
        <button 
          className="flex items-center justify-between w-full bg-white dark:bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
          onClick={onSignOut}
        >
          <div className="flex items-center">
            <LogOut className="text-red-500 mr-3" size={20} />
            <span className="text-red-500">Sair</span>
          </div>
          <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
        </button>
      )}
    </div>
  );
};
