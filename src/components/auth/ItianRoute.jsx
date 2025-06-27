// components/auth/ItianRoute.jsx
import ProtectedRoute from './ProtectedRoute';

const ItianRoute = () => {
  return <ProtectedRoute allowedRoles={['itian']} />;
};

export default ItianRoute;