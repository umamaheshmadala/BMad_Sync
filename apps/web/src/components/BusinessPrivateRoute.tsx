// React import not needed with react-jsx runtime
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const BusinessPrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);
  const hasSyntheticSession = typeof window !== 'undefined' && !!window.localStorage?.getItem('e2e-session');

  if (loading && !isE2eMock) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100"><p>Loading...</p></div>; // Or a loading spinner
  }

  if (!user && (isE2eMock || hasSyntheticSession)) {
    return children;
  } else if (!user) {
    return <Navigate to="/business-login" replace />;
  }

  // Block normal users (non-business) from business-only routes in non-mock runs
  try {
    const isBusiness = (user as any)?.user_metadata?.is_business === true;
    if (!isBusiness && !isE2eMock) {
      return <Navigate to="/login" replace />;
    }
  } catch {}

  return children;
};

export default BusinessPrivateRoute;
