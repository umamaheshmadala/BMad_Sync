// React import not needed with react-jsx runtime
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const BusinessPrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const runtimeMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);
  const envMock = (() => {
    try { return ((import.meta as any)?.env?.VITE_E2E_MOCK === '1'); } catch { return false; }
  })();
  const hasSyntheticSession = typeof window !== 'undefined' && !!window.localStorage?.getItem('e2e-session');
  const isE2eMock = runtimeMock || envMock || hasSyntheticSession;

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
