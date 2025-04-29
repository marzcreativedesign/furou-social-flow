
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProfileInterestsProps {
  interests: string[];
}

export const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests }) => {
  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Interesses</h3>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <Badge key={index} variant="secondary">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
};
