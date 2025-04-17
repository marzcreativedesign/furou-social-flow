
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const EventSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-36 w-full" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-4/5" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-3/5" />
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
};

export const EventSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <EventSkeleton key={i} />
      ))}
    </div>
  );
};

export default EventSkeleton;
