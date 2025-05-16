
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown } from "lucide-react";

interface SidebarUserProfileProps {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

const SidebarUserProfile = ({ name, email, avatarUrl, initials }: SidebarUserProfileProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate("/perfil")}
      className="flex items-center justify-between cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/30 rounded-md p-2"
    >
      <div className="flex items-center">
        <Avatar className="h-9 w-9 border border-muted-foreground/20">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="ml-3 overflow-hidden">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <ChevronsUpDown size={16} className="text-muted-foreground ml-1" />
    </div>
  );
};

export default SidebarUserProfile;
