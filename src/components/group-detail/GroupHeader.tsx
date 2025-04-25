
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupHeaderProps {
  name: string;
  description?: string;
  imageUrl?: string;
  membersCount: number;
  eventsCount: number;
  activeEventsCount: number;
}

const GroupHeader = ({
  name,
  description,
  imageUrl,
  membersCount,
  eventsCount,
  activeEventsCount
}: GroupHeaderProps) => {
  return (
    <>
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="text-lg font-bold">{membersCount}</div>
          <div className="text-sm text-muted-foreground">Membros</div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="text-lg font-bold">{eventsCount}</div>
          <div className="text-sm text-muted-foreground">Eventos</div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="text-lg font-bold">{activeEventsCount}</div>
          <div className="text-sm text-muted-foreground">Ativos</div>
        </div>
      </div>
    </>
  );
};

export default GroupHeader;
