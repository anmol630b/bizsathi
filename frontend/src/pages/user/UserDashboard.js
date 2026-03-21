import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiHeart, FiPackage, FiMapPin, FiSettings, FiLogOut, FiMenu, FiX, FiUser, FiSearch, FiChevronRight, FiEdit2, FiCamera, FiTrash2, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
  const avatarRef = useRef();
  const { logout, updateUser, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
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

  const handleLogout = () => { logout(); toast.success('Logged out!'); navigate('/'); };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/auth/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: res.data.avatar });
      setUserData({ ...userData, avatar: res.data.avatar });
      toast.success('Photo updated!');
    } catch (err) { toast.error('Could not upload photo'); }
  };

  const handleProfileSave = async () => {
    try {
      const res = await api.put('/auth/update-profile', profileData);
      updateUser(res.data.user);
      setUserData({ ...userData, ...profileData });
      setEditingProfile(false);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Could not update'); }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city) { toast.error('Please fill street and city'); return; }
    try {
      const res = await api.post('/auth/save-address', newAddress);
      setUserData({ ...userData, savedAddresses: res.data.user.savedAddresses });
      setShowAddAddress(false);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
      toast.success('Address saved!');
    } catch (err) { toast.error('Could not save'); }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const res = await api.delete(`/auth/delete-address/${index}`);
      setUserData({ ...userData, savedAddresses: res.data.user.savedAddresses });
      toast.success('Deleted!');
    } catch (err) { toast.error('Could not delete'); }
  };

  const handleUnfavourite = async (businessId) => {
    try {
      await api.post(`/auth/favourite-store/${businessId}`);
      setUserData({ ...userData, favouriteStores: userData.favouriteStores.filter(s => s._id !== businessId) });
      toast.success('Removed!');
    } catch (err) { toast.error('Error'); }
  };

  const navItems = [
    { id: 'home', icon: FiHome, label: 'Home', desc: 'Overview', color: '#00C896' },
    { id: 'orders', icon: FiPackage, label: 'My Orders', desc: 'Order history', color: '#6366F1' },
    { id: 'favourites', icon: FiHeart, label: 'Favourites', desc: 'Saved stores', color: '#EF4444' },
    { id: 'addresses', icon: FiMapPin, label: 'Addresses', desc: 'Delivery addresses', color: '#F59E0B' },
    { id: 'profile', icon: FiUser, label: 'Profile', desc: 'Personal info', color: '#8B5CF6' },
    { id: 'settings', icon: FiSettings, label: 'Settings', desc: 'Account settings', color: '#64748B' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: '#94A3B8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading your dashboard...</p>
    </div>
  );

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', color: '#0F172A', background: 'white', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'all 0.2s' };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '17px', boxShadow: '0 4px 12px rgba(0,200,150,0.25)' }}>B</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>My Account</div>
          </div>
        </Link>
        {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '6px', borderRadius: '8px', display: 'flex' }}><FiX size={16} /></button>}
      </div>

      {/* User Card */}
      <div style={{ padding: '16px', flexShrink: 0 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,200,150,0.1), rgba(99,102,241,0.1))', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', width: '60px', margin: '0 auto 10px' }}>
            {userData?.avatar ? (
              <img src={`${API_URL}${userData.avatar}`} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,200,150,0.4)' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '22px', border: '3px solid rgba(0,200,150,0.4)', boxShadow: '0 4px 16px rgba(0,200,150,0.3)' }}>
                {userData?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '18px', height: '18px', background: '#00C896', borderRadius: '50%', border: '2px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
            </div>
          </div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'white', marginBottom: '2px' }}>{userData?.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{userData?.email}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,200,150,0.15)', color: '#00C896', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>
            👤 Customer
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 8px 6px' }}>Menu</div>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); isMobile && setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '12px', marginBottom: '3px', background: isActive ? `${item.color}15` : 'transparent', color: isActive ? item.color : 'rgba(255,255,255,0.45)', border: isActive ? `1px solid ${item.color}25` : '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: isActive ? `${item.color}20` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '1px' }}>{item.desc}</div>
              </div>
              {isActive && <FiChevronRight size={12} style={{ opacity: 0.6, flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Link to="/stores" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(0,200,150,0.08)', color: '#00C896', fontWeight: '600', fontSize: '12px', marginBottom: '6px', textDecoration: 'none', border: '1px solid rgba(0,200,150,0.15)', transition: 'all 0.2s' }}>
          <FiSearch size={13} /> Find Stores
          <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(0,200,150,0.2)', padding: '2px 6px', borderRadius: '99px' }}>EXPLORE</span>
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.3)', fontSize: '12px', width: '100%', cursor: 'pointer', fontWeight: '500', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'transparent'; }}>
          <FiLogOut size={13} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F1F5F9', fontFamily: 'Inter, sans-serif' }}>
      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 40, backdropFilter: 'blur(4px)' }} />}

      <aside style={{ width: '260px', minWidth: '260px', background: '#0F172A', display: 'flex', flexDirection: 'column', height: '100vh', position: isMobile ? 'fixed' : 'sticky', top: 0, left: 0, zIndex: isMobile ? 50 : 'auto', transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-260px)') : 'none', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', flexShrink: 0, overflow: 'hidden', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}>
        <SidebarContent />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', flexShrink: 0, gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                <FiMenu size={17} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', margin: 0 }}>
                {navItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontWeight: '500' }}>
                {navItems.find(i => i.id === activeTab)?.desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link to="/stores" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '13px', color: '#00A87E', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s' }}>
              <FiSearch size={13} /> {!isMobile && 'Find Stores'}
            </Link>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(0,200,150,0.25)', cursor: isMobile ? 'pointer' : 'default' }} onClick={() => isMobile && setSidebarOpen(true)}>
              {userData?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="fade-in">
              {/* Welcome Banner */}
              <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '24px', padding: '32px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30px', right: '100px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Welcome back 👋</p>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>{userData?.name}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Discover amazing local businesses near you</p>
                  </div>
                  <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '12px 22px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 16px rgba(0,200,150,0.35)', whiteSpace: 'nowrap' }}>
                    <FiSearch size={15} /> Find Stores
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Orders', value: userData?.orderHistory?.length || 0, color: '#00C896', bg: 'rgba(0,200,150,0.08)', icon: '📦', tab: 'orders' },
                  { label: 'Favourites', value: userData?.favouriteStores?.length || 0, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: '❤️', tab: 'favourites' },
                  { label: 'Addresses', value: userData?.savedAddresses?.length || 0, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', icon: '📍', tab: 'addresses' }
                ].map((stat, i) => (
                  <button key={i} onClick={() => setActiveTab(stat.tab)} style={{ background: 'white', borderRadius: '20px', padding: '20px', border: `1.5px solid ${stat.color}15`, textAlign: 'center', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}20`; e.currentTarget.style.borderColor = `${stat.color}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = `${stat.color}15`; }}>
                    <div style={{ width: '48px', height: '48px', background: stat.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>{stat.label}</div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Browse All Stores', icon: '🗺️', path: '/stores', color: '#00C896' },
                    { label: 'My Order History', icon: '📦', tab: 'orders', color: '#6366F1' },
                    { label: 'Favourite Stores', icon: '❤️', tab: 'favourites', color: '#EF4444' },
                    { label: 'Saved Addresses', icon: '📍', tab: 'addresses', color: '#F59E0B' }
                  ].map((action, i) => (
                    action.path ? (
                      <Link key={i} to={action.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '14px', textDecoration: 'none', border: '1.5px solid #F1F5F9', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.borderColor = `${action.color}25`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <div style={{ width: '40px', height: '40px', background: `${action.color}12`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{action.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{action.label}</span>
                        <FiArrowRight size={13} color="#CBD5E1" style={{ marginLeft: 'auto' }} />
                      </Link>
                    ) : (
                      <button key={i} onClick={() => setActiveTab(action.tab)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1.5px solid #F1F5F9', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', textAlign: 'left' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.borderColor = `${action.color}25`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <div style={{ width: '40px', height: '40px', background: `${action.color}12`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{action.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{action.label}</span>
                        <FiArrowRight size={13} color="#CBD5E1" style={{ marginLeft: 'auto' }} />
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="fade-in">
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '22px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>Order History</h3>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>All your WhatsApp orders</p>
                  </div>
                  <div style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>
                    {userData?.orderHistory?.length || 0} orders
                  </div>
                </div>
                {!userData?.orderHistory?.length ? (
                  <div style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.08)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>📦</div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No orders yet</h4>
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Your order history will appear here</p>
                    <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 14px rgba(0,200,150,0.3)' }}>
                      🛒 Start Shopping
                    </Link>
                  </div>
                ) : (
                  userData.orderHistory.map((order, i) => (
                    <div key={i} style={{ padding: '18px 24px', borderBottom: i < userData.orderHistory.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(0,200,150,0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📦</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>{order.businessName}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{order.items?.substring(0, 50)}{order.items?.length > 50 ? '...' : ''}</div>
                        <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '3px' }}>{new Date(order.orderedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{order.total}</div>
                        <div style={{ fontSize: '10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: '99px', fontWeight: '700', marginTop: '4px', display: 'inline-block' }}>Ordered</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* FAVOURITES TAB */}
          {activeTab === 'favourites' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>Favourite Stores</h2>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>Stores you love, saved for quick access</p>
                </div>
                <Link to="/stores" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '10px 18px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,200,150,0.25)' }}>
                  <FiSearch size={13} /> Find More
                </Link>
              </div>
              {!userData?.favouriteStores?.length ? (
                <div style={{ background: 'white', borderRadius: '20px', padding: '64px 20px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.08)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>❤️</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No favourites yet</h4>
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Heart stores you love to save them here</p>
                  <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F172A', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>🔍 Discover Stores</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {userData.favouriteStores.map(store => (
                    <div key={store._id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                      <div style={{ height: '110px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {store.logo ? <img src={`${API_URL}${store.logo}`} alt={store.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /> : <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '24px', boxShadow: '0 4px 12px rgba(0,200,150,0.25)' }}>{store.name?.charAt(0)}</div>}
                        <button onClick={() => handleUnfavourite(store._id)} style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#EF4444', transition: 'all 0.2s' }}>
                          <FiHeart size={14} fill="#EF4444" />
                        </button>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{store.name}</h3>
                        {store.address?.city && <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}><FiMapPin size={11} />{store.address.city}</p>}
                        <Link to={`/store/${store.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                          Visit Store <FiArrowRight size={12} />
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
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>Saved Addresses</h2>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>Manage your delivery addresses</p>
                </div>
                <button onClick={() => setShowAddAddress(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <FiPlus size={14} /> Add Address
                </button>
              </div>
              {!userData?.savedAddresses?.length ? (
                <div style={{ background: 'white', borderRadius: '20px', padding: '64px 20px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(245,158,11,0.08)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>📍</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>No addresses saved</h4>
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Save addresses for faster checkout</p>
                  <button onClick={() => setShowAddAddress(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <FiPlus size={14} /> Add First Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userData.savedAddresses.map((addr, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: `1.5px solid ${addr.isDefault ? '#00C896' : '#E2E8F0'}`, display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: addr.isDefault ? '0 4px 16px rgba(0,200,150,0.1)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
                      <div style={{ width: '44px', height: '44px', background: addr.isDefault ? 'rgba(0,200,150,0.1)' : '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiMapPin size={18} color={addr.isDefault ? '#00C896' : '#94A3B8'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{addr.label}</span>
                          {addr.isDefault && <span style={{ fontSize: '10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>Default</span>}
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
                          {addr.street}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''}{addr.pincode ? ` - ${addr.pincode}` : ''}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteAddress(i)} style={{ width: '34px', height: '34px', background: '#FEF2F2', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showAddAddress && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ background: 'white', borderRadius: '28px', width: '100%', maxWidth: '480px', padding: '32px', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>Add New Address</h3>
                        <p style={{ fontSize: '13px', color: '#94A3B8' }}>Save for faster checkout</p>
                      </div>
                      <button onClick={() => setShowAddAddress(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #F1F5F9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><FiX size={16} /></button>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Label</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Home', 'Work', 'Other'].map(label => (
                          <button key={label} onClick={() => setNewAddress({...newAddress, label})} style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: `1.5px solid ${newAddress.label === label ? '#0F172A' : '#F1F5F9'}`, background: newAddress.label === label ? '#0F172A' : 'white', color: newAddress.label === label ? 'white' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                            {label === 'Home' ? '🏠' : label === 'Work' ? '💼' : '📍'} {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Street Address *</label>
                      <input value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="Street, Area, Locality" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>City *</label>
                        <input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>State</label>
                        <input value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} placeholder="State" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pincode</label>
                      <input value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} placeholder="6 digit pincode" maxLength={6} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#475569', marginBottom: '24px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                      <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#00C896' }} />
                      <span style={{ fontWeight: '600' }}>Set as default address</span>
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setShowAddAddress(false)} style={{ flex: 1, padding: '14px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                      <button onClick={handleAddAddress} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>Save Address</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="fade-in" style={{ maxWidth: '640px' }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '28px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ position: 'relative' }}>
                    {userData?.avatar ? (
                      <img src={`${API_URL}${userData.avatar}`} alt="avatar" style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #F1F5F9', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    ) : (
                      <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '32px', border: '4px solid #F1F5F9', boxShadow: '0 4px 16px rgba(0,200,150,0.2)' }}>
                        {userData?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <input type="file" ref={avatarRef} accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    <button onClick={() => avatarRef.current.click()} style={{ position: 'absolute', bottom: '2px', right: '2px', width: '28px', height: '28px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '2px solid white', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      <FiCamera size={12} />
                    </button>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{userData?.name}</h3>
                    <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '10px' }}>{userData?.email}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0,200,150,0.08)', color: '#00C896', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(0,200,150,0.15)' }}>
                      👤 Customer Account
                    </span>
                  </div>
                </div>

                {editingProfile ? (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                      <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Number</label>
                      <input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} style={inputStyle} maxLength={10} onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setEditingProfile(false)} style={{ flex: 1, padding: '13px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                      <button onClick={handleProfileSave} style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {[
                      { label: 'Full Name', value: userData?.name, icon: '👤' },
                      { label: 'Email Address', value: userData?.email, icon: '📧' },
                      { label: 'Phone Number', value: userData?.phone, icon: '📱' },
                      { label: 'Member Since', value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-', icon: '📅' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
                        <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>{item.label}</div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A' }}>{item.value || '-'}</div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setEditingProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', padding: '13px 24px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      <FiEdit2 size={14} /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="fade-in" style={{ maxWidth: '640px' }}>
              <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px' }}>
                {[
                  { icon: '🔔', title: 'Notifications', desc: 'Manage your notification preferences' },
                  { icon: '🔒', title: 'Change Password', desc: 'Update your account password' },
                  { icon: '🛡️', title: 'Privacy Settings', desc: 'Control your data and privacy' },
                  { icon: '🌐', title: 'Language', desc: 'English (India)' },
                  { icon: '📱', title: 'App Version', desc: 'BizSathi v1.0.0' },
                ].map((item, i, arr) => (
                  <div key={i} onClick={() => toast.success('Coming soon!')} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '44px', height: '44px', background: '#F8FAFC', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.desc}</div>
                    </div>
                    <FiChevronRight size={16} color="#CBD5E1" />
                  </div>
                ))}
              </div>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 24px', background: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FEE2E2', borderRadius: '18px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; }}>
                <FiLogOut size={17} /> Sign Out
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
