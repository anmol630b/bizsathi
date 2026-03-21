import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', stock: '', unit: 'piece', isAvailable: true, isFeatured: false
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/my');
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Products load nahi hue!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Name aur price zaroori hai!');
      return;
    }
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, formData);
        toast.success('Product updated!');
      } else {
        await api.post('/products/add', formData);
        toast.success('Product add ho gaya!');
      }
      setShowModal(false);
      setEditProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Product delete karna chahte ho?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error('Delete nahi hua!');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/products/${id}/toggle`);
      fetchProducts();
    } catch (err) {
      toast.error('Error aaya!');
    }
  };

  const handleFeatured = async (id) => {
    try {
      await api.put(`/products/${id}/featured`);
      fetchProducts();
    } catch (err) {
      toast.error('Error aaya!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', stock: '', unit: 'piece', isAvailable: true, isFeatured: false });
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name, description: product.description || '',
      price: product.price, discountPrice: product.discountPrice || '',
      category: product.category || '', stock: product.stock || '',
      unit: product.unit || 'piece', isAvailable: product.isAvailable, isFeatured: product.isFeatured
    });
    setShowModal(true);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)' }}>Products</h2>
            <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' }}>{products.length} total products</p>
          </div>
          <button onClick={() => { resetForm(); setEditProduct(null); setShowModal(true); }} className="btn btn-primary" style={{ gap: '6px' }}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
          <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px' }} />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="page-loader"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products yet</h3>
            <p>Apne store ke liye products add karo</p>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">Add First Product</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map(product => (
              <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--gray-100), var(--gray-50))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                  {product.images?.[0] ? (
                    <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '📦'}
                  {product.isFeatured && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#EF9F27', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>Featured</div>
                  )}
                  {!product.isAvailable && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>Unavailable</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' }}>{product.name}</h3>
                  {product.category && <span style={{ fontSize: '11px', color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '20px' }}>{product.category}</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>Rs.{product.discountPrice || product.price}</span>
                    {product.discountPrice && <span style={{ fontSize: '12px', color: 'var(--gray-400)', textDecoration: 'line-through' }}>Rs.{product.price}</span>}
                    {product.discountPrice && <span style={{ fontSize: '10px', background: 'var(--danger-light)', color: 'var(--danger)', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>{product.discountPercent}% OFF</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => openEdit(product)} className="btn btn-outline btn-sm" style={{ flex: 1, gap: '4px' }}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleToggle(product._id)} className="btn btn-sm" style={{ background: product.isAvailable ? 'var(--success-light)' : 'var(--gray-100)', color: product.isAvailable ? 'var(--success)' : 'var(--gray-500)', border: 'none' }}>
                      {product.isAvailable ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                    </button>
                    <button onClick={() => handleFeatured(product._id)} className="btn btn-sm" style={{ background: product.isFeatured ? '#FAEEDA' : 'var(--gray-100)', color: product.isFeatured ? '#EF9F27' : 'var(--gray-400)', border: 'none' }}>
                      <FiStar size={14} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn btn-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif' }}>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => { setShowModal(false); setEditProduct(null); }} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--gray-400)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" placeholder="Product ka naam" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Product description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Price (Rs.) *</label>
                  <input type="number" className="form-input" placeholder="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price (Rs.)</label>
                  <input type="number" className="form-input" placeholder="0" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" placeholder="e.g. Electronics" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    {['piece','kg','gram','liter','pack','dozen','service'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Stock (-1 = unlimited)</label>
                <input type="number" className="form-input" placeholder="-1" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
                  Featured
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => { setShowModal(false); setEditProduct(null); }} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{editProduct ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Products;
