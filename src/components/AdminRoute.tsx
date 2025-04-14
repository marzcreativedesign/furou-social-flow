
import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';

const AdminRoute = () => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
