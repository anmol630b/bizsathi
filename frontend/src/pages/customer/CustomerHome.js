import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiPackage, FiMapPin, FiLogOut, FiUser, FiMenu, FiX, FiArrowRight, FiStar, FiShoppingBag } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CustomerHome = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const [featuredStores, setFeaturedStores] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/auth/me').then(res => setUserData(res.data.user)).catch(() => {});
    api.get('/stores/featured').then(res => setFeaturedStores(res.data.stores || [])).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  const categories = [
    { name: 'Grocery', emoji: '🛒', color: '#00C896', bg: 'rgba(0,200,150,0.08)' },
    { name: 'Restaurant', emoji: '🍕', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
    { name: 'Pharmacy', emoji: '💊', color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
    { name: 'Salon', emoji: '💇', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { name: 'Gym', emoji: '💪', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
    { name: 'Coaching', emoji: '📚', color: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
    { name: 'Shop', emoji: '🏪', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { name: 'Other', emoji: '✨', color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.97)' : 'white', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: '1px solid #F1F5F9', padding: '0 6%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.3s' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px' }}>B</div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '18px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
        </Link>

        <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input placeholder="Search stores, products..." onClick={() => navigate('/stores')} readOnly style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #F1F5F9', borderRadius: '12px', fontSize: '13px', background: '#F8FAFC', cursor: 'pointer', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', color: '#64748B' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/customer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: '#F8FAFC', border: '1.5px solid #F1F5F9', fontSize: '13px', color: '#475569', textDecoration: 'none', fontWeight: '600' }}>
            <FiUser size={14} /> My Account
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', fontSize: '13px', color: '#EF4444', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 6% 60px', background: 'linear-gradient(160deg, #F0FDF9 0%, #EEF2FF 60%, #F8FAFC 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.18)', color: '#00A87E', padding: '7px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
            👋 Welcome back, {user?.name?.split(' ')[0]}!
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.1' }}>
            Discover Local<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Businesses Near You</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.7', marginBottom: '36px' }}>
            Shop from local stores, order on WhatsApp, and support your community.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 8px 25px rgba(0,200,150,0.3)' }}>
              <FiSearch size={16} /> Find Stores
            </Link>
            <Link to="/customer/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#334155', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', border: '1.5px solid #E2E8F0' }}>
              My Dashboard <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '0 6%', marginTop: '-24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Orders Placed', value: userData?.orderHistory?.length || 0, icon: '📦', color: '#00C896', bg: 'white', path: '/customer/dashboard' },
            { label: 'Favourite Stores', value: userData?.favouriteStores?.length || 0, icon: '❤️', color: '#EF4444', bg: 'white', path: '/customer/dashboard' },
            { label: 'Saved Addresses', value: userData?.savedAddresses?.length || 0, icon: '📍', color: '#6366F1', bg: 'white', path: '/customer/dashboard' },
          ].map((stat, i) => (
            <Link key={i} to={stat.path} style={{ background: stat.bg, borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'; }}>
              <div style={{ width: '48px', height: '48px', background: `${stat.color}12`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500', marginTop: '2px' }}>{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 6%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>Browse Categories</h2>
            <Link to="/stores" style={{ fontSize: '13px', color: '#00C896', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View All <FiArrowRight size={13} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/stores?category=${cat.name.toLowerCase()}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = cat.bg; e.currentTarget.style.borderColor = cat.color + '30'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textAlign: 'center' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section style={{ padding: '0 6% 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>Featured Stores</h2>
            <Link to="/stores" style={{ fontSize: '13px', color: '#00C896', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>See All <FiArrowRight size={13} /></Link>
          </div>

          {featuredStores.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🏪</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>Explore Local Stores</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Discover amazing businesses in your area</p>
              <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 14px rgba(0,200,150,0.3)' }}>
                <FiSearch size={15} /> Find Stores Near Me
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {featuredStores.map((store, i) => (
                <Link key={i} to={`/store/${store.slug}`} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F1F5F9', textDecoration: 'none', transition: 'all 0.2s', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ height: '120px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {store.logo ? (
                      <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${store.logo}`} alt={store.name} style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '26px' }}>
                        {store.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{store.name}</h3>
                    {store.address?.city && (
                      <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                        <FiMapPin size={11} /> {store.address.city}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(0,200,150,0.08)', color: '#00A87E', padding: '3px 10px', borderRadius: '99px', fontWeight: '600', textTransform: 'capitalize' }}>{store.category}</span>
                      <span style={{ fontSize: '12px', color: '#00C896', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>Visit <FiArrowRight size={11} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: '0 6% 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '24px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { icon: '🗺️', title: 'Find Stores', desc: 'Discover local businesses', path: '/stores', color: '#00C896' },
              { icon: '📦', title: 'My Orders', desc: 'View order history', path: '/customer/dashboard', color: '#6366F1' },
              { icon: '❤️', title: 'Favourites', desc: 'Your saved stores', path: '/customer/dashboard', color: '#EF4444' },
              { icon: '📍', title: 'Addresses', desc: 'Manage delivery addresses', path: '/customer/dashboard', color: '#F59E0B' },
            ].map((action, i) => (
              <Link key={i} to={action.path} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9', textDecoration: 'none', transition: 'all 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = action.color + '30'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{action.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{action.title}</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '28px 6%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '15px', color: 'white' }}>BizSathi</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>2024 BizSathi — Made with love in India</p>
          <Link to="/stores" style={{ fontSize: '13px', color: '#00C896', fontWeight: '600', textDecoration: 'none' }}>Find Stores →</Link>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHome;
