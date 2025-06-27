// components/auth/PublicRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoaderOverlay from '../LoaderOverlay';

const PublicRoute = () => {
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.user.isLoading);

  if (isLoading) {
    return <LoaderOverlay />;
  }

  if (user) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin' : 
                        user.role === 'employer' ? '/employer' : '/itian';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;