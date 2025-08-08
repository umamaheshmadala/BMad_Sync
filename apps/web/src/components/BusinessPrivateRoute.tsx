// React import not needed with react-jsx runtime
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const BusinessPrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100"><p>Loading...</p></div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/business-login" replace />;
  }

  return children;
};

export default BusinessPrivateRoute;
