
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import all page components
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import EventsPage from "./pages/EventsPage";
import CostCalculatorPage from "./pages/CostCalculatorPage";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/auth" element={<AuthPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
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
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              
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
