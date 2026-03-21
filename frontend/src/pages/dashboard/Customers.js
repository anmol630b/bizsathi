import React, { useState, useEffect } from 'react';
import { FiSearch, FiPhone, FiMail, FiShoppingBag, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const tagColors = {
  new: { bg: '#EEEDFE', color: '#534AB7' },
  regular: { bg: '#E1F5EE', color: '#1D9E75' },
  vip: { bg: '#FAEEDA', color: '#EF9F27' },
  inactive: { bg: '#FCEBEB', color: '#E24B4A' }
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchCustomers(); }, [tagFilter]);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (tagFilter) params.append('tag', tagFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/customers/my?${params}`);
      setCustomers(res.data.customers || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error('Could not load customers!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted!');
      fetchCustomers();
      setSelectedCustomer(null);
    } catch (err) {
      toast.error('Could not delete!');
    }
  };

  const handleBlock = async (id) => {
    try {
      await api.put(`/customers/${id}/block`);
      toast.success('Customer status updated!');
      fetchCustomers();
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>Customers</h2>
            <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' }}>{pagination.total || 0} total customers</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="form-input" placeholder="Search by name, phone, email..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchCustomers()} style={{ paddingLeft: '42px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['', 'new', 'regular', 'vip', 'inactive'].map(tag => (
            <button key={tag} onClick={() => setTagFilter(tag)} className="btn btn-sm" style={{
              background: tagFilter === tag ? (tag ? tagColors[tag]?.bg : 'var(--primary-light)') : 'var(--gray-100)',
              color: tagFilter === tag ? (tag ? tagColors[tag]?.color : 'var(--primary)') : 'var(--gray-500)',
              border: 'none', fontWeight: tagFilter === tag ? '600' : '400'
            }}>
              {tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'All'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 360px' : '1fr', gap: '20px' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {loading ? (
              <div className="page-loader"><div className="loading-spinner" /></div>
            ) : customers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <h3>No customers yet</h3>
                <p>Customers will be saved automatically when they place orders</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Tag</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer._id} style={{ cursor: 'pointer', background: selectedCustomer?._id === customer._id ? 'var(--primary-light)' : 'white' }} onClick={() => setSelectedCustomer(customer)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', fontSize: '13px' }}>{customer.name}</div>
                            {customer.email && <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{customer.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{customer.phone}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
                          <FiShoppingBag size={12} /> {customer.totalOrders}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', fontSize: '13px' }}>₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                      <td>
                        {customer.tags?.map(tag => (
                          <span key={tag} className="badge" style={{ background: tagColors[tag]?.bg, color: tagColors[tag]?.color, marginRight: '4px' }}>{tag}</span>
                        ))}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{new Date(customer.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                          <a href={`https://wa.me/91${customer.phone}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-whatsapp" style={{ padding: '5px 8px' }}><FiMessageCircle size={13} /></a>
                          <button onClick={() => handleDelete(customer._id)} className="btn btn-sm" style={{ padding: '5px 8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}><FiTrash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedCustomer && (
            <div className="card" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Customer Details</h3>
                <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--gray-400)' }}>×</button>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '22px', margin: '0 auto 12px' }}>
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h4 style={{ fontWeight: '600', fontSize: '16px' }}>{selectedCustomer.name}</h4>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '6px' }}>
                  {selectedCustomer.tags?.map(tag => (
                    <span key={tag} className="badge" style={{ background: tagColors[tag]?.bg, color: tagColors[tag]?.color }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: FiPhone, label: 'Phone', value: selectedCustomer.phone },
                  { icon: FiMail, label: 'Email', value: selectedCustomer.email || 'N/A' },
                  { icon: FiShoppingBag, label: 'Total Orders', value: selectedCustomer.totalOrders },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                    <item.icon size={14} color="var(--gray-400)" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--primary-light)', borderRadius: '8px' }}>
                  <FiShoppingBag size={14} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)' }}>Total Spent</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`https://wa.me/91${selectedCustomer.phone}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <FiMessageCircle size={16} /> Send WhatsApp
                </a>
                <button onClick={() => handleBlock(selectedCustomer._id)} className="btn btn-outline" style={{ width: '100%' }}>
                  {selectedCustomer.isBlocked ? 'Unblock Customer' : 'Block Customer'}
                </button>
                <button onClick={() => handleDelete(selectedCustomer._id)} className="btn" style={{ width: '100%', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}>
                  Delete Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
