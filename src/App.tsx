
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import all page components
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
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
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/evento/:id" element={<EventDetail />} />
              <Route path="/explorar" element={<ExplorePage />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/criar" element={<CreateEvent />} />
                <Route path="/notificacoes" element={<Notifications />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/usuario/:id" element={<UserProfile />} />
                <Route path="/agenda" element={<CalendarView />} />
                <Route path="/acessibilidade" element={<Settings />} />
                <Route path="/eventos" element={<EventsPage />} />
                <Route path="/calculadora" element={<CostCalculatorPage />} />
                <Route path="/home" element={<HomePage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              
              {/* Default route redirects to /home (for authenticated) or /auth (for guests) */}
              <Route path="/" element={<Navigate to="/home" replace />} />
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
