// components/auth/EmployerRoute.jsx
import ProtectedRoute from './ProtectedRoute';

const EmployerRoute = () => {
  return <ProtectedRoute allowedRoles={['employer']} />;
};

export default EmployerRoute;