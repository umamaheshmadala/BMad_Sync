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

function App() {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <span>Hello, {user.email}</span>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-signup" element={<BusinessSignUp />} />
        <Route path="/business-login" element={<BusinessLogin />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <h1>Dashboard (Protected)</h1>
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
        <Route path="/" element={<h1>Welcome!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
