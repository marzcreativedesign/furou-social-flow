
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { router } from "./routes";

// AuthProvider is now ONLY used as a Layout in routes/index.tsx!
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider
            router={router}
            fallbackElement={
              <div className="flex items-center justify-center h-screen">
                <span className="animate-spin h-8 w-8 border-4 border-muted border-t-transparent rounded-full" />
              </div>
            }
          />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
