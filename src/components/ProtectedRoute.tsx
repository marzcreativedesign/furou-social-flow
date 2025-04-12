
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Enquanto estamos verificando o estado da autenticação, não fazemos nada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Se não há usuário autenticado, redirecionamos para a página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se há um usuário autenticado, renderizamos o conteúdo protegido
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
