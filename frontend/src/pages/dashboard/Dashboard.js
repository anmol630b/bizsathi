import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUsers, FiShoppingBag, FiTrendingUp, FiArrowRight, FiGlobe, FiZap, FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [business, setBusiness] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, businessRes, ordersRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/business/my').catch(() => ({ data: { business: null } })),
        api.get('/orders/my?limit=5').catch(() => ({ data: { orders: [] } }))
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setBusiness(businessRes.data.business);
      setRecentOrders(ordersRes.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Today's Orders", value: analytics?.today?.orders || 0, icon: FiShoppingCart, color: '#1D9E75', bg: '#E1F5EE' },
    { title: "Today's Revenue", value: analytics?.today?.revenue || 0, icon: FiTrendingUp, color: '#534AB7', bg: '#EEEDFE', prefix: 'Rs.' },
    { title: 'Total Customers', value: analytics?.total?.customers || 0, icon: FiUsers, color: '#D85A30', bg: '#FAECE7' },
    { title: 'Total Products', value: analytics?.total?.products || 0, icon: FiShoppingBag, color: '#EF9F27', bg: '#FAEEDA' }
  ];

  const statusColors = { new: '#534AB7', confirmed: '#1D9E75', processing: '#EF9F27', shipped: '#D85A30', delivered: '#1D9E75', cancelled: '#E24B4A' };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-loader">
          <div className="loading-spinner" />
          <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
            <p style={{ opacity: '0.85', fontSize: '14px' }}>
              {business ? `${business.name} — Your store is ${business.isPublished ? 'LIVE' : 'not published yet'}` : 'Setup your business to get started'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {!business ? (
              <Link to="/dashboard/setup" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: '600', gap: '6px' }}>
                <FiZap size={16} /> Setup Business
              </Link>
            ) : !business.isPublished ? (
              <Link to="/dashboard/setup" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: '600', gap: '6px' }}>
                <FiGlobe size={16} /> Publish Website
              </Link>
            ) : (
              <a href={`/store/${business.slug}`} target="_blank" rel="noreferrer" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: '600', gap: '6px' }}>
                <FiGlobe size={16} /> View Store
              </a>
            )}
          </div>
        </div>

        {/* No Business Warning */}
        {!business && (
          <div style={{ background: '#FAEEDA', border: '1px solid #EF9F27', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiAlertCircle color="#EF9F27" size={20} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', color: '#854F0B', fontSize: '14px' }}>Business not setup yet!</p>
              <p style={{ color: '#854F0B', fontSize: '13px', opacity: '0.8' }}>Please setup your business first, then your website and orders will work.</p>
            </div>
            <Link to="/dashboard/setup" className="btn btn-sm" style={{ background: '#EF9F27', color: 'white', border: 'none' }}>Setup Now</Link>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {statCards.map((stat, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', background: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <stat.icon size={20} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '500' }}>Today</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>
                {stat.prefix}{stat.value.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '4px' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Charts + Recent Orders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--gray-800)' }}>Last 7 Days Revenue</h3>
              <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics?.last7Days || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1D9E75" strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '20px' }}>This Month</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Total Orders', value: analytics?.thisMonth?.orders || 0, color: '#534AB7' },
                { label: 'Revenue', value: `Rs.${(analytics?.thisMonth?.revenue || 0).toLocaleString('en-IN')}`, color: '#1D9E75' },
                { label: 'New Customers', value: analytics?.thisMonth?.newCustomers || 0, color: '#D85A30' },
                { label: 'Growth', value: `${analytics?.thisMonth?.revenueGrowth || 0}%`, color: '#EF9F27' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--gray-50)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{item.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: item.color, fontFamily: 'Poppins, sans-serif' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--gray-800)' }}>Recent Orders</h3>
            <Link to="/dashboard/orders" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No orders yet</h3>
              <p>When customers place orders, they will appear here</p>
              {!business?.isPublished && (
                <Link to="/dashboard/setup" className="btn btn-primary btn-sm">Publish Your Store</Link>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '13px' }}>{order.orderNumber}</td>
                      <td>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{order.customer.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{order.customer.phone}</div>
                      </td>
                      <td style={{ fontWeight: '600', fontSize: '14px' }}>Rs.{order.total.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="badge" style={{ background: statusColors[order.orderStatus] + '20', color: statusColors[order.orderStatus] }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
