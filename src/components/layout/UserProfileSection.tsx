
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface UserProfileSectionProps {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

const UserProfileSection = ({ 
  name, 
  email, 
  avatarUrl, 
  initials 
}: UserProfileSectionProps) => {
  return (
    <Link to="/perfil" className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-primary-foreground bg-primary/90">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="ml-3 overflow-hidden">
        <p className="font-medium dark:text-white truncate">{name}</p>
        <p className="text-sm text-muted-foreground truncate max-w-[170px]">{email}</p>
      </div>
    </Link>
  );
};

export default UserProfileSection;
