
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotificationsService } from "@/services/notifications.service";

const NotificationButton = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await NotificationsService.getUserNotifications();
        setNotificationCount(data?.length || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotifications();
    
    // Refresh notification count every minute
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notificacoes" className="relative">
      <Button variant="ghost" size="icon" className="relative">
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default NotificationButton;
