import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/signup';
import Login from './pages/login';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import './App.css';
import BusinessSignUp from './pages/business-signup';
import BusinessLogin from './pages/business-login';
import BusinessPrivateRoute from './components/BusinessPrivateRoute';
import OnboardingCityInterests from './pages/onboarding-city-interests';
import EditUserCityInterests from './pages/edit-user-city-interests';
import Dashboard from './pages/dashboard';
import OnboardingRoute from './components/OnboardingRoute';

function App() {
  const { user, loading, logout, onboardingComplete } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <Router>
      <nav className="bg-card text-card-foreground border-b border-border p-4 shadow-sm">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors duration-200">Sign Up</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors duration-200">Login</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <span className="text-muted-foreground">Hello, {user.email}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="py-1 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200">Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="flex-grow p-4 md:p-8 bg-background text-foreground min-h-screen">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business-signup" element={<BusinessSignUp />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route
            path="/onboarding-city-interests"
            element={
              <OnboardingRoute>
                <OnboardingCityInterests />
              </OnboardingRoute>
            }
          />
          <Route
            path="/edit-profile/city-interests"
            element={
              <PrivateRoute>
                <EditUserCityInterests />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/business-dashboard"
            element={
              <BusinessPrivateRoute>
                <h1>Business Dashboard (Protected)</h1>
              </BusinessPrivateRoute>
            }
          />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
