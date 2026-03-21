import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome, FiHeart, FiShoppingBag, FiMapPin, FiSettings,
  FiLogOut, FiMenu, FiX, FiUser, FiEdit2, FiCamera,
  FiPlus, FiTrash2, FiStar, FiPhone, FiSearch,
  FiChevronRight, FiPackage, FiGlobe
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const avatarRef = useRef();
  const { logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/auth/me');
      setUserData(res.data.user);
      setProfileData({ name: res.data.user.name, phone: res.data.user.phone });
    } catch (err) {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ avatar: res.data.avatar });
      setUserData({ ...userData, avatar: res.data.avatar });
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error('Could not upload photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const res = await api.put('/auth/update-profile', profileData);
      updateUser(res.data.user);
      setUserData({ ...userData, ...profileData });
      setEditingProfile(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Could not update profile');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city) {
      toast.error('Please fill street and city');
      return;
    }
    try {
      const res = await api.post('/auth/save-address', newAddress);
      setUserData({ ...userData, savedAddresses: res.data.user.savedAddresses });
      setShowAddAddress(false);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
      toast.success('Address saved!');
    } catch (err) {
      toast.error('Could not save address');
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const res = await api.delete(`/auth/delete-address/${index}`);
      setUserData({ ...userData, savedAddresses: res.data.user.savedAddresses });
      toast.success('Address deleted!');
    } catch (err) {
      toast.error('Could not delete address');
    }
  };

  const handleUnfavourite = async (businessId) => {
    try {
      await api.post(`/auth/favourite-store/${businessId}`);
      setUserData({ ...userData, favouriteStores: userData.favouriteStores.filter(s => s._id !== businessId) });
      toast.success('Removed from favourites');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out!');
  };

  const navItems = [
    { id: 'home', icon: FiHome, label: 'Home', desc: 'Overview' },
    { id: 'orders', icon: FiPackage, label: 'My Orders', desc: 'Order history' },
    { id: 'favourites', icon: FiHeart, label: 'Favourites', desc: 'Saved stores' },
    { id: 'addresses', icon: FiMapPin, label: 'Addresses', desc: 'Saved addresses' },
    { id: 'profile', icon: FiUser, label: 'Profile', desc: 'Personal info' },
    { id: 'settings', icon: FiSettings, label: 'Settings', desc: 'Account settings' },
  ];

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '10px',
    fontSize: '14px', color: '#0F172A', background: 'white',
    outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px' }}>B</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Customer Portal</div>
          </div>
        </Link>
        {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '6px', borderRadius: '8px', display: 'flex' }}><FiX size={16} /></button>}
      </div>

      {/* Profile Summary */}
      <div style={{ padding: '16px', flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '60px', margin: '0 auto 10px' }}>
            {userData?.avatar ? (
              <img src={`http://localhost:5000${userData.avatar}`} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,200,150,0.3)' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '22px', border: '3px solid rgba(0,200,150,0.3)' }}>
                {userData?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'white', marginBottom: '3px' }}>{userData?.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>{userData?.email}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>
            👤 Customer
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); isMobile && setSidebarOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px', borderRadius: '10px', marginBottom: '2px',
              background: isActive ? 'rgba(0,200,150,0.12)' : 'transparent',
              color: isActive ? '#00C896' : 'rgba(255,255,255,0.5)',
              border: isActive ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
              textAlign: 'left'
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '1px' }}>{item.desc}</div>
              </div>
              {isActive && <FiChevronRight size={11} style={{ opacity: 0.5 }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Link to="/stores" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(0,200,150,0.08)', color: '#00C896', fontWeight: '600', fontSize: '12px', marginBottom: '6px', textDecoration: 'none', border: '1px solid rgba(0,200,150,0.15)' }}>
          <FiGlobe size={13} /> Find Stores
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.3)', fontSize: '12px', width: '100%', cursor: 'pointer', fontWeight: '500', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
          <FiLogOut size={13} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} />}

      {/* Sidebar */}
      <aside style={{ width: '256px', minWidth: '256px', background: '#0F172A', display: 'flex', flexDirection: 'column', height: '100vh', position: isMobile ? 'fixed' : 'sticky', top: 0, left: 0, bottom: isMobile ? 0 : undefined, zIndex: isMobile ? 50 : 'auto', transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-256px)') : 'none', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', flexShrink: 0, overflow: 'hidden' }}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && <button onClick={() => setSidebarOpen(true)} style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}><FiMenu size={16} /></button>}
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em', margin: 0 }}>
                {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                {navItems.find(i => i.id === activeTab)?.desc}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/stores" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '12px', color: '#00A87E', textDecoration: 'none', fontWeight: '600' }}>
              <FiSearch size={13} /> Find Stores
            </Link>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', cursor: isMobile ? 'pointer' : 'default' }} onClick={() => isMobile && setSidebarOpen(true)}>
              {userData?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="fade-in">
              {/* Welcome */}
              <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '20px', padding: '28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '6px' }}>Welcome back 👋</p>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>{userData?.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Discover and shop from local businesses near you</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Orders Placed', value: userData?.orderHistory?.length || 0, color: '#00C896', bg: 'rgba(0,200,150,0.08)', icon: '📦' },
                  { label: 'Favourite Stores', value: userData?.favouriteStores?.length || 0, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: '❤️' },
                  { label: 'Saved Addresses', value: userData?.savedAddresses?.length || 0, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', icon: '📍' }
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '18px', border: `1px solid ${stat.color}20`, textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Find Stores Near Me', icon: '🗺️', path: '/stores', color: '#00C896' },
                    { label: 'My Order History', icon: '📦', action: () => setActiveTab('orders'), color: '#6366F1' },
                    { label: 'Favourite Stores', icon: '❤️', action: () => setActiveTab('favourites'), color: '#EF4444' },
                    { label: 'Manage Addresses', icon: '📍', action: () => setActiveTab('addresses'), color: '#F59E0B' }
                  ].map((action, i) => (
                    action.path ? (
                      <Link key={i} to={action.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', textDecoration: 'none', border: '1px solid #F1F5F9', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = action.color + '08'; e.currentTarget.style.borderColor = action.color + '20'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                        <span style={{ fontSize: '20px' }}>{action.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{action.label}</span>
                      </Link>
                    ) : (
                      <button key={i} onClick={action.action} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', textAlign: 'left' }}
                        onMouseEnter={e => { e.currentTarget.style.background = action.color + '08'; e.currentTarget.style.borderColor = action.color + '20'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                        <span style={{ fontSize: '20px' }}>{action.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{action.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              {userData?.orderHistory?.length > 0 && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '12px', color: '#00C896', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                  </div>
                  {userData.orderHistory.slice(0, 3).map((order, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(0,200,150,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📦</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{order.businessName}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{order.items?.substring(0, 40)}...</div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#00C896' }}>₹{order.total}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="fade-in">
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #F8FAFC' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order History</h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>All your WhatsApp orders</p>
                </div>
                {!userData?.orderHistory?.length ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📦</div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No orders yet</h4>
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Your order history will appear here</p>
                    <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0F172A', color: 'white', padding: '11px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                      🛒 Shop Now
                    </Link>
                  </div>
                ) : (
                  <div>
                    {userData.orderHistory.map((order, i) => (
                      <div key={i} style={{ padding: '16px 20px', borderBottom: i < userData.orderHistory.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(0,200,150,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📦</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{order.businessName}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>{order.items}</div>
                          <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '3px' }}>{new Date(order.orderedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{order.total}</div>
                          <div style={{ fontSize: '10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: '99px', fontWeight: '600', marginTop: '4px' }}>Ordered</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAVOURITES TAB */}
          {activeTab === 'favourites' && (
            <div className="fade-in">
              {!userData?.favouriteStores?.length ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>❤️</div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No favourite stores yet</h4>
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Save stores you love for quick access</p>
                  <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0F172A', color: 'white', padding: '11px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    🔍 Find Stores
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                  {userData.favouriteStores.map(store => (
                    <div key={store._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div style={{ height: '100px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {store.logo ? (
                          <img src={`http://localhost:5000${store.logo}`} alt={store.name} style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '22px' }}>
                            {store.name?.charAt(0)}
                          </div>
                        )}
                        <button onClick={() => handleUnfavourite(store._id)} style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#EF4444' }}>
                          <FiHeart size={13} fill="#EF4444" />
                        </button>
                      </div>
                      <div style={{ padding: '14px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{store.name}</h3>
                        {store.address?.city && <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}><FiMapPin size={11} />{store.address.city}</p>}
                        <Link to={`/store/${store.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#0F172A', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                          Visit Store
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Saved Addresses</h2>
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>Manage your delivery addresses</p>
                </div>
                <button onClick={() => setShowAddAddress(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  <FiPlus size={14} /> Add Address
                </button>
              </div>

              {!userData?.savedAddresses?.length ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📍</div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No addresses saved</h4>
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Save addresses for faster checkout</p>
                  <button onClick={() => setShowAddAddress(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', padding: '11px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <FiPlus size={14} /> Add Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userData.savedAddresses.map((addr, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', border: `1.5px solid ${addr.isDefault ? '#00C896' : '#F1F5F9'}`, display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', background: addr.isDefault ? 'rgba(0,200,150,0.1)' : '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiMapPin size={16} color={addr.isDefault ? '#00C896' : '#94A3B8'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{addr.label}</span>
                          {addr.isDefault && <span style={{ fontSize: '10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>Default</span>}
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                          {addr.street}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''}{addr.pincode ? ` - ${addr.pincode}` : ''}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteAddress(i)} style={{ width: '32px', height: '32px', background: '#FEF2F2', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {showAddAddress && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}>
                  <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '460px', padding: '28px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Add New Address</h3>
                      <button onClick={() => setShowAddAddress(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #F1F5F9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><FiX size={15} /></button>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Label</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Home', 'Work', 'Other'].map(label => (
                          <button key={label} onClick={() => setNewAddress({...newAddress, label})} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1.5px solid ${newAddress.label === label ? '#0F172A' : '#F1F5F9'}`, background: newAddress.label === label ? '#0F172A' : 'white', color: newAddress.label === label ? 'white' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            {label === 'Home' ? '🏠' : label === 'Work' ? '💼' : '📍'} {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Street Address *</label>
                      <input value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="Street, Area, Locality" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>City *</label>
                        <input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>State</label>
                        <input value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} placeholder="State" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Pincode</label>
                      <input value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} placeholder="6 digit pincode" maxLength={6} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>
                      <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#00C896' }} />
                      Set as default address
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setShowAddAddress(false)} style={{ flex: 1, padding: '13px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                      <button onClick={handleAddAddress} style={{ flex: 2, padding: '13px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save Address</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="fade-in" style={{ maxWidth: '600px' }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', marginBottom: '16px' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ position: 'relative' }}>
                    {userData?.avatar ? (
                      <img src={`http://localhost:5000${userData.avatar}`} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F1F5F9' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '28px', border: '3px solid #F1F5F9' }}>
                        {userData?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <input type="file" ref={avatarRef} accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    <button onClick={() => avatarRef.current.click()} disabled={avatarUploading} style={{ position: 'absolute', bottom: '0', right: '0', width: '26px', height: '26px', background: '#0F172A', border: '2px solid white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {avatarUploading ? <div style={{ width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <FiCamera size={11} />}
                    </button>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{userData?.name}</h3>
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>{userData?.email}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,200,150,0.08)', color: '#00C896', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700' }}>
                      👤 Customer Account
                    </span>
                  </div>
                </div>

                {/* Edit Profile */}
                {editingProfile ? (
                  <div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Full Name</label>
                      <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Phone Number</label>
                      <input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} style={inputStyle} maxLength={10} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setEditingProfile(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                      <button onClick={handleProfileSave} style={{ flex: 2, padding: '12px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {[
                      { label: 'Full Name', value: userData?.name, icon: '👤' },
                      { label: 'Email', value: userData?.email, icon: '📧' },
                      { label: 'Phone', value: userData?.phone, icon: '📱' },
                      { label: 'Member Since', value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-', icon: '📅' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
                        <span style={{ fontSize: '18px', width: '32px', textAlign: 'center' }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginTop: '2px' }}>{item.value || '-'}</div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setEditingProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '12px 20px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      <FiEdit2 size={14} /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="fade-in" style={{ maxWidth: '600px' }}>
              <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                {[
                  { icon: '🔔', title: 'Notifications', desc: 'Manage your notification preferences', action: () => toast.success('Coming soon!') },
                  { icon: '🔒', title: 'Change Password', desc: 'Update your account password', action: () => toast.success('Coming soon!') },
                  { icon: '🛡️', title: 'Privacy Settings', desc: 'Control your data and privacy', action: () => toast.success('Coming soon!') },
                  { icon: '🌐', title: 'Language', desc: 'English', action: () => toast.success('Coming soon!') },
                  { icon: '📱', title: 'App Version', desc: 'BizSathi v1.0.0', action: null },
                ].map((item, i, arr) => (
                  <div key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px', borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none', cursor: item.action ? 'pointer' : 'default', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (item.action) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <span style={{ fontSize: '22px', width: '36px', textAlign: 'center' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    {item.action && <FiChevronRight size={16} color="#CBD5E1" />}
                  </div>
                ))}
              </div>

              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', width: '100%', padding: '16px 20px', background: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FEE2E2', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', justifyContent: 'center' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
