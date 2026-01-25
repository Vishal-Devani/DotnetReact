import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import UserLogin from './pages/UserLogin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Person from './components/person/Person'
import ProtectedRoute from './components/ProtectedRoute'
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isUserAuthenticated, isAdminAuthenticated } = useAuth();

  return (
    <>
      <Navbar />

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
        
        {/* Admin Routes - All under /admin/* */}
        <Route 
          path="admin/login" 
          element={isAdminAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} 
        />
        <Route 
          path="admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/person" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Person />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy route redirects */}
        <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
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