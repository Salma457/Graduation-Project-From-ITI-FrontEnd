// components/auth/AdminRoute.jsx
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = () => {
  return <ProtectedRoute allowedRoles={['admin']} />;
};

export default AdminRoute;