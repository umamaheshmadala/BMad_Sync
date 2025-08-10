// React import not needed with react-jsx runtime
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';

// Bridge Vite env -> global flag for E2E mock at runtime
try {
  // @ts-ignore
  (globalThis as any).__VITE_E2E_MOCK__ = ((import.meta as any)?.env?.VITE_E2E_MOCK === '1');
} catch {}

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
