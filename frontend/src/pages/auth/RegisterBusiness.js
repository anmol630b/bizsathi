import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiZap } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const RegisterBusiness = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerBusiness } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) { toast.error('Please fill all fields!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    const result = await registerBusiness(formData);
    setLoading(false);
    if (result.success) {
      toast.success('Business account created!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const inputStyle = { width: '100%', padding: '13px 14px 13px 42px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box', transition: 'all 0.2s', background: '#FAFAFA' };
  const onFocus = e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; };
  const onBlur = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#F8FAFC' }}>

      {/* Left */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="hide-mobile">
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '64px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '20px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '22px', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</span>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', padding: '7px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <FiZap size={12} /> Business Account
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Grow your<br />
            <span style={{ background: 'linear-gradient(135deg, #6366F1, #00C896)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>business online</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '380px', marginBottom: '40px' }}>
            Create your online store, manage products, and receive orders directly on WhatsApp.
          </p>
          {[
            { icon: '🏪', text: 'Your own online store in 5 minutes' },
            { icon: '📦', text: 'Add unlimited products with photos' },
            { icon: '💬', text: 'Receive orders on WhatsApp' },
            { icon: '📊', text: 'Track revenue and analytics' },
            { icon: '👥', text: 'Manage your customers' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>{item.icon}</div>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ width: '500px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'white', overflowY: 'auto', boxShadow: '-20px 0 60px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.06)', color: '#6366F1', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', border: '1px solid rgba(99,102,241,0.15)' }}>
              🏪 Business Account
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>Create Business Account</h1>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Start selling online for free. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Your Name', name: 'name', type: 'text', placeholder: 'Business owner name', Icon: FiUser },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'business@example.com', Icon: FiMail },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '10 digit mobile number', Icon: FiPhone },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <field.Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} maxLength={field.name === 'phone' ? 10 : undefined} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Min 6 chars" value={formData.password} onChange={handleChange} style={{ ...inputStyle, padding: '13px 36px 13px 42px' }} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confirm</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type="password" name="confirmPassword" placeholder="Re-enter" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', height: '50px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #6366F1, #4F46E5)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: loading ? 'none' : '0 6px 20px rgba(99,102,241,0.35)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
              {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid #CBD5E1', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <> Create Business Account <FiArrowRight size={16} /> </>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B', marginBottom: '12px' }}>
            Already have an account?{' '}<Link to="/login" style={{ color: '#6366F1', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#00C896', fontWeight: '700', textDecoration: 'none', background: 'rgba(0,200,150,0.06)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(0,200,150,0.15)' }}>
              🛒 Create Customer Account instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBusiness;
