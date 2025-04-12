
import { cn } from "@/lib/utils";

type EventTagProps = {
  type: "public" | "private" | "group";
  label: string;
  className?: string;
};

const EventTag = ({ type, label, className }: EventTagProps) => {
  const baseClasses = "text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center";
  
  const typeClasses = {
    public: "bg-green-100 text-green-700 border border-green-200",
    private: "bg-amber-100 text-amber-700 border border-amber-200",
    group: "bg-blue-100 text-blue-700 border border-blue-200"
  };
  
  return (
    <span className={cn(baseClasses, typeClasses[type], className)}>
      {label}
    </span>
  );
};

export default EventTag;
