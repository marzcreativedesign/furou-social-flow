
import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import EventsPage from "@/pages/EventsPage";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import CostCalculatorPage from "@/pages/CostCalculatorPage";
import ExplorePage from "@/pages/ExplorePage";
import AgendaPage from "@/pages/AgendaPage";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import AccessibilityPage from "@/pages/AccessibilityPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/eventos",
    element: (
      <ProtectedRoute>
        <EventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/eventos/:id",
    element: (
      <ProtectedRoute>
        <EventDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/criar",
    element: (
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/usuarios/:id",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
  {
    path: "/calculadora",
    element: (
      <ProtectedRoute>
        <CostCalculatorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/explorar",
    element: (
      <ProtectedRoute>
        <ExplorePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agenda",
    element: (
      <ProtectedRoute>
        <AgendaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notificacoes",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/configuracoes",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/acessibilidade",
    element: (
      <ProtectedRoute>
        <AccessibilityPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
