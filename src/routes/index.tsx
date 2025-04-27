
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '@/pages/Home';
import EventsPage from '@/pages/EventsPage';
import EventDetail from '@/pages/EventDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import CreateEvent from '@/pages/CreateEvent';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      
      <Route element={<PrivateRoute />}>
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
