import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight, FiStar, FiUpload, FiImage } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const imageRef = useRef();
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', stock: '-1', unit: 'piece', isAvailable: true, isFeatured: false
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/my');
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Could not load products!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error('Maximum 5 images allowed!'); return; }
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required!');
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      imageFiles.forEach(file => data.append('productImage', file));

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, formData);
        toast.success('Product updated!');
      } else {
        await api.post('/products/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added!');
      }
      setShowModal(false);
      setEditProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error('Could not delete!');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/products/${id}/toggle`);
      fetchProducts();
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  const handleFeatured = async (id) => {
    try {
      await api.put(`/products/${id}/featured`);
      fetchProducts();
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', stock: '-1', unit: 'piece', isAvailable: true, isFeatured: false });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category || '',
      stock: product.stock || '-1',
      unit: product.unit || 'piece',
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured
    });
    setImagePreviews(product.images?.map(img => `http://localhost:5000${img}`) || []);
    setImageFiles([]);
    setShowModal(true);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
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
            <p>Add products to your store</p>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">Add First Product</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map(product => (
              <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ height: '160px', background: 'linear-gradient(135deg, var(--gray-100), var(--gray-50))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                  {product.images?.[0] ? (
                    <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <FiImage size={40} color="var(--gray-300)" />}
                  {product.isFeatured && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#EF9F27', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>Featured</div>
                  )}
                  {product.discountPrice && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>{product.discountPercent}% OFF</div>
                  )}
                  {!product.isAvailable && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '13px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '20px' }}>Unavailable</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' }}>{product.name}</h3>
                  {product.category && (
                    <span style={{ fontSize: '11px', color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '20px' }}>{product.category}</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>Rs.{product.discountPrice || product.price}</span>
                    {product.discountPrice && <span style={{ fontSize: '12px', color: 'var(--gray-400)', textDecoration: 'line-through' }}>Rs.{product.price}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    <button onClick={() => openEdit(product)} className="btn btn-outline btn-sm" style={{ flex: 1, gap: '4px' }}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleToggle(product._id)} className="btn btn-sm" title={product.isAvailable ? 'Mark Unavailable' : 'Mark Available'} style={{ background: product.isAvailable ? 'var(--success-light)' : 'var(--gray-100)', color: product.isAvailable ? 'var(--success)' : 'var(--gray-500)', border: 'none', padding: '6px 10px' }}>
                      {product.isAvailable ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                    </button>
                    <button onClick={() => handleFeatured(product._id)} className="btn btn-sm" title={product.isFeatured ? 'Remove Featured' : 'Mark Featured'} style={{ background: product.isFeatured ? '#FAEEDA' : 'var(--gray-100)', color: product.isFeatured ? '#EF9F27' : 'var(--gray-400)', border: 'none', padding: '6px 10px' }}>
                      <FiStar size={14} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn btn-sm" title="Delete" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '6px 10px' }}>
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
          <div className="card" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif' }}>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => { setShowModal(false); setEditProduct(null); resetForm(); }} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Product Images (Max 5)</label>
                <input type="file" ref={imageRef} accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                {imagePreviews.length > 0 ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--gray-200)' }} />
                    ))}
                  </div>
                ) : null}
                <button type="button" onClick={() => imageRef.current.click()} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                  <FiUpload size={14} /> {imagePreviews.length > 0 ? 'Change Images' : 'Upload Images'}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" placeholder="Product name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Product description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Price (Rs.) *</label>
                  <input type="number" className="form-input" placeholder="0" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price (Rs.)</label>
                  <input type="number" className="form-input" placeholder="0" min="0" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
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

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--gray-700)' }}>
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--gray-700)' }}>
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  Featured Product
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => { setShowModal(false); setEditProduct(null); resetForm(); }} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
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
