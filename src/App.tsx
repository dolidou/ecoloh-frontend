import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { PublicRoute } from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminEvents from './pages/Admin/Events';
import AdminEventCreate from './pages/Admin/EventCreate';
import AdminEventEdit from './pages/Admin/EventEdit';
import AdminTickets from './pages/Admin/Tickets';
import AdminComplaints from './pages/Admin/Complaints';
import AdminStatistics from './pages/Admin/Statistics';
import AdminCategoryHeroes from './pages/Admin/CategoryHeroes';

function AdminRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <Navigate to="/" replace />
  );
}

export default function App() {
  const { loadFromLocalStorage } = useAuthStore();

  useEffect(() => {
    // Load auth state from localStorage on app start
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />

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

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
        <Route path="/admin/events/create" element={<AdminRoute><AdminEventCreate /></AdminRoute>} />
        <Route path="/admin/events/:id/edit" element={<AdminRoute><AdminEventEdit /></AdminRoute>} />
        <Route path="/admin/category-heroes" element={<AdminRoute><AdminCategoryHeroes /></AdminRoute>} />
        <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
        <Route path="/admin/complaints" element={<AdminRoute><AdminComplaints /></AdminRoute>} />
        <Route path="/admin/statistics" element={<AdminRoute><AdminStatistics /></AdminRoute>} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
