import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) { toast.error('Please select account type!'); return; }
    if (!formData.name || !formData.email || !formData.phone || !formData.password) { toast.error('Please fill all fields!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    const result = await register({ ...formData, userType });
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to BizSathi!');
      if (userType === 'seller') {
        navigate('/dashboard/setup');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0F172A', fontFamily: 'Inter, sans-serif' }}>

      {/* Left - Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="hide-mobile">
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px rgba(0,200,150,0.3)' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '20px', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Join India's<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Business Platform</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', marginBottom: '40px' }}>
            Whether you're a business owner or a shopper — BizSathi has everything you need.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { emoji: '🏪', text: 'Create your store in 5 minutes' },
              { emoji: '📱', text: 'Receive orders on WhatsApp' },
              { emoji: '🛒', text: 'Shop from local businesses' },
              { emoji: '❤️', text: 'Save favourite stores' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>{item.emoji}</div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div style={{ width: '520px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '17px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px', letterSpacing: '-0.02em' }}>Create Account</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '28px' }}>Free forever. No credit card required.</p>

          {/* Account Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button type="button" onClick={() => setUserType('seller')} style={{ padding: '16px 12px', borderRadius: '14px', border: `2px solid ${userType === 'seller' ? '#0F172A' : '#F1F5F9'}`, background: userType === 'seller' ? '#0F172A' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
                {userType === 'seller' && <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', background: '#00C896', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiCheck size={10} color="white" strokeWidth={3} /></div>}
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏪</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: userType === 'seller' ? 'white' : '#0F172A', marginBottom: '3px' }}>Business Owner</div>
                <div style={{ fontSize: '11px', color: userType === 'seller' ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>Sell products online</div>
              </button>

              <button type="button" onClick={() => setUserType('customer')} style={{ padding: '16px 12px', borderRadius: '14px', border: `2px solid ${userType === 'customer' ? '#0F172A' : '#F1F5F9'}`, background: userType === 'customer' ? '#0F172A' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
                {userType === 'customer' && <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', background: '#00C896', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiCheck size={10} color="white" strokeWidth={3} /></div>}
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛒</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: userType === 'customer' ? 'white' : '#0F172A', marginBottom: '3px' }}>Customer</div>
                <div style={{ fontSize: '11px', color: userType === 'customer' ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>Shop from local stores</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="tel" name="phone" placeholder="10 digit mobile number" value={formData.phone} onChange={handleChange} maxLength={10} style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Min 6 chars" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '11px 36px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type="password" name="confirmPassword" placeholder="Re-enter" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', height: '46px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #00C896, #00A87E)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(0,200,150,0.3)', fontFamily: 'Inter, sans-serif' }}>
              {loading ? <div style={{ width: '18px', height: '18px', border: '2px solid #CBD5E1', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <> Create Account <FiArrowRight size={15} /> </>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#CBD5E1', lineHeight: '1.6' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00C896', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
