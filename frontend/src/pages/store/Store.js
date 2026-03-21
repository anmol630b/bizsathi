import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMail, FiShoppingCart, FiPlus, FiMinus, FiMessageCircle, FiSearch, FiX, FiInstagram, FiFacebook } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Store = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: { street: '', city: '', pincode: '' } });
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [notFound, setNotFound] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => { fetchStore(); }, [slug]);

  const fetchStore = async () => {
    try {
      const bizRes = await api.get(`/business/store/${slug}`);
      setBusiness(bizRes.data.business);
      const prodRes = await api.get(`/products/store/${bizRes.data.business._id}`);
      setProducts(prodRes.data.products || []);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      setCart(cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(i => i._id === productId);
    if (existing?.quantity === 1) {
      setCart(cart.filter(i => i._id !== productId));
    } else {
      setCart(cart.map(i => i._id === productId ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Name and phone number are required!');
      return;
    }
    setOrdering(true);
    try {
      const items = cart.map(item => ({
        product: item._id,
        name: item.name,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        total: (item.discountPrice || item.price) * item.quantity
      }));
      const res = await api.post('/orders/create', {
        businessId: business._id,
        customer: customerInfo,
        items,
        deliveryType,
        paymentMethod: 'whatsapp'
      });
      toast.success('Order placed successfully!');
      window.open(res.data.whatsappUrl, '_blank');
      setCart([]);
      setShowOrderForm(false);
      setShowCart(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order!');
    } finally {
      setOrdering(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94A3B8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading store...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Store Not Found</h2>
          <p style={{ color: '#64748B', fontSize: '15px' }}>This store doesn't exist or hasn't been published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* Store Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '48px 20px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {business.logo ? (
            <img src={`http://localhost:5000${business.logo}`} alt="logo" style={{ width: '88px', height: '88px', borderRadius: '22px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.15)', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
          ) : (
            <div style={{ width: '88px', height: '88px', borderRadius: '22px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 8px 24px rgba(0,200,150,0.3)' }}>
              {business.name.charAt(0)}
            </div>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>{business.name}</h1>
          {business.description && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.6' }}>{business.description}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {business.address?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                <FiMapPin size={13} /> {business.address.city}{business.address.state ? `, ${business.address.state}` : ''}
              </div>
            )}
            {business.phone && (
              <a href={`tel:${business.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
                <FiPhone size={13} /> {business.phone}
              </a>
            )}
            {business.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                <FiMail size={13} /> {business.email}
              </div>
            )}
          </div>

          {/* Social Links */}
          {(business.socialLinks?.instagram || business.socialLinks?.facebook) && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
              {business.socialLinks?.instagram && (
                <a href={business.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>
                  <FiInstagram size={15} />
                </a>
              )}
              {business.socialLinks?.facebook && (
                <a href={business.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>
                  <FiFacebook size={15} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #F1F5F9', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', color: '#0F172A' }}
              onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#F8FAFC'; }}
            />
          </div>

          <a href={`https://wa.me/91${business.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(37,211,102,0.3)', flexShrink: 0 }}>
            <FiMessageCircle size={14} /> Chat
          </a>

          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: cartCount > 0 ? 'linear-gradient(135deg, #00C896, #00A87E)' : '#F8FAFC', color: cartCount > 0 ? 'white' : '#64748B', border: cartCount > 0 ? 'none' : '1.5px solid #F1F5F9', borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Inter, sans-serif', boxShadow: cartCount > 0 ? '0 4px 12px rgba(0,200,150,0.3)' : 'none', flexShrink: 0 }}>
            <FiShoppingCart size={15} />
            Cart
            {cartCount > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' }}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)} style={{ padding: '7px 16px', borderRadius: '99px', border: `1.5px solid ${(selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '#00C896' : '#F1F5F9'}`, background: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? 'rgba(0,200,150,0.08)' : 'white', color: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '#00A87E' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>No products yet</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Products will be available soon!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Products <span style={{ color: '#94A3B8', fontWeight: '500', fontSize: '14px' }}>({filtered.length})</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filtered.map(product => {
                const inCart = cart.find(i => i._id === product._id);
                return (
                  <div key={product._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                    <div style={{ height: '180px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {product.images?.[0] ? (
                        <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '48px', opacity: 0.3 }}>📦</span>
                      )}
                      {product.isFeatured && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>⭐ Featured</div>
                      )}
                      {product.discountPrice && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>{product.discountPercent}% OFF</div>
                      )}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{product.name}</h3>
                      {product.description && <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px', lineHeight: '1.5' }}>{product.description.substring(0, 55)}{product.description.length > 55 ? '...' : ''}</p>}
                      {product.category && <span style={{ fontSize: '10px', color: '#6366F1', background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: '99px', fontWeight: '600', display: 'inline-block', marginBottom: '10px' }}>{product.category}</span>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{product.discountPrice || product.price}</span>
                        {product.discountPrice && <span style={{ fontSize: '13px', color: '#CBD5E1', textDecoration: 'line-through' }}>₹{product.price}</span>}
                      </div>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,200,150,0.08)', borderRadius: '10px', padding: '4px' }}>
                          <button onClick={() => removeFromCart(product._id)} style={{ width: '34px', height: '34px', border: 'none', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,200,150,0.3)' }}>
                            <FiMinus size={14} />
                          </button>
                          <span style={{ fontWeight: '800', color: '#00A87E', fontSize: '15px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{inCart.quantity}</span>
                          <button onClick={() => addToCart(product)} style={{ width: '34px', height: '34px', border: 'none', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,200,150,0.3)' }}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(0,200,150,0.3)', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                          <FiShoppingCart size={14} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: '#0F172A', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          Powered by <span style={{ color: '#00C896', fontWeight: '600' }}>BizSathi</span> — India's own business platform
        </p>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '380px', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Your Cart</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{cartCount} items</p>
              </div>
              <button onClick={() => setShowCart(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #F1F5F9', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <FiX size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>🛒</div>
                  <h4 style={{ color: '#334155', fontWeight: '600', marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cart is empty</h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px' }}>Add products to get started</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ width: '52px', height: '52px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid #F1F5F9' }}>
                      {item.images?.[0] ? <img src={`http://localhost:5000${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '20px' }}>📦</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: '#00C896', fontWeight: '700', marginTop: '2px' }}>₹{item.discountPrice || item.price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => removeFromCart(item._id)} style={{ width: '28px', height: '28px', border: '1.5px solid #E2E8F0', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <FiMinus size={12} />
                      </button>
                      <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '20px', textAlign: 'center', color: '#0F172A' }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: '28px', height: '28px', border: '1.5px solid #E2E8F0', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#0F172A' }}>Total</span>
                  <span style={{ fontWeight: '800', fontSize: '20px', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowOrderForm(true); }} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
                  <FiMessageCircle size={17} /> Order on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order Details</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Fill in your details to place order</p>
              </div>
              <button onClick={() => setShowOrderForm(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #F1F5F9', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <FiX size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Your Name *</label>
              <input placeholder="Full name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Phone Number *</label>
              <input placeholder="10 digit number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} maxLength={10} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Delivery Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['pickup', 'delivery'].map(type => (
                  <button key={type} onClick={() => setDeliveryType(type)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `2px solid ${deliveryType === type ? '#00C896' : '#F1F5F9'}`, background: deliveryType === type ? 'rgba(0,200,150,0.06)' : 'white', color: deliveryType === type ? '#00A87E' : '#64748B', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                    {type === 'pickup' ? '🏪 Store Pickup' : '🚚 Home Delivery (+₹50)'}
                  </button>
                ))}
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Delivery Address</label>
                <input placeholder="Street, Area" value={customerInfo.address.street} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, street: e.target.value}})} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', marginBottom: '8px', color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input placeholder="City" value={customerInfo.address.city} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, city: e.target.value}})} style={{ padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <input placeholder="Pincode" value={customerInfo.address.pincode} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, pincode: e.target.value}})} maxLength={6} style={{ padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order Summary</div>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: '600' }}>₹{(item.discountPrice || item.price) * item.quantity}</span>
                </div>
              ))}
              {deliveryType === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                  <span>Delivery Charge</span><span style={{ fontWeight: '600' }}>₹50</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: '#00C896', borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <span>Total</span>
                <span>₹{cartTotal + (deliveryType === 'delivery' ? 50 : 0)}</span>
              </div>
            </div>

            <button onClick={handleOrder} disabled={ordering} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: ordering ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
              {ordering ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <><FiMessageCircle size={18} /> Order on WhatsApp</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
