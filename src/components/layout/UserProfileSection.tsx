
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

const UserProfileSection = ({ name, email, avatarUrl, initials }: UserProfileProps) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-3 p-2 mb-2 justify-start w-full hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      onClick={() => navigate('/perfil')}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="font-medium text-sm truncate">{name}</span>
        <span className="text-xs text-muted-foreground truncate">{email}</span>
      </div>
    </Button>
  );
};

export default UserProfileSection;
