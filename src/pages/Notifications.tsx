
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Lembrete de evento",
    content: "Não esqueça do Happy Hour hoje às 19h",
    time: "10 minutos atrás",
    read: false,
    type: "event_reminder"
  },
  {
    id: "2",
    title: "Nova confirmação",
    content: "João Silva confirmou presença no seu evento",
    time: "30 minutos atrás",
    read: true,
    type: "rsvp_confirmation"
  },
  {
    id: "3",
    title: "Novo comentário",
    content: "Ana deixou um comentário no evento 'Aniversário da Marina'",
    time: "2 horas atrás",
    read: true,
    type: "comment"
  },
  {
    id: "4",
    title: "Convite de grupo",
    content: "Você foi convidado para o grupo 'Colegas do Trabalho'",
    time: "5 horas atrás",
    read: false,
    type: "group_invite"
  },
  {
    id: "5",
    title: "Evento cancelado",
    content: "O evento 'Reunião de Time' foi cancelado pelo organizador",
    time: "1 dia atrás",
    read: true,
    type: "event_canceled"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();
  
  const handleDismissAll = () => {
    setNotifications([]);
  };
  
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <MainLayout
      title="Notificações"
      showBack
      onBack={handleBackToHome}
      rightContent={
        notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleDismissAll}>
            Limpar tudo
          </Button>
        )
      }
    >
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg relative ${
                  notification.read ? "bg-muted/30" : "bg-muted"
                }`}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => handleDismiss(notification.id)}
                  aria-label="Fechar notificação"
                >
                  <X size={16} />
                </Button>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.content}
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <span className="text-4xl mb-4">🔔</span>
            <h2 className="text-xl font-medium mb-2">Nenhuma notificação</h2>
            <p className="text-muted-foreground text-center">
              Você não tem notificações no momento
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
