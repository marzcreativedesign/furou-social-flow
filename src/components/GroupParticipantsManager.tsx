
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Search, MoreHorizontal, UserPlus, Mail } from "lucide-react";
import { toast } from "./ui/use-toast";

// Definindo type para consistência
type ParticipantStatus = 'pending' | 'confirmed' | 'declined';

type Participant = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: ParticipantStatus;
  isAdmin: boolean;
};

type GroupParticipantsManagerProps = {
  groupId: string;
  isAdmin: boolean;
};

const GroupParticipantsManager = ({ groupId, isAdmin }: GroupParticipantsManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  
  // Mock data for participants - in real app this would come from an API
  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: "1", 
      name: "Carlos Oliveira", 
      email: "carlos@exemplo.com", 
      avatar: "https://i.pravatar.cc/150?u=1", 
      status: "confirmed", 
      isAdmin: true 
    },
    { 
      id: "2", 
      name: "Ana Silva", 
      email: "ana@exemplo.com", 
      avatar: "https://i.pravatar.cc/150?u=2", 
      status: "confirmed", 
      isAdmin: false 
    },
    { 
      id: "3", 
      name: "Paulo Santos", 
      email: "paulo@exemplo.com", 
      avatar: "https://i.pravatar.cc/150?u=3", 
      status: "pending", 
      isAdmin: false 
    },
    { 
      id: "4", 
      name: "Mariana Ferreira", 
      email: "mariana@exemplo.com", 
      avatar: "https://i.pravatar.cc/150?u=4", 
      status: "declined", 
      isAdmin: false 
    },
  ]);

  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddParticipant = () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido",
        variant: "destructive",
      });
      return;
    }

    // Check if participant already exists
    if (participants.some(p => p.email === newEmail)) {
      toast({
        title: "Participante já existe",
        description: "Este e-mail já foi adicionado ao grupo",
        variant: "destructive",
      });
      return;
    }

    // Add new participant
    const newParticipant: Participant = {
      id: `${participants.length + 1}`,
      name: newEmail.split('@')[0], // Simple name from email
      email: newEmail,
      avatar: `https://i.pravatar.cc/150?u=${participants.length + 5}`,
      status: "pending",
      isAdmin: false
    };

    setParticipants([...participants, newParticipant]);
    setNewEmail("");
    setShowAddParticipant(false);
    
    toast({
      title: "Convite enviado",
      description: `Um convite foi enviado para ${newEmail}`,
    });
  };

  const handleRemoveParticipant = () => {
    if (selectedParticipantId) {
      setParticipants(participants.filter(p => p.id !== selectedParticipantId));
      setShowRemoveDialog(false);
      setSelectedParticipantId(null);
      
      toast({
        title: "Participante removido",
        description: "O participante foi removido com sucesso",
      });
    }
  };

  const handleToggleAdmin = (participantId: string) => {
    setParticipants(
      participants.map(p => 
        p.id === participantId 
          ? { ...p, isAdmin: !p.isAdmin } 
          : p
      )
    );
    
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      toast({
        title: participant.isAdmin 
          ? "Permissão de administrador removida" 
          : "Permissão de administrador adicionada",
        description: `${participant.name} agora ${participant.isAdmin ? 'não é mais' : 'é'} um administrador do grupo`,
      });
    }
  };

  const handleSendReminder = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      toast({
        title: "Lembrete enviado",
        description: `Um lembrete foi enviado para ${participant.name}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Participantes</h2>
        {isAdmin && (
          <Button 
            onClick={() => setShowAddParticipant(true)} 
            variant="outline" 
            size="sm"
            className="gap-1"
          >
            <UserPlus size={16} />
            Adicionar
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar participante..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {showAddParticipant && (
        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
          <Label htmlFor="email">E-mail do participante</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button onClick={handleAddParticipant} size="sm">Convidar</Button>
          </div>
          <div className="flex gap-2 text-sm">
            <Button onClick={() => setShowAddParticipant(false)} variant="ghost" size="sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => (
            <div 
              key={participant.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-background"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{participant.name}</p>
                  <p className="text-sm text-muted-foreground">{participant.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {participant.isAdmin && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    participant.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : participant.status === 'declined' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {participant.status === 'confirmed' 
                    ? 'Confirmado' 
                    : participant.status === 'declined' 
                    ? 'Recusou' 
                    : 'Pendente'}
                </span>
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleAdmin(participant.id)}>
                        {participant.isAdmin ? "Remover administrador" : "Tornar administrador"}
                      </DropdownMenuItem>
                      {participant.status === 'pending' && (
                        <DropdownMenuItem onClick={() => handleSendReminder(participant.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar lembrete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedParticipantId(participant.id);
                          setShowRemoveDialog(true);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        Remover do grupo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhum participante encontrado</p>
          </div>
        )}
      </div>
      
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover participante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este participante do grupo? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveParticipant} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupParticipantsManager;
