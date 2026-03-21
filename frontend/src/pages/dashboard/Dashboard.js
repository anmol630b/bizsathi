import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUsers, FiShoppingBag, FiTrendingUp, FiArrowRight, FiGlobe, FiZap, FiAlertCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi';
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
    {
      title: "Today's Orders", value: analytics?.today?.orders || 0,
      icon: FiShoppingCart, color: '#00C896', bg: 'rgba(0,200,150,0.08)',
      border: 'rgba(0,200,150,0.15)', change: '+12%', up: true
    },
    {
      title: "Today's Revenue", value: analytics?.today?.revenue || 0,
      icon: FiTrendingUp, color: '#6366F1', bg: 'rgba(99,102,241,0.08)',
      border: 'rgba(99,102,241,0.15)', prefix: '₹', change: '+8%', up: true
    },
    {
      title: 'Total Customers', value: analytics?.total?.customers || 0,
      icon: FiUsers, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.15)', change: '+5%', up: true
    },
    {
      title: 'Total Products', value: analytics?.total?.products || 0,
      icon: FiShoppingBag, color: '#EF4444', bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.15)', change: '0%', up: false
    }
  ];

  const statusConfig = {
    new: { bg: 'rgba(99,102,241,0.1)', color: '#6366F1' },
    confirmed: { bg: 'rgba(0,200,150,0.1)', color: '#00C896' },
    processing: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
    shipped: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
    delivered: { bg: 'rgba(0,200,150,0.1)', color: '#10B981' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0F172A', border: 'none', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: '#00C896', fontWeight: '700', fontSize: '14px' }}>₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
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
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="fade-in">

        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '120px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Good morning 👋</p>
            <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              {business ? `${business.name} — Store is ${business.isPublished ? '🟢 LIVE' : '🔴 Not Published'}` : 'Complete your business setup to get started'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', position: 'relative', zIndex: 1 }}>
            {!business ? (
              <Link to="/dashboard/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,200,150,0.35)' }}>
                <FiZap size={14} /> Setup Business
              </Link>
            ) : !business.isPublished ? (
              <Link to="/dashboard/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,200,150,0.35)' }}>
                <FiGlobe size={14} /> Publish Website
              </Link>
            ) : (
              <a href={`/store/${business.slug}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                <FiGlobe size={14} /> View Store
              </a>
            )}
          </div>
        </div>

        {/* No Business Warning */}
        {!business && (
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiAlertCircle color="#F59E0B" size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', color: '#92400E', fontSize: '13px' }}>Business setup incomplete</p>
              <p style={{ color: '#B45309', fontSize: '12px', marginTop: '2px' }}>Setup your business to start receiving orders</p>
            </div>
            <Link to="/dashboard/setup" style={{ background: '#F59E0B', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>Setup Now</Link>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }} className="stat-grid">
          {statCards.map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: `1px solid ${stat.border}`, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: stat.bg, borderRadius: '0 16px 0 80px', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', background: stat.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <stat.icon size={18} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: stat.up ? 'rgba(0,200,150,0.08)' : 'rgba(239,68,68,0.08)', color: stat.up ? '#00C896' : '#EF4444', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '600' }}>
                  {stat.up ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />}
                  {stat.change}
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '16px', marginBottom: '16px' }} className="chart-grid">

          {/* Revenue Chart */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>Revenue Overview</h3>
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Last 7 days performance</p>
              </div>
              <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', color: '#64748B', fontWeight: '600', border: '1px solid #F1F5F9' }}>This Week</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics?.last7Days || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C896" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#00C896" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#00C896', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* This Month Stats */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em', marginBottom: '16px' }}>This Month</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Total Orders', value: analytics?.thisMonth?.orders || 0, color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
                { label: 'Revenue', value: `₹${(analytics?.thisMonth?.revenue || 0).toLocaleString('en-IN')}`, color: '#00C896', bg: 'rgba(0,200,150,0.08)' },
                { label: 'New Customers', value: analytics?.thisMonth?.newCustomers || 0, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
                { label: 'Growth', value: `${analytics?.thisMonth?.revenueGrowth || 0}%`, color: (analytics?.thisMonth?.revenueGrowth || 0) >= 0 ? '#10B981' : '#EF4444', bg: (analytics?.thisMonth?.revenueGrowth || 0) >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: item.bg, borderRadius: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>{item.label}</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: item.color, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>Recent Orders</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Latest customer orders</p>
            </div>
            <Link to="/dashboard/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#00C896', fontWeight: '600', textDecoration: 'none', background: 'rgba(0,200,150,0.08)', padding: '5px 12px', borderRadius: '8px' }}>
              View All <FiArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📦</div>
              <h4 style={{ fontSize: '15px', color: '#334155', fontWeight: '600', marginBottom: '6px' }}>No orders yet</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>When customers place orders, they will appear here</p>
              {!business?.isPublished && (
                <Link to="/dashboard/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                  <FiGlobe size={14} /> Publish Your Store
                </Link>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #F1F5F9' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={order._id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #F8FAFC' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{order.orderNumber}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#0F172A' }}>{order.customer.name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>{order.customer.phone}</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: '700', fontSize: '13px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{order.total.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ background: statusConfig[order.orderStatus]?.bg, color: statusConfig[order.orderStatus]?.color, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: '#94A3B8' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
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
