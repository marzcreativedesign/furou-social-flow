
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      
      <div className="mb-6">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
      
      <div>
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
