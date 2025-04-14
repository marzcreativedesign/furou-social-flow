
import { useState } from "react";
import { 
  User,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Users,
  AlertCircle,
  Send,
  Crown,
  UserCog
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockParticipants = [
  { id: "1", name: "Carlos Oliveira", email: "carlos@exemplo.com", avatar: "https://i.pravatar.cc/150?img=1", status: "confirmed", isAdmin: true },
  { id: "2", name: "Ana Silva", email: "ana@exemplo.com", avatar: "https://i.pravatar.cc/150?img=5", status: "confirmed", isAdmin: false },
  { id: "3", name: "Bruno Santos", email: "bruno@exemplo.com", avatar: "https://i.pravatar.cc/150?img=12", status: "pending", isAdmin: false },
  { id: "4", name: "Carla Mendes", email: "carla@exemplo.com", avatar: "https://i.pravatar.cc/150?img=9", status: "confirmed", isAdmin: false },
  { id: "5", name: "Daniel Costa", email: "daniel@exemplo.com", avatar: "https://i.pravatar.cc/150?img=11", status: "rejected", isAdmin: false },
  { id: "6", name: "Fernanda Gomes", email: "fernanda@exemplo.com", avatar: "https://i.pravatar.cc/150?img=3", status: "pending", isAdmin: false },
];

type ParticipantStatus = "confirmed" | "pending" | "rejected";

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: ParticipantStatus;
  isAdmin: boolean;
}

interface GroupParticipantsManagerProps {
  groupId: string;
  isGroupCreator?: boolean;
}

const GroupParticipantsManager = ({ groupId, isGroupCreator = true }: GroupParticipantsManagerProps) => {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [inviteEmail, setInviteEmail] = useState("");
  const [reminderMessage, setReminderMessage] = useState("Olá! Este é um lembrete amigável para confirmar sua participação no nosso grupo.");

  const handleRemoveParticipant = (id: string) => {
    if (!isGroupCreator) return;
    
    setParticipants(participants.filter(p => p.id !== id));
    toast({
      title: "Participante removido",
      description: "O participante foi removido do grupo com sucesso."
    });
  };

  const handlePromoteToAdmin = (id: string) => {
    if (!isGroupCreator) return;
    
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, isAdmin: true } : p
    ));
    toast({
      title: "Co-administrador adicionado",
      description: "O participante agora é um co-administrador do grupo."
    });
  };

  const handleDemoteFromAdmin = (id: string) => {
    if (!isGroupCreator) return;
    
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, isAdmin: false } : p
    ));
    toast({
      title: "Co-administrador removido",
      description: "O participante não é mais um co-administrador do grupo."
    });
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail.trim() || !isGroupCreator) return;
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if email already exists
    if (participants.some(p => p.email === inviteEmail)) {
      toast({
        title: "Participante já existe",
        description: "Este e-mail já está registrado no grupo.",
        variant: "destructive"
      });
      return;
    }

    // Add new participant
    const newParticipant: Participant = {
      id: `new-${Date.now()}`,
      name: inviteEmail.split("@")[0], // Using email username as temporary name
      email: inviteEmail,
      status: "pending",
      isAdmin: false
    };
    
    setParticipants([...participants, newParticipant]);
    setInviteEmail("");
    
    toast({
      title: "Convite enviado",
      description: "Um convite foi enviado para o e-mail informado."
    });
  };

  const handleSendReminder = (id: string) => {
    if (!isGroupCreator) return;
    
    toast({
      title: "Lembrete enviado",
      description: "Um lembrete foi enviado para o participante."
    });
  };

  const getStatusBadge = (status: ParticipantStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmado</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning">Pendente</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">Recusado</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Users size={16} />
          <span>Gerenciar Participantes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Gerenciar Participantes do Grupo
          </DialogTitle>
          <DialogDescription>
            {isGroupCreator ? 
              "Adicione, remova ou gerencie os participantes deste grupo." : 
              "Lista de participantes deste grupo."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs defaultValue="participants">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">
                <Users size={16} className="mr-2" />
                Participantes ({participants.length})
              </TabsTrigger>
              {isGroupCreator && (
                <TabsTrigger value="invite">
                  <UserPlus size={16} className="mr-2" />
                  Convidar
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="participants" className="space-y-4 mt-4">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{participant.name}</p>
                          {participant.isAdmin && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                              <Crown size={12} className="mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                        <div className="mt-1">{getStatusBadge(participant.status)}</div>
                      </div>
                    </div>
                    
                    {isGroupCreator && participant.id !== "1" && (
                      <div className="flex gap-2">
                        {participant.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => handleSendReminder(participant.id)}
                          >
                            <Send size={14} className="mr-1" />
                            Lembrar
                          </Button>
                        )}
                        
                        {!participant.isAdmin ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => handlePromoteToAdmin(participant.id)}
                          >
                            <UserCog size={14} className="mr-1" />
                            Promover
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => handleDemoteFromAdmin(participant.id)}
                          >
                            <User size={14} className="mr-1" />
                            Remover Admin
                          </Button>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="h-8"
                          onClick={() => handleRemoveParticipant(participant.id)}
                        >
                          <XCircle size={14} className="mr-1" />
                          Remover
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Nenhum participante</h3>
                  <p className="text-sm text-muted-foreground">
                    Este grupo ainda não possui participantes.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {isGroupCreator && (
              <TabsContent value="invite" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Convidar por e-mail</h3>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          placeholder="Digite o e-mail do participante" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="pl-10"
                          type="email"
                        />
                      </div>
                      <Button onClick={handleInviteByEmail}>Convidar</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Enviar lembretes de participação</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Personalize a mensagem que será enviada para os participantes pendentes.
                      </p>
                      <textarea 
                        className="w-full h-24 p-3 rounded-md border border-input bg-background resize-none"
                        value={reminderMessage}
                        onChange={(e) => setReminderMessage(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Lembretes enviados",
                              description: "Lembretes enviados para todos os participantes pendentes."
                            });
                          }}
                        >
                          <Send size={14} className="mr-2" />
                          Enviar para todos pendentes
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-muted-foreground" />
                      <h3 className="text-sm font-medium">Dica para gerenciamento</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Você pode promover participantes para co-administradores para ajudar a gerenciar o grupo.
                      Co-administradores podem adicionar e remover participantes, mas não podem remover outros administradores.
                    </p>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupParticipantsManager;
