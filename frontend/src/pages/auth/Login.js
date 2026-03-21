import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password!'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      if (result.userType === 'business') navigate('/dashboard');
      else navigate('/user/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#F8FAFC' }}>

      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="hide-mobile">
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '64px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '20px', boxShadow: '0 4px 14px rgba(0,200,150,0.3)' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '22px', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</span>
          </Link>
          <h2 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Welcome back<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>to BizSathi</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '380px' }}>
            Your one-stop platform to shop from local businesses and support your community.
          </p>
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🛒', text: 'Shop from thousands of local stores' },
              { icon: '💬', text: 'Order instantly on WhatsApp' },
              { icon: '❤️', text: 'Save your favourite businesses' },
              { icon: '📦', text: 'Track all your orders' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>{item.icon}</div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '500px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'white', boxShadow: '-20px 0 60px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>Sign in</h1>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '13px 14px 13px 42px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box', transition: 'all 0.2s', background: '#FAFAFA' }}
                  onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#00C896', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '13px 44px 13px 42px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box', transition: 'all 0.2s', background: '#FAFAFA' }}
                  onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', height: '50px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #00C896, #00A87E)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 6px 20px rgba(0,200,150,0.35)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
              {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid #CBD5E1', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <> Sign In <FiArrowRight size={16} /> </>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00C896', fontWeight: '700', textDecoration: 'none' }}>Create one free</Link>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register-business" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6366F1', fontWeight: '700', textDecoration: 'none', background: 'rgba(99,102,241,0.06)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
              🏪 Create Business Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
