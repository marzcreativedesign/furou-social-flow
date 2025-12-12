
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import EventsPage from "@/pages/EventsPage";
import EventDetail from "@/pages/EventDetail";
import CreateEvent from "@/pages/CreateEvent";
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
    element: <Navigate to="/eventos" replace />,
  },
  {
    path: "/login",
    element: <Navigate to="/eventos" replace />,
  },
  {
    path: "/eventos",
    element: <EventsPage />,
  },
  {
    path: "/eventos/:id",
    element: <EventDetail />,
  },
  {
    path: "/criar",
    element: <CreateEvent />,
  },
  {
    path: "/perfil",
    element: <Profile />,
  },
  {
    path: "/usuarios/:id",
    element: <UserProfile />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/calculadora",
    element: <CostCalculatorPage />,
  },
  {
    path: "/explorar",
    element: <ExplorePage />,
  },
  {
    path: "/agenda",
    element: <AgendaPage />,
  },
  {
    path: "/notificacoes",
    element: <Notifications />,
  },
  {
    path: "/configuracoes",
    element: <Settings />,
  },
  {
    path: "/acessibilidade",
    element: <AccessibilityPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
