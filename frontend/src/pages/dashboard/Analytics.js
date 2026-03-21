import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiShoppingBag, FiArrowUp, FiArrowDown } from 'react-icons/fi';
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

  const COLORS = ['#00C896', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const pieData = analytics?.orderStatusBreakdown?.map(item => ({
    name: item._id, value: item.count
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0F172A', borderRadius: '10px', padding: '10px 14px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: '#00C896', fontWeight: '700', fontSize: '14px' }}>₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0F172A', borderRadius: '10px', padding: '10px 14px', border: 'none' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: '#6366F1', fontWeight: '700', fontSize: '14px' }}>{payload[0]?.value} orders</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0F172A', letterSpacing: '-0.02em' }}>Analytics</h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Track your business performance</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }} className="stat-grid">
          {[
            { title: 'Total Orders', value: analytics?.total?.orders || 0, icon: FiShoppingCart, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
            { title: 'Total Revenue', value: `₹${(analytics?.total?.revenue || 0).toLocaleString('en-IN')}`, icon: FiTrendingUp, color: '#00C896', bg: 'rgba(0,200,150,0.08)', border: 'rgba(0,200,150,0.15)' },
            { title: 'Total Customers', value: analytics?.total?.customers || 0, icon: FiUsers, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
            { title: 'Total Products', value: analytics?.total?.products || 0, icon: FiShoppingBag, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: `1px solid ${stat.border}`, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: stat.bg, borderRadius: '0 16px 0 80px', pointerEvents: 'none' }} />
              <div style={{ width: '38px', height: '38px', background: stat.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, marginBottom: '12px' }}>
                <stat.icon size={18} />
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* This Month */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'This Month Orders', value: analytics?.thisMonth?.orders || 0, color: '#6366F1', bg: 'rgba(99,102,241,0.06)' },
            { label: 'This Month Revenue', value: `₹${(analytics?.thisMonth?.revenue || 0).toLocaleString('en-IN')}`, color: '#00C896', bg: 'rgba(0,200,150,0.06)' },
            { label: 'Revenue Growth', value: `${analytics?.thisMonth?.revenueGrowth || 0}%`, color: (analytics?.thisMonth?.revenueGrowth || 0) >= 0 ? '#00C896' : '#EF4444', bg: (analytics?.thisMonth?.revenueGrowth || 0) >= 0 ? 'rgba(0,200,150,0.06)' : 'rgba(239,68,68,0.06)' }
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: item.color, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '6px' }}>{item.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }} className="chart-grid">
          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>Revenue — Last 7 Days</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Daily revenue trend</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics?.last7Days || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C896" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#00C896" strokeWidth={2.5} fill="url(#revenueGrad2)" dot={false} activeDot={{ r: 5, fill: '#00C896', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order Status</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Breakdown by status</p>
            </div>
            {pieData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '32px', opacity: 0.3 }}>📊</span>
                <p style={{ color: '#94A3B8', fontSize: '13px' }}>No order data yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', background: '#0F172A', color: 'white', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {pieData.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#64748B', textTransform: 'capitalize' }}>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }} className="chart-grid">
          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Orders — Last 7 Days</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Daily order count</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics?.last7Days || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Top Products</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Best selling products</p>
            </div>
            {!analytics?.topProducts?.length ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '32px', opacity: 0.3 }}>🏆</span>
                <p style={{ color: '#94A3B8', fontSize: '13px' }}>No product data yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analytics.topProducts.map((product, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product._id}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{product.totalOrders} orders</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#00C896', flexShrink: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{(product.totalRevenue || 0).toLocaleString('en-IN')}</div>
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
