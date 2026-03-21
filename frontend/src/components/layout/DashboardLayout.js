import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiShoppingBag, FiShoppingCart, FiUsers,
  FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
  FiGlobe, FiZap, FiBell, FiChevronRight, FiSearch,
  FiPackage, FiUser, FiTrendingUp
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard', desc: 'Overview & stats' },
  { path: '/dashboard/products', icon: FiShoppingBag, label: 'Products', desc: 'Manage your products' },
  { path: '/dashboard/orders', icon: FiShoppingCart, label: 'Orders', desc: 'View all orders', badge: 'New' },
  { path: '/dashboard/customers', icon: FiUsers, label: 'Customers', desc: 'Customer management' },
  { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics', desc: 'Sales & revenue' },
  { path: '/dashboard/settings', icon: FiSettings, label: 'Settings', desc: 'Account settings' },
];

const MOBILE_BREAKPOINT = 900;

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [business, setBusiness] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
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
    api.get('/business/my').then(res => setBusiness(res.data.business)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (q) => {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        api.get(`/products/my?search=${q}`).catch(() => ({ data: { products: [] } })),
        api.get(`/orders/my?search=${q}`).catch(() => ({ data: { orders: [] } })),
        api.get(`/customers/my?search=${q}`).catch(() => ({ data: { customers: [] } }))
      ]);
      const results = [
        ...((productsRes.data.products || []).slice(0, 3).map(p => ({ type: 'product', icon: FiShoppingBag, color: '#6366F1', title: p.name, subtitle: `₹${p.price}`, path: '/dashboard/products' }))),
        ...((ordersRes.data.orders || []).slice(0, 3).map(o => ({ type: 'order', icon: FiShoppingCart, color: '#00C896', title: `Order #${o.orderNumber}`, subtitle: o.customer?.name, path: '/dashboard/orders' }))),
        ...((customersRes.data.customers || []).slice(0, 3).map(c => ({ type: 'customer', icon: FiUsers, color: '#F59E0B', title: c.name, subtitle: c.phone, path: '/dashboard/customers' })))
      ];
      setSearchResults(results);
    } catch (err) {}
    finally { setSearching(false); }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
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
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 12px rgba(0,200,150,0.3)', flexShrink: 0 }}>B</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>Business Platform</div>
          </div>
        </Link>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div style={{ padding: '14px', flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: plan.bg, color: plan.color, padding: '1px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>
              <FiZap size={7} /> {plan.label}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 8px 6px' }}>Navigation</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => isMobile && setSidebarOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 10px', borderRadius: '10px', marginBottom: '2px',
              background: isActive ? 'rgba(0,200,150,0.12)' : 'transparent',
              color: isActive ? '#00C896' : 'rgba(255,255,255,0.5)',
              fontWeight: isActive ? '600' : '500',
              fontSize: '13.5px', transition: 'all 0.15s', textDecoration: 'none',
              border: isActive ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '1px' }}>{item.desc}</div>
              </div>
              {item.badge && <span style={{ background: '#EF4444', color: 'white', borderRadius: '99px', padding: '1px 6px', fontSize: '9px', fontWeight: '700' }}>{item.badge}</span>}
              {isActive && <FiChevronRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {business?.isPublished && (
          <a href={`http://localhost:3000/store/${business.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(0,200,150,0.08)', color: '#00C896', fontWeight: '600', fontSize: '12px', marginBottom: '6px', textDecoration: 'none', border: '1px solid rgba(0,200,150,0.15)' }}>
            <FiGlobe size={13} /> View My Store
            <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(0,200,150,0.2)', padding: '2px 6px', borderRadius: '99px' }}>LIVE</span>
          </a>
        )}
        <Link to="/plans" onClick={() => isMobile && setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: '#818CF8', fontWeight: '600', fontSize: '12px', marginBottom: '6px', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.15)' }}>
          <FiZap size={13} /> Upgrade Plan
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.3)', fontSize: '12px', width: '100%', cursor: 'pointer', transition: 'all 0.15s', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
          <FiLogOut size={13} /> Logout
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

      {/* Sidebar */}
      <aside style={{
        width: '256px', minWidth: '256px',
        background: '#0F172A',
        display: 'flex', flexDirection: 'column',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0,
        bottom: isMobile ? 0 : undefined,
        zIndex: isMobile ? 50 : 'auto',
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-256px)') : 'none',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0, overflow: 'hidden'
      }}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', flexShrink: 0, gap: '12px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                <FiMenu size={16} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em', margin: 0 }}>
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                {navItems.find(i => i.path === location.pathname)?.desc || 'Welcome back'}
              </p>
            </div>
          </div>

          {/* Global Search */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', zIndex: 1 }} />
              <input
                placeholder="Search products, orders, customers..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #F1F5F9', borderRadius: '10px', fontSize: '13px', outline: 'none', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box', transition: 'all 0.2s' }}
                onFocusCapture={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
                onBlurCapture={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
              />
              {searching && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', border: '2px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && searchQuery && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: 'white', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #F1F5F9', zIndex: 100, overflow: 'hidden' }}>
                {searchResults.length === 0 && !searching ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    {['product', 'order', 'customer'].map(type => {
                      const items = searchResults.filter(r => r.type === type);
                      if (!items.length) return null;
                      return (
                        <div key={type}>
                          <div style={{ padding: '10px 16px 6px', fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {type === 'product' ? 'Products' : type === 'order' ? 'Orders' : 'Customers'}
                          </div>
                          {items.map((result, i) => (
                            <div key={i} onClick={() => { navigate(result.path); setSearchOpen(false); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: result.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: result.color, flexShrink: 0 }}>
                                <result.icon size={14} />
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{result.title}</div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{result.subtitle}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #F8FAFC' }}>
                      <button onClick={() => { setSearchOpen(false); }} style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        Press ESC to close
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', position: 'relative' }}>
              <FiBell size={15} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
            </button>

            {business?.isPublished ? (
              <a href={`http://localhost:3000/store/${business.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '12px', color: '#00A87E', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <FiGlobe size={13} /> {!isMobile && 'My Store'}
              </a>
            ) : (
              <Link to="/dashboard/setup" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '12px', color: '#64748B', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <FiGlobe size={13} /> {!isMobile && 'Setup Store'}
              </Link>
            )}

            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0, cursor: isMobile ? 'pointer' : 'default', boxShadow: '0 4px 10px rgba(0,200,150,0.25)' }}
              onClick={() => isMobile && setSidebarOpen(true)}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
