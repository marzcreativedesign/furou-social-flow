
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotificationButton = () => {
  return (
    <Link to="/notificacoes" className="relative">
      <Button variant="ghost" size="icon" className="relative">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
          3
        </span>
      </Button>
    </Link>
  );
};

export default NotificationButton;
