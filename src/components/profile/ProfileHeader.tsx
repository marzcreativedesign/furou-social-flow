
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, bio, avatarUrl }) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-col items-center text-center mb-6">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={avatarUrl || ""} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold">{name}</h2>
      {bio && <p className="text-sm text-muted-foreground mt-2">{bio}</p>}
    </div>
  );
};
