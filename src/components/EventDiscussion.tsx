
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type CommentType = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
};

type EventDiscussionProps = {
  eventId: string;
  initialComments?: CommentType[];
};

const EventDiscussion = ({ eventId, initialComments = [] }: EventDiscussionProps) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: CommentType = {
      id: `comment-${Date.now()}`,
      userId: "1", // Current user ID
      userName: "Carlos Oliveira", // Current user name
      userAvatar: "https://i.pravatar.cc/150?u=1", // Current user avatar
      content: newComment,
      timestamp: new Date().toISOString(),
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };
  
  return (
    <div className="space-y-4">
      {/* Comment input */}
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escrever um comentário..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendComment();
            }
          }}
        />
        <Button size="icon" onClick={handleSendComment}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar 
                className="h-8 w-8 cursor-pointer" 
                onClick={() => navigate(`/usuario/${comment.userId}`)}
              >
                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                <AvatarFallback>{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-medium text-sm cursor-pointer hover:underline"
                    onClick={() => navigate(`/usuario/${comment.userId}`)}
                  >
                    {comment.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(comment.timestamp), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">Nenhum comentário ainda</h3>
          <p className="text-sm text-muted-foreground">
            Seja o primeiro a comentar neste evento
          </p>
        </div>
      )}
    </div>
  );
};

export default EventDiscussion;
