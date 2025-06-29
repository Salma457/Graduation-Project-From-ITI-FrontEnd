import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const isAuthenticated = user && user.id;

  // Case 1: User is not logged in at all.
  if (!isAuthenticated) {
    // Redirect them to the login page, preserving the intended destination.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Case 2: User is logged in, but is not an admin.
  if (user.role !== 'admin') {
    // Use `replace` to avoid the back-button trap.
    return <Navigate to="/unauthorized" replace />;
  }

  // Case 3: User is an authorized admin.
  return <Outlet />;
};

export default AdminRoute;