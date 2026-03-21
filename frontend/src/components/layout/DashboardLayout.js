import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiShoppingBag, FiShoppingCart, FiUsers, 
  FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
  FiGlobe, FiZap, FiBell
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/dashboard/products', icon: FiShoppingBag, label: 'Products' },
  { path: '/dashboard/orders', icon: FiShoppingCart, label: 'Orders' },
  { path: '/dashboard/customers', icon: FiUsers, label: 'Customers' },
  { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const planColors = {
    free: '#888780',
    starter: '#1D9E75',
    pro: '#534AB7',
    enterprise: '#D85A30'
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--gray-50)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'white',
        borderRight: '1px solid var(--gray-100)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'transform 0.3s ease',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '16px',
              fontFamily: 'Poppins, sans-serif'
            }}>B</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>BizSathi</div>
              <div style={{ fontSize: '10px', color: 'var(--gray-400)' }}>Business Platform</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--gray-100)',
          background: 'var(--gray-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '600', fontSize: '14px'
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: planColors[user?.plan] + '20',
                color: planColors[user?.plan],
                padding: '1px 8px', borderRadius: '20px',
                fontSize: '10px', fontWeight: '600', textTransform: 'uppercase'
              }}>
                <FiZap size={8} />
                {user?.plan} Plan
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: 'var(--radius)',
                  marginBottom: '2px',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--gray-600)',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '14px',
                  transition: 'all 0.15s',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--gray-50)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <item.icon size={18} />
                {item.label}
                {item.label === 'Orders' && (
                  <span style={{
                    marginLeft: 'auto', background: 'var(--danger)',
                    color: 'white', borderRadius: '20px',
                    padding: '1px 7px', fontSize: '10px', fontWeight: '600'
                  }}>New</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--gray-100)' }}>
          <Link
            to="/plans"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))',
              color: 'var(--primary)', fontWeight: '600', fontSize: '13px',
              marginBottom: '4px', textDecoration: 'none'
            }}
          >
            <FiZap size={16} />
            Upgrade Plan
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--radius)',
              background: 'transparent', border: 'none',
              color: 'var(--gray-500)', fontSize: '14px', width: '100%',
              cursor: 'pointer', transition: 'all 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-500)'; }}
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-100)',
          padding: '0 24px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)' }}>
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--gray-500)'
            }}>
              <FiBell size={18} />
            </button>
            <Link to={`/dashboard/settings`} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)', background: 'white',
              fontSize: '13px', color: 'var(--gray-700)', textDecoration: 'none'
            }}>
              <FiGlobe size={14} />
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
