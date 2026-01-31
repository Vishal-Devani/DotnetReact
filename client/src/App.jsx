import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import UserLogin from './pages/UserLogin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Person from './components/person/Person'
import AdminLayout from './layouts/AdminLayout'
import UserList from './pages/UserList'
import SystemSettings from './pages/SystemSettings'
import ProtectedRoute from './components/ProtectedRoute'
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isUserAuthenticated, isAdminAuthenticated } = useAuth();
  const location = useLocation();

  // Check if we are in admin section to optionally hide navbar if needed
  // But AdminLayout will handle its own structure
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />

        {/* User Routes */}
        <Route
          path="login"
          element={isUserAuthenticated() ? <Navigate to="/dashboard" replace /> : <UserLogin />}
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requireUser={true}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Login */}
        <Route
          path="admin/login"
          element={isAdminAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
        />

        {/* Admin Protected Routes with Layout */}
        <Route path="admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="person" element={<Person />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        {/* Legacy redirect */}
        <Route
          path="person"
          element={
            <ProtectedRoute>
              <Person />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App