// React import not needed with react-jsx runtime
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, onboardingComplete } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100"><p>Loading...</p></div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding-city-interests" replace />;
  }

  return children;
};

export default PrivateRoute;