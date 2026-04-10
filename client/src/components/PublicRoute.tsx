import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  // Si está autenticado, lo enviamos de vuelta al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, permitimos el acceso a las rutas públicas
  return <Outlet />;
}
