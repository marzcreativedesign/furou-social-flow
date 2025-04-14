
import { CalendarDays } from "lucide-react";
import MainLayout from "../MainLayout";

interface EventDetailSkeletonProps {
  onBack: () => void;
}

const EventDetailSkeleton = ({ onBack }: EventDetailSkeletonProps) => {
  return (
    <MainLayout showBack onBack={onBack} title="Carregando evento...">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );
};

export default EventDetailSkeleton;
