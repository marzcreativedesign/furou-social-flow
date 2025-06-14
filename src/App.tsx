
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";

const queryClient = new QueryClient();

// AuthProvider wraps RouterProvider to allow useNavigate in AuthContext
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider
            router={router}
            fallbackElement={
              // Provide fallback while router is loading
              <div className="flex items-center justify-center h-screen">
                <span className="animate-spin h-8 w-8 border-4 border-muted border-t-transparent rounded-full" />
              </div>
            }
          />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

