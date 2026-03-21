import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  new: { bg: '#EEEDFE', color: '#534AB7' },
  confirmed: { bg: '#E1F5EE', color: '#1D9E75' },
  processing: { bg: '#FAEEDA', color: '#EF9F27' },
  shipped: { bg: '#FAECE7', color: '#D85A30' },
  delivered: { bg: '#E1F5EE', color: '#0F6E56' },
  cancelled: { bg: '#FCEBEB', color: '#E24B4A' }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/orders/my?${params}`);
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error('Orders load nahi hue!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated!');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status });
      }
    } catch (err) {
      toast.error('Update nahi hua!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Order delete karna chahte ho?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted!');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error('Delete nahi hua!');
    }
  };

  const generateWhatsAppLink = (order) => {
    const msg = `Hi ${order.customer.name},\n\nAapka order #${order.orderNumber} confirm ho gaya!\n\nItems:\n${order.items.map(i => `- ${i.name} x${i.quantity}`).join('\n')}\n\nTotal: Rs.${order.total}\n\nThank you for ordering from us!`;
    return `https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>Orders</h2>
            <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' }}>{pagination.total || 0} total orders</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="form-input" placeholder="Search by order #, name, phone..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchOrders()} style={{ paddingLeft: '42px' }} />
          </div>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="">All Status</option>
            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['', 'new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="btn btn-sm" style={{
              background: statusFilter === s ? (s ? statusColors[s]?.bg : 'var(--primary-light)') : 'var(--gray-100)',
              color: statusFilter === s ? (s ? statusColors[s]?.color : 'var(--primary)') : 'var(--gray-500)',
              border: 'none', fontWeight: statusFilter === s ? '600' : '400'
            }}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: '20px' }}>
          {/* Orders Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {loading ? (
              <div className="page-loader"><div className="loading-spinner" /></div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <h3>No orders found</h3>
                <p>Jab customers order karenge, yahan dikhenge</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} style={{ cursor: 'pointer', background: selectedOrder?._id === order._id ? 'var(--primary-light)' : 'white' }} onClick={() => setSelectedOrder(order)}>
                        <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '13px' }}>{order.orderNumber}</td>
                        <td>
                          <div style={{ fontWeight: '500', fontSize: '13px' }}>{order.customer.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{order.customer.phone}</div>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{order.items.length} items</td>
                        <td style={{ fontWeight: '600', fontSize: '14px', color: 'var(--gray-800)' }}>Rs.{order.total.toLocaleString('en-IN')}</td>
                        <td>
                          <span className="badge" style={{ background: statusColors[order.orderStatus]?.bg, color: statusColors[order.orderStatus]?.color }}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                            <a href={generateWhatsAppLink(order)} target="_blank" rel="noreferrer" className="btn btn-sm btn-whatsapp" style={{ padding: '5px 8px' }}>
                              <FiMessageCircle size={13} />
                            </a>
                            <button onClick={() => setSelectedOrder(order)} className="btn btn-sm btn-outline" style={{ padding: '5px 8px' }}>
                              <FiEye size={13} />
                            </button>
                            <button onClick={() => handleDelete(order._id)} className="btn btn-sm" style={{ padding: '5px 8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}>
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Detail Panel */}
          {selectedOrder && (
            <div className="card" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--gray-400)' }}>×</button>
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--gray-50)', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>Order Number</div>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px' }}>{selectedOrder.orderNumber}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '6px' }}>Customer</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{selectedOrder.customer.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{selectedOrder.customer.phone}</div>
                {selectedOrder.customer.address?.city && (
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '2px' }}>
                    {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '8px' }}>Items</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '13px' }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>Rs.{item.total || item.price * item.quantity}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: '700', fontSize: '14px', borderTop: '2px solid var(--gray-200)', marginTop: '4px' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>Rs.{selectedOrder.total}</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '8px' }}>Update Status</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.keys(statusColors).map(s => (
                    <button key={s} onClick={() => handleStatusUpdate(selectedOrder._id, s)} className="btn btn-sm" style={{
                      background: selectedOrder.orderStatus === s ? statusColors[s].bg : 'var(--gray-100)',
                      color: selectedOrder.orderStatus === s ? statusColors[s].color : 'var(--gray-500)',
                      border: selectedOrder.orderStatus === s ? `1.5px solid ${statusColors[s].color}` : '1.5px solid transparent',
                      fontWeight: selectedOrder.orderStatus === s ? '600' : '400'
                    }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <a href={generateWhatsAppLink(selectedOrder)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                <FiMessageCircle size={16} /> Send WhatsApp Update
              </a>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
