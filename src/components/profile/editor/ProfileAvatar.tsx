
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarPreview: string | null;
  fullName: string | null;
  email: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar = ({ avatarPreview, fullName, email, onAvatarChange }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative">
        <Avatar className="h-20 w-20 border-4 border-background dark:border-[#1E1E1E]">
          <AvatarImage src={avatarPreview || undefined} alt={fullName || ''} />
          <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
            {fullName?.substring(0, 2).toUpperCase() || email?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0">
          <label htmlFor="avatar-upload" className="bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors cursor-pointer">
            <Camera size={14} />
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;
