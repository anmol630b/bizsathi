import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiShoppingCart, FiLogOut, FiGlobe, FiZap, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, businessRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/businesses')
      ]);
      setUsers(usersRes.data.users || []);
      setBusinesses(businessRes.data.businesses || []);
      setStats({
        totalUsers: usersRes.data.total || 0,
        totalBusinesses: businessRes.data.total || 0,
        publishedBusinesses: businessRes.data.businesses?.filter(b => b.isPublished).length || 0,
        proUsers: usersRes.data.users?.filter(u => u.plan !== 'free').length || 0
      });
    } catch (err) {
      toast.error('Could not load admin data!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const planColors = {
    free: '#888780', starter: '#1D9E75', pro: '#534AB7', enterprise: '#D85A30'
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: 'Inter, sans-serif' }}>
      {/* Admin Topbar */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--gray-100)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>B</div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--gray-900)' }}>BizSathi</span>
          <span style={{ background: '#E24B4A', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', background: 'white', fontSize: '13px', color: 'var(--gray-600)', textDecoration: 'none' }}>
            <FiGlobe size={14} /> User Dashboard
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', background: 'white', fontSize: '13px', color: 'var(--danger)', cursor: 'pointer' }}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)', marginBottom: '4px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>Manage all users and businesses</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: '#534AB7', bg: '#EEEDFE' },
            { title: 'Total Businesses', value: stats?.totalBusinesses || 0, icon: FiShoppingBag, color: '#1D9E75', bg: '#E1F5EE' },
            { title: 'Live Stores', value: stats?.publishedBusinesses || 0, icon: FiGlobe, color: '#D85A30', bg: '#FAECE7' },
            { title: 'Paid Users', value: stats?.proUsers || 0, icon: FiZap, color: '#EF9F27', bg: '#FAEEDA' }
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', background: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '4px' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--gray-100)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {['overview', 'users', 'businesses'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--gray-500)', fontWeight: activeTab === tab ? '600' : '400', fontSize: '13px', cursor: 'pointer', boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>All Users ({users.length})</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #E1F5EE, #1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px', flexShrink: 0 }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '500', fontSize: '13px' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{u.email}</td>
                      <td style={{ fontSize: '13px' }}>{u.phone}</td>
                      <td>
                        <span style={{ background: (planColors[u.plan] || '#888') + '20', color: planColors[u.plan] || '#888', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                          {u.plan || 'free'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span style={{ background: u.isActive ? 'var(--success-light)' : 'var(--danger-light)', color: u.isActive ? 'var(--success)' : 'var(--danger)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>All Businesses ({businesses.length})</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Category</th>
                    <th>Owner</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map(biz => (
                    <tr key={biz._id}>
                      <td>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{biz.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>/{biz.slug}</div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{biz.category}</td>
                      <td style={{ fontSize: '13px' }}>{biz.owner?.name || 'N/A'}</td>
                      <td style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>{biz.totalOrders || 0}</td>
                      <td style={{ fontSize: '13px', fontWeight: '600' }}>Rs.{(biz.totalRevenue || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span style={{ background: biz.isPublished ? 'var(--success-light)' : 'var(--warning-light)', color: biz.isPublished ? 'var(--success)' : 'var(--warning)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                          {biz.isPublished ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        {biz.isPublished && (
                          <a href={`/store/${biz.slug}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ gap: '4px', padding: '4px 10px' }}>
                            <FiEye size={12} /> View
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Recent Users</h3>
              {users.slice(0, 5).map(u => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #E1F5EE, #1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px', flexShrink: 0 }}>
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{u.email}</div>
                  </div>
                  <span style={{ background: (planColors[u.plan] || '#888') + '20', color: planColors[u.plan] || '#888', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>{u.plan || 'free'}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Recent Businesses</h3>
              {businesses.slice(0, 5).map(biz => (
                <div key={biz._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #EEEDFE, #534AB7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px', flexShrink: 0 }}>
                    {biz.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{biz.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'capitalize' }}>{biz.category}</div>
                  </div>
                  <span style={{ background: biz.isPublished ? 'var(--success-light)' : 'var(--warning-light)', color: biz.isPublished ? 'var(--success)' : 'var(--warning)', padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>
                    {biz.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
