import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/dashboard/Dashboard';
import BusinessSetup from './pages/dashboard/BusinessSetup';
import Products from './pages/dashboard/Products';
import Orders from './pages/dashboard/Orders';
import Customers from './pages/dashboard/Customers';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Plans from './pages/Plans';
import Store from './pages/store/Store';
import StoreFinder from './pages/StoreFinder';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, requiredType }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (requiredType && user?.userType !== requiredType) {
    return <Navigate to={user?.userType === 'customer' ? '/customer/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return children;
  return <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontSize: '14px', padding: '12px 16px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#00C896', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } }
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/stores" element={<StoreFinder />} />
        <Route path="/store/:slug" element={<Store />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Auth */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Seller Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute requiredType="seller"><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/setup" element={<ProtectedRoute requiredType="seller"><BusinessSetup /></ProtectedRoute>} />
        <Route path="/dashboard/products" element={<ProtectedRoute requiredType="seller"><Products /></ProtectedRoute>} />
        <Route path="/dashboard/orders" element={<ProtectedRoute requiredType="seller"><Orders /></ProtectedRoute>} />
        <Route path="/dashboard/customers" element={<ProtectedRoute requiredType="seller"><Customers /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute requiredType="seller"><Analytics /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute requiredType="seller"><Settings /></ProtectedRoute>} />

        {/* Customer Dashboard */}
        <Route path="/customer/dashboard" element={<ProtectedRoute requiredType="customer"><CustomerDashboard /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
