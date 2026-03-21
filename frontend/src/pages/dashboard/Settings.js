import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiGlobe, FiBell, FiSave } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '' });

  useEffect(() => { fetchBusiness(); }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/business/my');
      setSeo(res.data.business?.seo || { title: '', description: '', keywords: '' });
    } catch (err) {}
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/update-profile', profile);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleSeoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/business/seo', seo);
      toast.success('SEO settings saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Starter plan required!');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'seo', label: 'SEO Settings', icon: FiGlobe },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <DashboardLayout>
      <div className="fade-in" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>Settings</h2>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' }}>Manage your account and business settings</p>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--gray-100)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--gray-500)',
              fontWeight: activeTab === tab.id ? '600' : '400',
              fontSize: '13px', cursor: 'pointer',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Profile Information</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '26px' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{user?.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '8px' }}>{user?.email}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {user?.plan?.toUpperCase()} PLAN
                </div>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="10 digit number" maxLength={10} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
                <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>Email cannot be changed</p>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: '8px' }}>
                {loading ? <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><FiSave size={14} /> Save Changes</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} placeholder="Current password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} placeholder="New password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} placeholder="Confirm password" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: '8px' }}>
                {loading ? <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><FiLock size={14} /> Change Password</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>SEO Settings</h3>
              {user?.plan === 'free' && <span style={{ fontSize: '12px', background: 'var(--warning-light)', color: 'var(--warning)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>Starter Plan Required</span>}
            </div>
            <form onSubmit={handleSeoUpdate}>
              <div className="form-group">
                <label className="form-label">SEO Title</label>
                <input className="form-input" value={seo.title} onChange={e => setSeo({...seo, title: e.target.value})} placeholder="Website title (60 characters)" maxLength={60} disabled={user?.plan === 'free'} />
              </div>
              <div className="form-group">
                <label className="form-label">Meta Description</label>
                <textarea className="form-textarea" value={seo.description} onChange={e => setSeo({...seo, description: e.target.value})} placeholder="Website description (160 characters)" maxLength={160} rows={3} disabled={user?.plan === 'free'} />
              </div>
              <div className="form-group">
                <label className="form-label">Keywords</label>
                <input className="form-input" value={seo.keywords} onChange={e => setSeo({...seo, keywords: e.target.value})} placeholder="keyword1, keyword2, keyword3" disabled={user?.plan === 'free'} />
              </div>
              <button type="submit" disabled={loading || user?.plan === 'free'} className="btn btn-primary" style={{ gap: '8px' }}>
                {loading ? <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><FiSave size={14} /> Save SEO Settings</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Notification Settings</h3>
            {[
              { label: 'New Order Email', desc: 'Receive email when a new order is placed', defaultChecked: true },
              { label: 'WhatsApp Notifications', desc: 'Get WhatsApp notification for orders', defaultChecked: true },
              { label: 'Weekly Report', desc: 'Weekly sales report via email', defaultChecked: false },
              { label: 'Marketing Tips', desc: 'Tips to grow your business', defaultChecked: false }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--gray-800)' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input type="checkbox" defaultChecked={item.defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} onChange={() => toast.success('Setting saved!')} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: item.defaultChecked ? 'var(--primary)' : 'var(--gray-300)', borderRadius: '24px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', height: '18px', width: '18px', left: item.defaultChecked ? '23px' : '3px', bottom: '3px', background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
