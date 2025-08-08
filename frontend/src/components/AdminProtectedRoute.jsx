// components/AdminProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login/admin" />;
};

export default AdminProtectedRoute;
