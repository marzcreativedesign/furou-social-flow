
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import EventsPage from '@/pages/EventsPage';
import EventDetail from '@/pages/EventDetail';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import CreateEvent from '@/pages/CreateEvent';
import ProtectedRoute from '@/components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/criar" element={<CreateEvent />} />
        <Route path="/evento/:id" element={<EventDetail />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
