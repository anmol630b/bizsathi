import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/api';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const { token } = useParams();

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf8 0%, #eeedfe 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white', fontWeight: '700', fontSize: '24px' }}>B</div>

          {status === 'loading' && (
            <>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: '600', color: 'var(--gray-800)' }}>Verifying Email...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '8px' }}>Email Verified!</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '14px', marginBottom: '28px' }}>Your email has been verified successfully. You can now login to your account.</p>
              <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Go to Dashboard</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '8px' }}>Verification Failed!</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '14px', marginBottom: '28px' }}>The link is invalid or has expired. Please request a new verification email.</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Back to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
