
import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface EventDetailDiscussionProps {
  eventId: string;
  comments: Comment[];
}

const EventDetailDiscussion = ({ eventId, comments: initialComments = [] }: EventDetailDiscussionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch current user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleSendComment = async () => {
    if (!newComment.trim() || !user || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          event_id: eventId,
          user_id: user.id
        })
        .select('*, profiles:user_id(full_name, avatar_url)')
        .single();
      
      if (error) throw error;
      
      setComments([data, ...comments]);
      setNewComment("");
      
    } catch (error) {
      console.error("Error sending comment:", error);
      toast({
        title: "Erro ao enviar comentário",
        description: "Não foi possível enviar seu comentário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (fullName: string | null): string => {
    if (!fullName) return "?";
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4 dark:text-[#EDEDED]">Discussão</h3>
      
      {/* Comment input */}
      {user ? (
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escrever um comentário..."
            className="flex-1"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
          />
          <Button 
            size="icon" 
            onClick={handleSendComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          Faça login para participar da discussão.
        </div>
      )}
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isCurrentUser = user && comment.user_id === user.id;
            const profile = comment.profiles || (isCurrentUser ? userProfile : null);
            const fullName = profile?.full_name || "Usuário";
            const avatarUrl = profile?.avatar_url || null;
            
            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar 
                  className="h-8 w-8 cursor-pointer" 
                  onClick={() => navigate(`/usuario/${comment.user_id}`)}
                >
                  <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                  <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-medium text-sm cursor-pointer hover:underline dark:text-[#EDEDED]"
                      onClick={() => navigate(`/usuario/${comment.user_id}`)}
                    >
                      {fullName}
                      {isCurrentUser && " (você)"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(comment.created_at), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm mt-1 dark:text-[#EDEDED]">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Nenhum comentário ainda</h3>
          <p className="text-sm text-muted-foreground">
            Seja o primeiro a comentar neste evento
          </p>
        </div>
      )}
    </div>
  );
};

export default EventDetailDiscussion;
