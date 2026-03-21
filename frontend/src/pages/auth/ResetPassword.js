import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) { toast.error('Please fill all fields!'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf8 0%, #eeedfe 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontWeight: '700', fontSize: '24px', fontFamily: 'Poppins, sans-serif' }}>B</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>Reset Password</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Enter your new password below</p>
          </div>

          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontWeight: '600', color: 'var(--gray-800)', marginBottom: '8px' }}>Password Reset!</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '14px', marginBottom: '24px' }}>Redirecting to login...</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input type="password" className="form-input" placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ paddingLeft: '42px' }} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : <> Reset Password <FiArrowRight size={16} /> </>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
