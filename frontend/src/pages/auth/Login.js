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
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="hide-mobile">
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '20px', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Grow your<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>business faster</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', marginBottom: '40px' }}>
            Manage your store, track orders, and grow your customer base from one powerful dashboard.
          </p>
          {[
            { icon: '⚡', text: 'Website ready in 5 minutes' },
            { icon: '💬', text: 'Orders directly on WhatsApp' },
            { icon: '📊', text: 'Real-time analytics' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>{item.icon}</div>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '480px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '17px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '32px' }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#00C896', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 40px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', height: '46px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #00C896, #00A87E)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(0,200,150,0.3)', fontFamily: 'Inter, sans-serif' }}>
              {loading ? <div style={{ width: '18px', height: '18px', border: '2px solid #CBD5E1', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <> Sign In <FiArrowRight size={15} /> </>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00C896', fontWeight: '700', textDecoration: 'none' }}>Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
