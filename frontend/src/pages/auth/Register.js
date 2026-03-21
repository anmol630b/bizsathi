import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) { toast.error('Please fill all fields!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to BizSathi!');
      navigate('/dashboard/setup');
    } else {
      toast.error(result.message);
    }
  };

  const benefits = [
    'Free forever plan available',
    'WhatsApp order notifications',
    'Beautiful store in 5 minutes',
    'Real-time analytics dashboard'
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0F172A' }}>

      {/* Left - Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="hide-mobile">
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px rgba(0,200,150,0.3)' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '20px', color: 'white', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', color: '#00C896', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.02em' }}>
            🚀 JOIN 10,000+ BUSINESSES
          </div>

          <h2 style={{ fontSize: '40px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Start selling online<br />
            <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>completely free</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', marginBottom: '40px' }}>
            Join thousands of Indian business owners who trust BizSathi to power their online presence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', background: 'rgba(0,200,150,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(0,200,150,0.2)' }}>
                  <FiCheck size={12} color="#00C896" strokeWidth={3} />
                </div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{ marginTop: '48px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '14px', fontStyle: 'italic' }}>
              "BizSathi helped me get my first online order within hours of setting up. Absolutely incredible!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px' }}>R</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>Rahul Sharma</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Sharma Electronics, Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div style={{ width: '500px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '17px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px', letterSpacing: '-0.02em' }}>Create your account</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '28px' }}>Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="text" name="name" className="form-input" placeholder="Your full name" value={formData.name} onChange={handleChange} style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input type="tel" name="phone" className="form-input" placeholder="10 digit mobile number" value={formData.phone} onChange={handleChange} style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', fontSize: '14px' }} maxLength={10} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type={showPassword ? 'text' : 'password'} name="password" className="form-input" placeholder="Min 6 chars" value={formData.password} onChange={handleChange} style={{ paddingLeft: '40px', paddingRight: '36px', height: '44px', borderRadius: '10px', fontSize: '14px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input type="password" name="confirmPassword" className="form-input" placeholder="Re-enter" value={formData.confirmPassword} onChange={handleChange} style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', fontSize: '14px' }} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', height: '46px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #00C896, #00A87E)', color: loading ? '#94A3B8' : 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(0,200,150,0.3)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
              {loading ? (
                <div style={{ width: '18px', height: '18px', border: '2px solid #CBD5E1', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <> Create Free Account <FiArrowRight size={15} /> </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#CBD5E1', lineHeight: '1.6' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00C896', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
