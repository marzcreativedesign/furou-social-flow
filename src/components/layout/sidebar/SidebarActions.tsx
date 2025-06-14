
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface SidebarActionsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const SidebarActions = ({ darkMode, toggleDarkMode, onLogout }: SidebarActionsProps) => {
  // SAFETY: Handle context issue gracefully!
  let navigate;
  try {
    navigate = useNavigate();
    if (!navigate) throw new Error("navigate is undefined (useNavigate)");
  } catch (e) {
    console.error("[SidebarActions] useNavigate ERROR:", e);
    return (
      <div className="p-3 border bg-red-100 text-red-800 rounded">
        Erro: SidebarActions requer contexto do RouterProvider.
        <br />
        <strong>Detalhes:</strong>{" "}
        {typeof e === "object" && e && "message" in e ? (e as any).message : String(e)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center">
          {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
          <span className="text-sm">Tema escuro</span>
        </div>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-start h-auto py-2.5 mt-2"
        onClick={() => navigate("/criar")}
      >
        <PlusCircle size={18} className="mr-2" />
        <span>Criar Evento</span>
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-auto py-2.5"
        onClick={onLogout}
      >
        <LogOut size={18} className="mr-2" />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default SidebarActions;
