import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
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
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Sab fields bharen!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords match nahi kar rahe!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye!');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      toast.success('Account ban gaya! Welcome to BizSathi!');
      navigate('/dashboard/setup');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'white' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)' }} className="hide-mobile">
        <div style={{ color: 'white', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif' }}>B</div>
            <span style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif' }}>BizSathi</span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '16px', lineHeight: '1.3' }}>
            Apni Dukaan Ki<br />Website Banao Free Mein!
          </h2>
          <p style={{ fontSize: '16px', opacity: '0.85', lineHeight: '1.7', marginBottom: '32px' }}>
            India ke 10,000+ business owners already BizSathi use kar rahe hain.
          </p>
          {[
            { icon: '🌐', text: 'Professional website 5 min mein' },
            { icon: '📱', text: 'WhatsApp pe seedha orders' },
            { icon: '📊', text: 'Sales analytics aur reports' },
            { icon: '👥', text: 'Customer management system' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', opacity: '0.95' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>B</div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--gray-900)' }}>BizSathi</span>
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>Account Banao</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>Free mein shuru karo, koi credit card nahi chahiye</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="text" name="name" className="form-input" placeholder="Aapka naam" value={formData.name} onChange={handleChange} style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="email" name="email" className="form-input" placeholder="aapka@email.com" value={formData.email} onChange={handleChange} style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="tel" name="phone" className="form-input" placeholder="10 digit mobile number" value={formData.phone} onChange={handleChange} style={{ paddingLeft: '42px' }} maxLength={10} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type={showPassword ? 'text' : 'password'} name="password" className="form-input" placeholder="Kam se kam 6 characters" value={formData.password} onChange={handleChange} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="password" name="confirmPassword" className="form-input" placeholder="Password dobara likhein" value={formData.confirmPassword} onChange={handleChange} style={{ paddingLeft: '42px' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '4px', borderRadius: '10px' }}>
              {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : <> Free Account Banao <FiArrowRight size={16} /> </>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--gray-400)', lineHeight: '1.6' }}>
            Register karke aap hamare Terms of Service aur Privacy Policy se agree karte hain.
          </p>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--gray-500)' }}>
            Already account hai?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login Karein</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
