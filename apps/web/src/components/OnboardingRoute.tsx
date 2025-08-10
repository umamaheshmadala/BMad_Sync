// React import not needed with react-jsx runtime
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, onboardingComplete } = useAuth();
  const location = useLocation();
  const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

  if (loading && !isE2eMock) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100"><p>Loading...</p></div>;
  }

  if (!user && !isE2eMock) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If onboarding already complete, send to dashboard instead of showing onboarding again
  if (onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OnboardingRoute;

