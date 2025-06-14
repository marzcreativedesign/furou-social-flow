
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown } from "lucide-react";

interface SidebarUserProfileProps {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

const SidebarUserProfile = ({ name, email, avatarUrl, initials }: SidebarUserProfileProps) => {
  // DEBUG LOGS PARA DIAGNÓSTICO
  console.log('[SidebarUserProfile] Render START');
  let navigate;
  try {
    navigate = useNavigate();
    if (!navigate) throw new Error("navigate is undefined (useNavigate)");
    console.log('[SidebarUserProfile] useNavigate resolved');
  } catch (e) {
    console.error("[SidebarUserProfile] useNavigate ERROR:", e);
    // Render fallback UI para evitar crash completo
    return (
      <div className="p-3 border bg-red-100 text-red-800 rounded">
        Erro fatal: SidebarUserProfile precisa estar sob RouterProvider.
        <br />
        <strong>Detalhes:</strong>{" "}
        {typeof e === "object" && e && "message" in e ? (e as any).message : String(e)}
      </div>
    );
  }

  // Testar se Avatar não quebra
  let avatarNode;
  try {
    avatarNode = (
      <Avatar className="h-9 w-9 border border-muted-foreground/20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  } catch (err) {
    console.error("[SidebarUserProfile] Avatar ERROR:", err);
    avatarNode = (
      <div className="w-9 h-9 bg-gray-300 text-gray-700 flex items-center justify-center rounded-full">
        ?
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate("/perfil")}
      className="flex items-center justify-between cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/30 rounded-md p-2"
    >
      <div className="flex items-center">
        {avatarNode}
        <div className="ml-3 overflow-hidden">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <ChevronsUpDown size={16} className="text-muted-foreground ml-1" />
    </div>
  );
};

export default SidebarUserProfile;

