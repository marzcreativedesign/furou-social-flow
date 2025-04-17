
import { CalendarDays, MapPin, User } from "lucide-react";
import MainLayout from "../MainLayout";
import { Skeleton } from "@/components/ui/skeleton";

interface EventDetailSkeletonProps {
  onBack: () => void;
}

const EventDetailSkeleton = ({ onBack }: EventDetailSkeletonProps) => {
  return (
    <MainLayout showBack onBack={onBack} title="Carregando evento...">
      {/* Header with image */}
      <div className="relative">
        <Skeleton className="w-full h-64 rounded-lg" />
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent rounded-lg">
          <Skeleton className="h-8 w-4/5 bg-gray-300/50 mb-2" />
          <div className="flex items-center gap-2 mt-1">
            <CalendarDays className="h-4 w-4 text-gray-300" />
            <Skeleton className="h-4 w-32 bg-gray-300/50" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-gray-300" />
            <Skeleton className="h-4 w-40 bg-gray-300/50" />
          </div>
          <div className="flex justify-end mt-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 bg-gray-300/50" />
              <Skeleton className="h-9 w-24 bg-gray-300/50" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Creator section */}
        <div className="flex items-center gap-3 my-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        
        {/* Event info */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="border-t border-b py-4 my-4 border-border dark:border-[#2C2C2C]">
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        {/* Participation */}
        <div className="my-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
        
        {/* Participants */}
        <div className="my-6">
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Comments */}
        <div className="my-6">
          <Skeleton className="h-6 w-24 mb-3" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailSkeleton;
