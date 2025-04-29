
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, LogOut } from "lucide-react";

interface ProfileActionsProps {
  onSignOut?: () => void;
}

export const ProfileActions = ({ onSignOut }: ProfileActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
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
