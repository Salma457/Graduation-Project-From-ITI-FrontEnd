import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const EmployerRoute = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const isAuthenticated = user && user.id;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'employer') {
    // Use `replace` to avoid the back-button trap.
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default EmployerRoute;