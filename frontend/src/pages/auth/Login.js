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
    if (!email || !password) {
      toast.error('Please enter email and password!');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f0fdf8 0%, #eeedfe 100%)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)' }} className="hide-mobile">
        <div style={{ color: 'white', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif' }}>B</div>
            <span style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif' }}>BizSathi</span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '16px', lineHeight: '1.3' }}>
            Take Your Business<br />To The Next Level
          </h2>
          <p style={{ fontSize: '16px', opacity: '0.85', lineHeight: '1.7', marginBottom: '40px' }}>
            Website, Orders, Customers and Analytics — manage everything in one place.
          </p>
          {['Website ready in 5 minutes', 'Orders directly on WhatsApp', 'Free plan available'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
              <span style={{ fontSize: '15px', opacity: '0.9' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '36px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>B</div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--gray-900)' }}>BizSathi</span>
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>Welcome Back!</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px', borderRadius: '10px' }}>
              {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : <> Login <FiArrowRight size={16} /> </>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
