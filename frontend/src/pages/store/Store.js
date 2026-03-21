import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMail, FiShoppingCart, FiPlus, FiMinus, FiMessageCircle, FiSearch, FiX, FiInstagram, FiFacebook, FiChevronRight } from 'react-icons/fi';
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
  const [orderStep, setOrderStep] = useState(1);
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
    toast.success(`${product.name} added!`, { icon: '🛒' });
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
      toast.error('Please enter your name and phone number');
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
      toast.success('Order placed successfully!', { icon: '🎉' });
      window.open(res.data.whatsappUrl, '_blank');
      setCart([]);
      setShowOrderForm(false);
      setShowCart(false);
      setOrderStep(1);
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

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: '1.5px solid #F1F5F9', borderRadius: '14px',
    fontSize: '15px', outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box', color: '#0F172A',
    background: '#FAFAFA', transition: 'all 0.3s'
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94A3B8', fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>Loading store...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏪</div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Store Not Found</h2>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>This store doesn't exist or hasn't been published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Store Header */}
      <div style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', padding: '56px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {business.logo ? (
            <img src={`http://localhost:5000${business.logo}`} alt="logo" style={{ width: '96px', height: '96px', borderRadius: '24px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.1)', marginBottom: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }} />
          ) : (
            <div style={{ width: '96px', height: '96px', borderRadius: '24px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 12px 32px rgba(0,200,150,0.3)' }}>
              {business.name.charAt(0)}
            </div>
          )}

          <h1 style={{ fontSize: '30px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '10px', letterSpacing: '-0.02em' }}>{business.name}</h1>
          {business.description && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.7' }}>{business.description}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {business.address?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
                <FiMapPin size={14} /> {business.address.city}{business.address.state ? `, ${business.address.state}` : ''}
              </div>
            )}
            {business.phone && (
              <a href={`tel:${business.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.45)', fontSize: '14px', textDecoration: 'none' }}>
                <FiPhone size={14} /> {business.phone}
              </a>
            )}
          </div>

          <a href={`https://wa.me/91${business.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', padding: '12px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 8px 20px rgba(37,211,102,0.35)' }}>
            <FiMessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div style={{ background: 'white', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,0.06)', borderBottom: '1px solid #F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '44px', padding: '12px 14px 12px 44px' }}
              onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; }} />
          </div>

          {/* Cart Button */}
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: cartCount > 0 ? 'linear-gradient(135deg, #00C896, #00A87E)' : 'white', color: cartCount > 0 ? 'white' : '#64748B', border: cartCount > 0 ? 'none' : '1.5px solid #F1F5F9', borderRadius: '14px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif', boxShadow: cartCount > 0 ? '0 6px 16px rgba(0,200,150,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s', flexShrink: 0 }}>
            <FiShoppingCart size={16} />
            {cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)} style={{ padding: '8px 18px', borderRadius: '99px', border: 'none', background: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '#0F172A' : '#F8FAFC', color: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? 'white' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s', boxShadow: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '0 4px 12px rgba(15,23,42,0.2)' : 'none' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px', opacity: 0.3 }}>📦</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>No products yet</h3>
            <p style={{ color: '#94A3B8', fontSize: '15px' }}>Products will be available soon!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>
                Products <span style={{ color: '#CBD5E1', fontWeight: '500', fontSize: '15px' }}>({filtered.length})</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {filtered.map(product => {
                const inCart = cart.find(i => i._id === product._id);
                return (
                  <div key={product._id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', border: '1px solid #F8FAFC' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}>

                    <div style={{ height: '200px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {product.images?.[0] ? (
                        <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                      ) : (
                        <span style={{ fontSize: '52px', opacity: 0.25 }}>📦</span>
                      )}
                      {product.isFeatured && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', boxShadow: '0 4px 10px rgba(245,158,11,0.4)' }}>⭐ Featured</div>
                      )}
                      {product.discountPrice && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', boxShadow: '0 4px 10px rgba(239,68,68,0.4)' }}>{product.discountPercent}% OFF</div>
                      )}
                    </div>

                    <div style={{ padding: '18px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '1.3' }}>{product.name}</h3>
                      {product.description && <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '12px', lineHeight: '1.6' }}>{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</p>}
                      {product.category && <span style={{ fontSize: '11px', color: '#6366F1', background: 'rgba(99,102,241,0.08)', padding: '3px 10px', borderRadius: '99px', fontWeight: '600', display: 'inline-block', marginBottom: '12px' }}>{product.category}</span>}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>₹{product.discountPrice || product.price}</span>
                        {product.discountPrice && <span style={{ fontSize: '14px', color: '#CBD5E1', textDecoration: 'line-through' }}>₹{product.price}</span>}
                      </div>

                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', borderRadius: '14px', padding: '6px' }}>
                          <button onClick={() => removeFromCart(product._id)} style={{ width: '38px', height: '38px', border: 'none', background: 'white', color: '#0F172A', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#0F172A'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                            <FiMinus size={14} />
                          </button>
                          <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{inCart.quantity}</span>
                          <button onClick={() => addToCart(product)} style={{ width: '38px', height: '38px', border: 'none', background: '#0F172A', color: 'white', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(15,23,42,0.2)', transition: 'all 0.2s' }}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '12px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 6px 16px rgba(15,23,42,0.15)', transition: 'all 0.3s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#0F172A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                          <FiShoppingCart size={15} /> Add to Cart
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
      <div style={{ background: '#F8FAFC', padding: '24px', textAlign: 'center', marginTop: '48px', borderTop: '1px solid #F1F5F9' }}>
        <p style={{ color: '#CBD5E1', fontSize: '13px' }}>
          Powered by <span style={{ color: '#00C896', fontWeight: '700' }}>BizSathi</span> — India's own business platform
        </p>
      </div>

      {/* Floating Cart Button - Mobile */}
      {cartCount > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
          <button onClick={() => setShowCart(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '99px', padding: '14px 24px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 12px 32px rgba(15,23,42,0.3)', whiteSpace: 'nowrap' }}>
            <FiShoppingCart size={18} />
            View Cart ({cartCount}) — ₹{cartTotal.toLocaleString('en-IN')}
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '400px', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)', animation: 'slideInRight 0.3s ease' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Your Cart</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCart(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #F1F5F9', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <FiX size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.25 }}>🛒</div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cart is empty</h4>
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>Add some products to get started</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ width: '56px', height: '56px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {item.images?.[0] ? <img src={`http://localhost:5000${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>📦</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: '#00C896', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{item.discountPrice || item.price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <button onClick={() => removeFromCart(item._id)} style={{ width: '30px', height: '30px', border: '1.5px solid #F1F5F9', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.2s' }}>
                        <FiMinus size={12} />
                      </button>
                      <span style={{ fontWeight: '800', fontSize: '15px', minWidth: '20px', textAlign: 'center', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: '30px', height: '30px', border: '1.5px solid #F1F5F9', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.2s' }}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid #F8FAFC', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#64748B' }}>Total Amount</span>
                  <span style={{ fontWeight: '800', fontSize: '22px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowOrderForm(true); setOrderStep(1); }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 20px rgba(37,211,102,0.35)', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <FiMessageCircle size={18} /> Proceed to Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form - Bottom Sheet */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={() => setShowOrderForm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }} />
          <div style={{ background: 'white', borderRadius: '28px 28px 0 0', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '8px 28px 32px', position: 'relative', zIndex: 1, boxShadow: '0 -20px 60px rgba(0,0,0,0.15)' }}>

            {/* Handle */}
            <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '99px', margin: '12px auto 24px' }} />

            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2].map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: orderStep >= s ? '#0F172A' : '#F1F5F9', color: orderStep >= s ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{s}</div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: orderStep === s ? '#0F172A' : '#94A3B8' }}>{s === 1 ? 'Your Details' : 'Confirm Order'}</span>
                  </div>
                  {i < 1 && <div style={{ flex: 1, height: '1.5px', background: orderStep > s ? '#0F172A' : '#F1F5F9', borderRadius: '99px' }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1 — Details */}
            {orderStep === 1 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px', letterSpacing: '-0.01em' }}>Your Details</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px' }}>We'll send your order confirmation on WhatsApp</p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Full Name *</label>
                  <input placeholder="Your full name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>WhatsApp Number *</label>
                  <input placeholder="10 digit number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} maxLength={10} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Delivery Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { id: 'pickup', label: 'Store Pickup', icon: '🏪', desc: 'Free' },
                      { id: 'delivery', label: 'Home Delivery', icon: '🚚', desc: '+₹50' }
                    ].map(type => (
                      <button key={type.id} onClick={() => setDeliveryType(type.id)} style={{ padding: '14px', borderRadius: '14px', border: `2px solid ${deliveryType === type.id ? '#0F172A' : '#F1F5F9'}`, background: deliveryType === type.id ? '#0F172A' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>
                        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{type.icon}</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: deliveryType === type.id ? 'white' : '#0F172A' }}>{type.label}</div>
                        <div style={{ fontSize: '11px', color: deliveryType === type.id ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginTop: '2px' }}>{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div style={{ marginBottom: '24px', background: '#F8FAFC', borderRadius: '16px', padding: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>Delivery Address</label>
                    <input placeholder="Street, Area, Locality" value={customerInfo.address.street} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, street: e.target.value}})} style={{ ...inputStyle, marginBottom: '8px' }}
                      onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; }}
                      onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input placeholder="City" value={customerInfo.address.city} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, city: e.target.value}})} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; }}
                        onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; }} />
                      <input placeholder="Pincode" value={customerInfo.address.pincode} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, pincode: e.target.value}})} maxLength={6} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; }}
                        onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#FAFAFA'; }} />
                    </div>
                  </div>
                )}

                <button onClick={() => {
                  if (!customerInfo.name || !customerInfo.phone) { toast.error('Please enter name and phone number'); return; }
                  setOrderStep(2);
                }} style={{ width: '100%', padding: '16px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 20px rgba(15,23,42,0.2)', transition: 'all 0.3s' }}>
                  Review Order <FiChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2 — Confirm */}
            {orderStep === 2 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px', letterSpacing: '-0.01em' }}>Confirm Order</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px' }}>Review your order before placing</p>

                {/* Customer Info Summary */}
                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Delivery Details</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{customerInfo.name}</div>
                  <div style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>{customerInfo.phone}</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>{deliveryType === 'pickup' ? '🏪 Store Pickup' : `🚚 Home Delivery — ${customerInfo.address.city}`}</div>
                </div>

                {/* Order Items */}
                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Order Items</div>
                  {cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#334155' }}>{item.name} <span style={{ color: '#94A3B8' }}>×{item.quantity}</span></span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>₹{(item.discountPrice || item.price) * item.quantity}</span>
                    </div>
                  ))}
                  {deliveryType === 'delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#334155' }}>Delivery Charge</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>₹50</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1.5px solid #E2E8F0', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Total</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{cartTotal + (deliveryType === 'delivery' ? 50 : 0)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setOrderStep(1)} style={{ flex: 1, padding: '16px', background: 'white', color: '#0F172A', border: '2px solid #F1F5F9', borderRadius: '16px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    ← Back
                  </button>
                  <button onClick={handleOrder} disabled={ordering} style={{ flex: 2, padding: '16px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: ordering ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 20px rgba(37,211,102,0.35)', transition: 'all 0.3s' }}>
                    {ordering ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <><FiMessageCircle size={17} /> Place Order</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
