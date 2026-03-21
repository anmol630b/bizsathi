import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiShoppingBag, FiShoppingCart, FiUsers,
  FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
  FiGlobe, FiZap, FiBell, FiChevronRight
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/dashboard/products', icon: FiShoppingBag, label: 'Products' },
  { path: '/dashboard/orders', icon: FiShoppingCart, label: 'Orders', badge: 'New' },
  { path: '/dashboard/customers', icon: FiUsers, label: 'Customers' },
  { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

const SIDEBAR_WIDTH = 256;
const MOBILE_BREAKPOINT = 900;

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [business, setBusiness] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/business/my')
      .then(res => setBusiness(res.data.business))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const planConfig = {
    free: { color: '#64748B', bg: 'rgba(100,116,139,0.12)', label: 'Free' },
    starter: { color: '#00C896', bg: 'rgba(0,200,150,0.12)', label: 'Starter' },
    pro: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', label: 'Pro' },
    enterprise: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Enterprise' }
  };

  const plan = planConfig[user?.plan] || planConfig.free;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 12px rgba(0,200,150,0.3)', flexShrink: 0 }}>B</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>Business Platform</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div style={{ padding: '14px 14px 10px', flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{user?.name}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: plan.bg, color: plan.color, padding: '1px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>
              <FiZap size={7} /> {plan.label}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 8px 6px', marginBottom: '2px' }}>Main Menu</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => isMobile && setSidebarOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', marginBottom: '2px',
              background: isActive ? 'rgba(0,200,150,0.15)' : 'transparent',
              color: isActive ? '#00C896' : 'rgba(255,255,255,0.55)',
              fontWeight: isActive ? '600' : '500',
              fontSize: '13.5px', transition: 'all 0.15s', textDecoration: 'none',
              border: isActive ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
              letterSpacing: '-0.01em'
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
            >
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: '#EF4444', color: 'white', borderRadius: '99px', padding: '1px 6px', fontSize: '9px', fontWeight: '700' }}>{item.badge}</span>}
              {isActive && <FiChevronRight size={12} style={{ opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {business?.isPublished && (
          <a href={`http://localhost:3001/store/${business.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', fontWeight: '600', fontSize: '13px', marginBottom: '4px', textDecoration: 'none', border: '1px solid rgba(0,200,150,0.15)' }}>
            <FiGlobe size={14} /> View My Store
          </a>
        )}
        <Link to="/plans" onClick={() => isMobile && setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#818CF8', fontWeight: '600', fontSize: '13px', marginBottom: '4px', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.15)' }}>
          <FiZap size={14} /> Upgrade Plan
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.35)', fontSize: '13px', width: '100%', cursor: 'pointer', transition: 'all 0.15s', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} />
      )}

      {/* Sidebar — always visible on desktop, slide on mobile */}
      <aside style={{
        width: `${SIDEBAR_WIDTH}px`,
        minWidth: `${SIDEBAR_WIDTH}px`,
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        bottom: isMobile ? 0 : undefined,
        zIndex: isMobile ? 50 : 'auto',
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`) : 'none',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isMobile && sidebarOpen ? '0 0 60px rgba(0,0,0,0.5)' : 'none',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        width: isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH}px)`
      }}>

        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', flexShrink: 0 }}>
                <FiMenu size={16} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', margin: 0 }}>
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '400', margin: 0 }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', position: 'relative', flexShrink: 0 }}>
              <FiBell size={15} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
            </button>

            {business?.isPublished ? (
              <a href={`http://localhost:3001/store/${business.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '12px', color: '#00A87E', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <FiGlobe size={13} /> {!isMobile && 'View Store'}
              </a>
            ) : (
              <Link to="/dashboard/setup" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '12px', color: '#64748B', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <FiGlobe size={13} /> {!isMobile && 'Setup Store'}
              </Link>
            )}

            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0, cursor: isMobile ? 'pointer' : 'default' }}
              onClick={() => isMobile && setSidebarOpen(true)}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
