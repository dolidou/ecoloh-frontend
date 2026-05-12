import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import { PublicRoute } from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const { loadFromLocalStorage } = useAuthStore();

  useEffect(() => {
    // Load auth state from localStorage on app start
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Home />} />

          {/* Auth routes - redirect if authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
