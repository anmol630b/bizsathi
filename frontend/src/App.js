import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterBusiness from './pages/auth/RegisterBusiness';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import UserDashboard from './pages/user/UserDashboard';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

const SmartHome = () => <Landing />;

const BusinessRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.userType !== 'business') return <Navigate to="/" replace />;
  return children;
};

const UserRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.userType === 'business') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return children;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.userType === 'business') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontSize: '14px', padding: '12px 16px', fontFamily: 'Inter, sans-serif' }, success: { iconTheme: { primary: '#00C896', secondary: '#fff' } }, error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } } }} />
      <Routes>
        <Route path="/" element={<SmartHome />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/stores" element={<StoreFinder />} />
        <Route path="/store/:slug" element={<Store />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/register-business" element={<PublicRoute><RegisterBusiness /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
        <Route path="/dashboard" element={<BusinessRoute><Dashboard /></BusinessRoute>} />
        <Route path="/dashboard/setup" element={<BusinessRoute><BusinessSetup /></BusinessRoute>} />
        <Route path="/dashboard/products" element={<BusinessRoute><Products /></BusinessRoute>} />
        <Route path="/dashboard/orders" element={<BusinessRoute><Orders /></BusinessRoute>} />
        <Route path="/dashboard/customers" element={<BusinessRoute><Customers /></BusinessRoute>} />
        <Route path="/dashboard/analytics" element={<BusinessRoute><Analytics /></BusinessRoute>} />
        <Route path="/dashboard/settings" element={<BusinessRoute><Settings /></BusinessRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
