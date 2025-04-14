
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useEffect, useState } from 'react';

const AdminRoute = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      setIsAuthorized(user !== null && role === 'admin');
    }
  }, [user, role, authLoading, roleLoading]);

  // Show loading state while checking authentication and role
  if (authLoading || roleLoading || isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  // Render admin content if authenticated and authorized
  return <Outlet />;
};

export default AdminRoute;
