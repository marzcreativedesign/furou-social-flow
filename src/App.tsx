
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const queryClient = new QueryClient();

const App: React.FC = () => {
  console.log("App rendering, About to render Toaster and Providers");

  return (
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
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
