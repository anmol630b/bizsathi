import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FiArrowRight, FiCheck, FiZap, FiShoppingBag, FiUsers, FiBarChart2, FiSmartphone, FiStar, FiMenu, FiX, FiSearch, FiTrendingUp, FiGlobe, FiShield } from 'react-icons/fi';

const Landing = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: FiSmartphone, color: '#00C896', bg: 'rgba(0,200,150,0.1)', title: 'WhatsApp Orders', desc: 'Customers place orders instantly on WhatsApp. Zero friction, maximum sales every day.' },
    { icon: FiShoppingBag, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', title: 'Product Management', desc: 'Add products, set prices, upload photos in under 2 minutes. Beautiful and intuitive.' },
    { icon: FiUsers, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', title: 'Customer CRM', desc: 'Know your customers deeply. Track orders, spending, and behavior automatically.' },
    { icon: FiBarChart2, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', title: 'Live Analytics', desc: 'Real-time revenue tracking, order trends, and growth insights in one dashboard.' },
    { icon: FiZap, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', title: '5 Min Setup', desc: 'From signup to live store in 5 minutes. No code, no complexity, no headaches.' },
    { icon: FiGlobe, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', title: 'Your Own Store', desc: 'Get a beautiful online store with your own link. Share it anywhere instantly.' }
  ];

  const testimonials = [
    { name: 'Rahul Sharma', business: 'Sharma Electronics', text: 'BizSathi transformed my shop completely. Now I get 50+ orders daily on WhatsApp!', avatar: 'RS', rating: 5, revenue: '+340%' },
    { name: 'Priya Singh', business: 'Priya Beauty Salon', text: 'My customers love booking online. Revenue increased 3x in just 2 months!', avatar: 'PS', rating: 5, revenue: '+280%' },
    { name: 'Amit Kumar', business: 'AK Fitness Gym', text: 'The analytics dashboard is incredible. I know exactly what is working!', avatar: 'AK', rating: 5, revenue: '+195%' }
  ];

  const plans = [
    { name: 'Free', price: '₹0', color: '#64748B', gradient: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', features: ['10 Products', '50 Orders/mo', 'WhatsApp Button', 'Basic Store'], popular: false, cta: 'Start Free' },
    { name: 'Starter', price: '₹299', color: '#00C896', gradient: 'linear-gradient(135deg, #F0FDF9, #DCFCE7)', features: ['50 Products', '500 Orders/mo', 'SEO Tools', 'Analytics'], popular: false, cta: 'Get Starter' },
    { name: 'Pro', price: '₹599', color: '#6366F1', gradient: 'linear-gradient(160deg, #0F172A, #1E293B)', features: ['500 Products', 'Custom Domain', 'WhatsApp Marketing', 'Payment Gateway'], popular: true, cta: 'Get Pro' },
    { name: 'Enterprise', price: '₹999', color: '#F59E0B', gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', features: ['Unlimited', 'API Access', 'Priority Support', 'White Label'], popular: false, cta: 'Contact Us' }
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        padding: '0 5%', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '19px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px rgba(0,200,150,0.35)' }}>B</div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '21px', color: '#0F172A', letterSpacing: '-0.03em' }}>BizSathi</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hide-mobile">
          <Link to="/stores" style={{ fontSize: '14px', color: '#64748B', padding: '8px 14px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
            Find Stores
          </Link>
          <Link to="/plans" style={{ fontSize: '14px', color: '#64748B', padding: '8px 14px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
            Pricing
          </Link>

          {token ? (
            <>
              <Link to={user?.userType === 'business' ? '/dashboard' : '/user/dashboard'} style={{ fontSize: '14px', color: '#64748B', padding: '8px 14px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', marginLeft: '4px' }}>
                {user?.userType === 'business' ? '⚡ Dashboard' : '👤 My Account'}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{ marginLeft: '8px', padding: '8px 18px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '14px', color: '#64748B', padding: '8px 14px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', marginLeft: '4px' }}>Login</Link>
              <Link to="/register-business" style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: '#6366F1', border: '1.5px solid rgba(99,102,241,0.2)', fontSize: '13px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                🏪 Business Account
              </Link>
              <Link to="/register" style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', fontSize: '13px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,200,150,0.3)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,200,150,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,200,150,0.3)'; }}>
                Get Started <FiArrowRight size={13} />
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: '1.5px solid #E2E8F0', color: '#0F172A', padding: '8px', borderRadius: '10px', cursor: 'pointer' }} className="show-mobile">
          {navOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {navOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, background: 'white', borderBottom: '1px solid #F1F5F9', padding: '20px 24px', zIndex: 99, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/stores" onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Find Stores</Link>
          <Link to="/plans" onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Pricing</Link>
          {token ? (
            <>
              <Link to={user?.userType === 'business' ? '/dashboard' : '/user/dashboard'} onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>{user?.userType === 'business' ? 'Dashboard' : 'My Account'}</Link>
              <button onClick={() => { logout(); navigate('/'); setNavOpen(false); }} style={{ padding: '13px 16px', borderRadius: '12px', color: '#EF4444', fontWeight: '600', fontSize: '15px', background: '#FEF2F2', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Login</Link>
              <Link to="/register-business" onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: '#6366F1', fontWeight: '700', fontSize: '15px', textDecoration: 'none', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>🏪 Business Account</Link>
              <Link to="/register" onClick={() => setNavOpen(false)} style={{ padding: '13px 16px', borderRadius: '12px', color: 'white', fontWeight: '700', fontSize: '15px', textDecoration: 'none', background: 'linear-gradient(135deg, #00C896, #00A87E)', textAlign: 'center' }}>Get Started Free →</Link>
            </>
          )}
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 5% 80px', background: 'linear-gradient(145deg, #F0FDF9 0%, #EEF2FF 40%, #FFF7ED 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '8%', right: '12%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12%', left: '8%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid rgba(0,200,150,0.2)', color: '#00A87E', padding: '8px 20px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '36px', boxShadow: '0 4px 16px rgba(0,200,150,0.1)' }}>
            <div style={{ width: '8px', height: '8px', background: '#00C896', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
            🇮🇳 India's #1 Local Business Platform
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: '800', lineHeight: '1.08', color: '#0F172A', marginBottom: '28px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.04em' }}>
            Take Your Business<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896 0%, #6366F1 50%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Online in 5 Minutes
            </span>
          </h1>

          <p style={{ fontSize: '19px', color: '#64748B', lineHeight: '1.75', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', fontWeight: '400' }}>
            Create a stunning store, manage products, and receive orders directly on WhatsApp — no technical skills needed. Join 10,000+ businesses.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '56px' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,200,150,0.35)', transition: 'all 0.3s', letterSpacing: '-0.01em' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,200,150,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,200,150,0.35)'; }}>
              Start For Free <FiArrowRight size={18} />
            </Link>
            <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', color: '#6366F1', padding: '16px 32px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', border: '2px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 16px rgba(99,102,241,0.1)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.1)'; }}>
              🏪 Create Business Account
            </Link>
            <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,23,42,0.05)', color: '#475569', padding: '16px 28px', borderRadius: '14px', fontSize: '16px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.05)'; }}>
              <FiSearch size={16} /> Browse Stores
            </Link>
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['No credit card required', 'Free forever plan', 'Setup in 5 minutes', '10,000+ businesses'].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                <div style={{ width: '20px', height: '20px', background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiCheck size={11} color="#00C896" strokeWidth={3} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ padding: '48px 5%', background: '#0F172A', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '200px', background: 'radial-gradient(ellipse, rgba(0,200,150,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {[
            { value: '10,000+', label: 'Active Stores', icon: '🏪' },
            { value: '5 Min', label: 'Average Setup', icon: '⚡' },
            { value: '₹0', label: 'To Get Started', icon: '💚' },
            { value: '99.9%', label: 'Uptime SLA', icon: '🛡️' }
          ].map((stat, i) => (
            <div key={i} style={{ padding: '20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 5%', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.06)', color: '#6366F1', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid rgba(99,102,241,0.12)' }}>
              ✨ Everything You Need
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: '#0F172A', marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', lineHeight: '1.15' }}>
              All in One Powerful Platform
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: '1.75' }}>
              Everything you need to run and grow your local business — beautifully designed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i}
                style={{ background: activeFeature === i ? f.bg : 'white', borderRadius: '24px', padding: '36px 32px', border: activeFeature === i ? `1.5px solid ${f.color}30` : '1.5px solid #F1F5F9', transition: 'all 0.4s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={() => setActiveFeature(i)}
                onClick={() => setActiveFeature(i)}>
                {activeFeature === i && <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle, ${f.color}15 0%, transparent 70%)`, borderRadius: '50%', transform: 'translate(30px, -30px)', pointerEvents: 'none' }} />}
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: activeFeature === i ? f.bg : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', transition: 'all 0.3s', boxShadow: activeFeature === i ? `0 8px 20px ${f.color}25` : 'none' }}>
                  <f.icon size={26} color={activeFeature === i ? f.color : '#94A3B8'} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: activeFeature === i ? '#0F172A' : '#334155', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em', transition: 'all 0.3s' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.75', margin: 0 }}>{f.desc}</p>
                {activeFeature === i && (
                  <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: f.color, fontSize: '13px', fontWeight: '700' }}>
                    Learn more <FiArrowRight size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 5%', background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,200,150,0.08)', color: '#00A87E', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid rgba(0,200,150,0.15)' }}>
              🚀 Simple Process
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', lineHeight: '1.15' }}>
              Up and Running in 3 Steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: '52px', left: 'calc(16.66% + 20px)', right: 'calc(16.66% + 20px)', height: '2px', background: 'linear-gradient(90deg, #00C896, #6366F1, #F59E0B)', borderRadius: '99px', opacity: 0.3 }} />
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in 30 seconds. No credit card, no commitment.', color: '#00C896', bg: 'rgba(0,200,150,0.1)', emoji: '✍️' },
              { step: '02', title: 'Setup Your Store', desc: 'Add your business details, products, and logo. Takes 5 minutes.', color: '#6366F1', bg: 'rgba(99,102,241,0.1)', emoji: '🏪' },
              { step: '03', title: 'Start Selling', desc: 'Publish your store and receive orders on WhatsApp instantly.', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', emoji: '🚀' }
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '84px', height: '84px', background: step.bg, borderRadius: '24px', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${step.color}20`, boxShadow: `0 8px 24px ${step.color}15`, position: 'relative' }}>
                  <span style={{ fontSize: '36px' }}>{step.emoji}</span>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', background: step.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px', boxShadow: `0 4px 10px ${step.color}40` }}>{step.step}</div>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.75', margin: 0, maxWidth: '240px', marginLeft: 'auto', marginRight: 'auto' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 5%', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.08)', color: '#D97706', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid rgba(245,158,11,0.15)' }}>
              ⭐ Real Stories
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: '1.15' }}>
              Loved by Business Owners
            </h2>
            <p style={{ color: '#64748B', fontSize: '17px' }}>Join thousands of happy business owners across India</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: i === 1 ? 'linear-gradient(160deg, #0F172A, #1E293B)' : 'white', borderRadius: '24px', padding: '32px', border: i === 1 ? 'none' : '1.5px solid #F1F5F9', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', boxShadow: i === 1 ? '0 20px 48px rgba(15,23,42,0.25)' : '0 4px 16px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                {i === 1 && <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={16} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: i === 1 ? 'rgba(0,200,150,0.15)' : 'rgba(0,200,150,0.08)', color: '#00C896', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', border: '1px solid rgba(0,200,150,0.2)' }}>
                  <FiTrendingUp size={11} /> Revenue {t.revenue}
                </div>
                <p style={{ fontSize: '15px', color: i === 1 ? 'rgba(255,255,255,0.75)' : '#475569', lineHeight: '1.8', marginBottom: '24px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,200,150,0.25)' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: i === 1 ? 'white' : '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: i === 1 ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginTop: '2px' }}>{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 5%', background: 'linear-gradient(160deg, #F8FAFC 0%, #EEF2FF 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.06)', color: '#6366F1', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid rgba(99,102,241,0.12)' }}>
              💰 Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: '1.15' }}>
              Simple, Fair Pricing
            </h2>
            <p style={{ color: '#64748B', fontSize: '17px' }}>Start free, upgrade when you grow. No hidden fees.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ background: plan.popular ? 'linear-gradient(160deg, #0F172A, #1E293B)' : 'white', borderRadius: '24px', padding: '32px 24px', textAlign: 'left', border: plan.popular ? 'none' : '1.5px solid #F1F5F9', position: 'relative', transition: 'transform 0.25s, box-shadow 0.25s', boxShadow: plan.popular ? '0 24px 56px rgba(15,23,42,0.25)' : '0 4px 16px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = plan.popular ? '0 32px 64px rgba(15,23,42,0.35)' : '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = plan.popular ? '0 24px 56px rgba(15,23,42,0.25)' : '0 4px 16px rgba(0,0,0,0.04)'; }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00C896, #6366F1)', color: 'white', padding: '5px 18px', borderRadius: '99px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,200,150,0.3)', letterSpacing: '0.02em' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '8px', background: plan.popular ? 'rgba(255,255,255,0.06)' : `${plan.color}10`, marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: plan.popular ? 'rgba(255,255,255,0.6)' : plan.color }}>{plan.name}</span>
                </div>
                <div style={{ fontSize: '38px', fontWeight: '800', color: plan.popular ? 'white' : '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '4px', lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.35)' : '#94A3B8', marginBottom: '28px' }}>/month</div>
                <div style={{ height: '1px', background: plan.popular ? 'rgba(255,255,255,0.06)' : '#F1F5F9', marginBottom: '24px' }} />
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.65)' : '#475569', fontWeight: '500' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: plan.popular ? 'rgba(0,200,150,0.15)' : `${plan.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiCheck size={11} color={plan.popular ? '#00C896' : plan.color} strokeWidth={3} />
                    </div>
                    {f}
                  </div>
                ))}
                <Link to="/register-business" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px', padding: '13px', borderRadius: '14px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', background: plan.popular ? 'linear-gradient(135deg, #00C896, #00A87E)' : 'transparent', color: plan.popular ? 'white' : plan.color, border: plan.popular ? 'none' : `1.5px solid ${plan.color}25`, boxShadow: plan.popular ? '0 6px 20px rgba(0,200,150,0.3)' : 'none', transition: 'all 0.2s' }}>
                  {plan.cta} <FiArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '120px 5%', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(0,200,150,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', color: '#00C896', padding: '8px 20px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
            <div style={{ width: '8px', height: '8px', background: '#00C896', borderRadius: '50%' }} />
            Join 10,000+ businesses today
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: '1.12' }}>
            Ready to Go Online?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', marginBottom: '48px', lineHeight: '1.75', maxWidth: '500px', margin: '0 auto 48px' }}>
            Start free today. No credit card required. Your store can be live in the next 5 minutes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', padding: '18px 36px', borderRadius: '16px', fontWeight: '700', fontSize: '17px', textDecoration: 'none', boxShadow: '0 12px 32px rgba(99,102,241,0.35)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.35)'; }}>
              🏪 Create Business Account
            </Link>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '18px 36px', borderRadius: '16px', fontWeight: '700', fontSize: '17px', textDecoration: 'none', boxShadow: '0 12px 32px rgba(0,200,150,0.3)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,200,150,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,200,150,0.3)'; }}>
              Start Free Today <FiArrowRight size={20} />
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', marginTop: '24px' }}>No credit card required • Free forever plan available • Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#020617', padding: '56px 5% 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px' }}>B</div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '18px', color: 'white' }}>BizSathi</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', lineHeight: '1.75', maxWidth: '280px' }}>India's #1 local business platform. Helping local businesses go online and grow faster.</p>
            </div>
            {[
              { title: 'Product', links: ['Find Stores', 'Pricing', 'Business Account', 'Features'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support'] }
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>{col.title}</div>
                {col.links.map((link, j) => (
                  <a key={j} href="/" style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s', fontWeight: '500' }}
                    onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>© 2024 BizSathi — Made with ❤️ in India</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['🇮🇳 India', '🔒 Secure', '💚 Free'].map((badge, i) => (
                <span key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px', fontWeight: '500' }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
