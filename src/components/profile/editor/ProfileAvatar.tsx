
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  url: string;
  email: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar = ({ url, email, onAvatarChange }: ProfileAvatarProps) => {
  const initials = email
    .split("@")[0]
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <Avatar className="w-24 h-24 border-2 border-primary">
        <AvatarImage src={url} alt="Avatar" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <label 
        htmlFor="avatar-upload" 
        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Camera className="text-white" />
      </label>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;
