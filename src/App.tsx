
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import CalendarView from "./pages/CalendarView";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import EventsPage from "./pages/EventsPage";
import CostCalculatorPage from "./pages/CostCalculatorPage";
import ExplorePage from "./pages/ExplorePage";

const queryClient = new QueryClient();

const App = () => {
  // Inicializa o modo escuro do localStorage na inicialização do aplicativo
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Remover quaisquer classes de acessibilidade que possam ter sido aplicadas
    document.documentElement.classList.remove('high-contrast', 'reduce-motion');
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('font-serif', 'font-mono', 'font-dyslexic');
    document.documentElement.classList.add('font-sans');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/evento/:id" element={<EventDetail />} />
              <Route path="/criar" element={<CreateEvent />} />
              <Route path="/grupos" element={<Groups />} />
              <Route path="/grupo/:id" element={<GroupDetail />} />
              <Route path="/notificacoes" element={<Notifications />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/usuario/:id" element={<UserProfile />} />
              <Route path="/agenda" element={<CalendarView />} />
              <Route path="/acessibilidade" element={<Settings />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/calculadora" element={<CostCalculatorPage />} />
              <Route path="/explorar" element={<ExplorePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
