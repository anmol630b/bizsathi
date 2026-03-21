import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiShoppingBag } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#534AB7', '#1D9E75', '#EF9F27', '#E24B4A', '#D85A30', '#0F6E56'];

  const pieData = analytics?.orderStatusBreakdown?.map(item => ({
    name: item._id, value: item.count
  })) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-loader"><div className="loading-spinner" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>Analytics</h2>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' }}>Apne business ki performance dekho</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: 'Total Orders', value: analytics?.total?.orders || 0, icon: FiShoppingCart, color: '#534AB7', bg: '#EEEDFE' },
            { title: 'Total Revenue', value: `Rs.${(analytics?.total?.revenue || 0).toLocaleString('en-IN')}`, icon: FiTrendingUp, color: '#1D9E75', bg: '#E1F5EE' },
            { title: 'Total Customers', value: analytics?.total?.customers || 0, icon: FiUsers, color: '#D85A30', bg: '#FAECE7' },
            { title: 'Total Products', value: analytics?.total?.products || 0, icon: FiShoppingBag, color: '#EF9F27', bg: '#FAEEDA' }
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', background: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '4px' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* This Month */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'This Month Orders', value: analytics?.thisMonth?.orders || 0, color: '#534AB7' },
            { label: 'This Month Revenue', value: `Rs.${(analytics?.thisMonth?.revenue || 0).toLocaleString('en-IN')}`, color: '#1D9E75' },
            { label: 'Revenue Growth', value: `${analytics?.thisMonth?.revenueGrowth || 0}%`, color: analytics?.thisMonth?.revenueGrowth >= 0 ? '#1D9E75' : '#E24B4A' }
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: item.color, fontFamily: 'Poppins, sans-serif' }}>{item.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '6px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Area Chart */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--gray-800)' }}>Last 7 Days Revenue</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={analytics?.last7Days || []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1D9E75" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--gray-800)' }}>Order Status</h3>
            {pieData.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <p>No order data yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {pieData.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: 'var(--gray-600)' }}>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bar Chart + Top Products */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          {/* Orders Bar Chart */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--gray-800)' }}>Last 7 Days Orders</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics?.last7Days || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Bar dataKey="orders" fill="#534AB7" radius={[6, 6, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--gray-800)' }}>Top Products</h3>
            {!analytics?.topProducts?.length ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <p>No product data yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analytics.topProducts.map((product, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gray-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product._id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{product.totalOrders} orders</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', flexShrink: 0 }}>Rs.{product.totalRevenue?.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
