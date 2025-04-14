
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { NotificationsService } from "@/services/notifications.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Calendar, CheckCircle, Info, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  related_id: string | null;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await NotificationsService.getAllNotifications();
      
      if (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas notificações",
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as notificações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await NotificationsService.markAsRead(id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      sonnerToast.error("Erro ao marcar notificação como lida");
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await NotificationsService.markAllAsRead();
      
      if (error) {
        throw error;
      }
      
      // Update all notifications in the state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
      
      sonnerToast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      sonnerToast.error("Erro ao marcar todas notificações como lidas");
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event_invite":
      case "event_update":
        return <Calendar className="text-blue-500" />;
      case "group_invite":
      case "group_update":
        return <Users className="text-purple-500" />;
      case "confirmation":
      case "confirmation_reminder":
        return <CheckCircle className="text-green-500" />;
      default:
        return <Info className="text-amber-500" />;
    }
  };
  
  const getTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return "Data desconhecida";
    }
  };
  
  const getFormattedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data desconhecida";
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // If related to an event or group, navigate to that page
    if (notification.related_id) {
      if (notification.type.startsWith("event")) {
        navigate(`/evento/${notification.related_id}`);
      } else if (notification.type.startsWith("group")) {
        navigate(`/grupo/${notification.related_id}`);
      }
    }
    
    // Mark as read if not already
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
  };
  
  return (
    <MainLayout title="Notificações">
      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Notificações</h1>
          {notifications.some(n => !n.is_read) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => (
              <Card 
                key={notification.id}
                className={`p-4 cursor-pointer ${
                  notification.is_read ? 'opacity-70' : 'border-l-4 border-l-primary'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getFormattedDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
            <p className="text-muted-foreground">
              Você não possui notificações no momento.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
