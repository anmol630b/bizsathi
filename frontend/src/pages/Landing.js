import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FiArrowRight, FiCheck, FiZap, FiShoppingBag, FiUsers, FiBarChart2, FiSmartphone, FiStar, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Landing = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: FiSmartphone, color: '#00C896', bg: 'rgba(0,200,150,0.08)', title: 'WhatsApp Orders', desc: 'Customers place orders and you receive them instantly on WhatsApp. Zero friction, maximum sales.' },
    { icon: FiShoppingBag, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', title: 'Product Management', desc: 'Add products, set prices, upload photos — all in under 2 minutes.' },
    { icon: FiUsers, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Customer CRM', desc: 'Know your customers deeply. Track orders, spending, and behavior automatically.' },
    { icon: FiBarChart2, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', title: 'Live Analytics', desc: 'Real-time revenue tracking, order trends, and growth insights.' },
    { icon: FiZap, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', title: '5 Min Setup', desc: 'From signup to live store in 5 minutes. No code, no complexity.' },
    { icon: FiStar, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', title: 'Pro Templates', desc: 'Stunning templates for every business — Gym, Shop, Coaching, Restaurant and more.' }
  ];

  const testimonials = [
    { name: 'Rahul Sharma', business: 'Sharma Electronics', text: 'BizSathi transformed my business. Orders on WhatsApp, beautiful website — all for free!', avatar: 'R', rating: 5 },
    { name: 'Priya Singh', business: 'Priya Beauty Salon', text: 'My customers love the online store. Revenue increased 3x in just 2 months!', avatar: 'P', rating: 5 },
    { name: 'Amit Kumar', business: 'AK Fitness Gym', text: 'The analytics dashboard is incredible. I know exactly what is working and what is not.', avatar: 'A', rating: 5 }
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', overflowX: 'hidden' }}>

      {/* Premium Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none', padding: '0 6%', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px', boxShadow: '0 4px 12px rgba(0,200,150,0.3)' }}>B</div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '20px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link to="/stores" style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>Find Stores</Link>
          <Link to="/plans" style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>Pricing</Link>

          {token ? (
            <>
              <Link to={user?.userType === 'business' ? '/dashboard' : '/user/dashboard'} style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>
                {user?.userType === 'business' ? 'Dashboard' : 'My Account'}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', color: '#EF4444', padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', marginLeft: '8px', fontFamily: 'Inter, sans-serif' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>Login</Link>

              {/* Business Account Button - Premium */}
              <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.08)', color: '#6366F1', padding: '9px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', border: '1.5px solid rgba(99,102,241,0.2)', marginLeft: '4px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}>
                🏪 Business Account
              </Link>

              {/* Get Started - Primary */}
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,200,150,0.3)', marginLeft: '4px' }}>
                Get Started <FiArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: '1.5px solid #E2E8F0', color: '#0F172A', padding: '7px', borderRadius: '8px', display: 'none', cursor: 'pointer' }}>
          {navOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {navOpen && (
        <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, background: 'white', borderBottom: '1px solid #F1F5F9', padding: '16px 24px', zIndex: 99, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/stores" onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Find Stores</Link>
          <Link to="/plans" onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Pricing</Link>
          {token ? (
            <>
              <Link to={user?.userType === 'business' ? '/dashboard' : '/user/dashboard'} onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>{user?.userType === 'business' ? 'Dashboard' : 'My Account'}</Link>
              <button onClick={() => { logout(); navigate('/'); setNavOpen(false); }} style={{ padding: '12px 16px', borderRadius: '10px', color: '#EF4444', fontWeight: '600', fontSize: '15px', background: '#FEF2F2', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: '#475569', fontWeight: '500', fontSize: '15px', textDecoration: 'none', background: '#F8FAFC' }}>Login</Link>
              <Link to="/register-business" onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: '#6366F1', fontWeight: '700', fontSize: '15px', textDecoration: 'none', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>🏪 Business Account</Link>
              <Link to="/register" onClick={() => setNavOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', color: 'white', fontWeight: '600', fontSize: '15px', textDecoration: 'none', background: 'linear-gradient(135deg, #00C896, #00A87E)', textAlign: 'center' }}>Get Started Free</Link>
            </>
          )}
        </div>
      )}

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 6% 80px', background: 'linear-gradient(160deg, #F0FDF9 0%, #EEF2FF 50%, #FAFAFA 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.18)', color: '#00A87E', padding: '7px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '32px' }}>
            <div style={{ width: '7px', height: '7px', background: '#00C896', borderRadius: '50%' }} />
            India's #1 Local Business Platform
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', color: '#0F172A', marginBottom: '24px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em' }}>
            Your Business,<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Online in 5 Minutes</span>
          </h1>
          <p style={{ fontSize: '19px', color: '#64748B', lineHeight: '1.7', marginBottom: '44px', maxWidth: '580px', margin: '0 auto 44px', fontWeight: '400' }}>
            Create a stunning store, manage products, and receive orders directly on WhatsApp — no technical skills needed.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px', justifyContent: 'center' }}>
            <Link to="/stores" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#334155', padding: '15px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', border: '1.5px solid #E2E8F0', textDecoration: 'none' }}>
              <FiSearch size={16} /> Browse Stores
            </Link>
            <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', padding: '15px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 8px 25px rgba(99,102,241,0.35)' }}>
              🏪 Create Business Account
            </Link>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '15px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', boxShadow: '0 8px 25px rgba(0,200,150,0.35)', textDecoration: 'none' }}>
              Get Started Free <FiArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['No credit card required', 'Free forever plan', 'Setup in 5 minutes'].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                <div style={{ width: '18px', height: '18px', background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiCheck size={10} color="#00C896" strokeWidth={3} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '64px 6%', background: 'white', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[{ value: '10K+', label: 'Active Stores' }, { value: '5 Min', label: 'Setup Time' }, { value: '₹0', label: 'To Start' }, { value: '99.9%', label: 'Uptime' }].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '38px', fontWeight: '800', background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 6%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em' }}>All in One Platform</h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>Everything you need to run and grow your local business.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', border: '1px solid #F1F5F9', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = 'transparent'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 6%', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '12px' }}>Loved by Business Owners</h2>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Join thousands of happy business owners across India</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={14} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.75', marginBottom: '20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '15px' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 6%', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '52px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.15' }}>Ready to Go Online?</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', marginBottom: '40px', maxWidth: '460px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            Join 10,000+ Indian businesses already selling online with BizSathi.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', padding: '16px 32px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', boxShadow: '0 12px 30px rgba(99,102,241,0.35)' }}>
              🏪 Create Business Account
            </Link>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '16px 32px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', boxShadow: '0 12px 30px rgba(0,200,150,0.35)' }}>
              Get Started Free <FiArrowRight size={18} />
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '20px' }}>No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020617', padding: '36px 6%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '16px', color: 'white' }}>BizSathi</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>2024 BizSathi — Made with love in India</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href={`/${link.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
