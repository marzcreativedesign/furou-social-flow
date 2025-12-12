
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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
      className="flex items-center mb-2 px-2 cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/50 rounded-md p-2"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="ml-3 overflow-hidden">
        <p className="font-medium truncate">{name}</p>
        <p className="text-sm text-muted-foreground truncate">{email}</p>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
