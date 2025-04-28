
import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import EventsPage from "@/pages/EventsPage";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
import CostCalculatorPage from "@/pages/CostCalculatorPage";
import Login from "@/pages/Login";
import Notifications from "@/pages/Notifications";
import CalendarView from "@/pages/CalendarView";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AdminPage from "@/pages/AdminPage";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import ExplorePage from "@/pages/ExplorePage";
import GroupsPage from "@/pages/GroupsPage";
import GroupDetailPage from "@/pages/GroupDetailPage";
import RankingsPage from "@/pages/RankingsPage";
import GroupInvitePage from "@/pages/GroupInvitePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><HomePage /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/eventos",
    element: <ProtectedRoute><EventsPage /></ProtectedRoute>
  },
  {
    path: "/eventos/:id",
    element: <ProtectedRoute><EventDetail /></ProtectedRoute>
  },
  {
    path: "/criar",
    element: <ProtectedRoute><CreateEvent /></ProtectedRoute>
  },
  {
    path: "/calculadora",
    element: <ProtectedRoute><CostCalculatorPage /></ProtectedRoute>
  },
  {
    path: "/notificacoes",
    element: <ProtectedRoute><Notifications /></ProtectedRoute>
  },
  {
    path: "/agenda",
    element: <ProtectedRoute><CalendarView /></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminPage /></AdminRoute>
  },
  {
    path: "/perfil/:userId",
    element: <ProtectedRoute><UserProfile /></ProtectedRoute>
  },
  {
    path: "/perfil",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/acessibilidade",
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: "/explorar",
    element: <ProtectedRoute><ExplorePage /></ProtectedRoute>
  },
  {
    path: "/grupos",
    element: <ProtectedRoute><GroupsPage /></ProtectedRoute>
  },
  {
    path: "/grupos/:id",
    element: <ProtectedRoute><GroupDetailPage /></ProtectedRoute>
  },
  {
    path: "/rankings/:type",
    element: <ProtectedRoute><RankingsPage /></ProtectedRoute>
  },
  {
    path: "/rankings",
    element: <ProtectedRoute><RankingsPage /></ProtectedRoute>
  },
  {
    path: "/convite/:code",
    element: <GroupInvitePage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
