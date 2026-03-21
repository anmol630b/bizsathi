import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf8 0%, #eeedfe 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{
          fontSize: '120px',
          fontWeight: '800',
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(135deg, #1D9E75, #534AB7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
          marginBottom: '16px'
        }}>404</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--gray-800)',
          fontFamily: 'Poppins, sans-serif',
          marginBottom: '12px'
        }}>Page Nahi Mila!</h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--gray-400)',
          marginBottom: '36px',
          maxWidth: '400px',
          lineHeight: '1.6'
        }}>
          Yeh page exist nahi karta ya delete ho gaya hai.
          Ghar wapas jao!
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
            style={{ gap: '8px' }}
          >
            <FiArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary" style={{ gap: '8px' }}>
            <FiHome size={16} /> Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
