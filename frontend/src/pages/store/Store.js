import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMessageCircle, FiSearch, FiShoppingCart, FiPlus, FiMinus, FiX, FiInstagram, FiFacebook, FiStar } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Store = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const orderNow = (product) => {
    const msg = `Hi! I want to order:\n\n*${product.name}*\nPrice: ₹${product.discountPrice || product.price}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const addToCart = (product) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      setCart(cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`Added to cart!`, { icon: '🛒', duration: 1500 });
  };

  const removeFromCart = (id) => {
    const existing = cart.find(i => i._id === id);
    if (existing?.qty === 1) setCart(cart.filter(i => i._id !== id));
    else setCart(cart.map(i => i._id === id ? { ...i, qty: i.qty - 1 } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const orderCart = () => {
    if (!cart.length) return;
    const items = cart.map(i => `• ${i.name} x${i.qty} = ₹${(i.discountPrice || i.price) * i.qty}`).join('\n');
    const msg = `Hi! I want to order:\n\n${items}\n\n*Total: ₹${cartTotal}*\n\nPlease confirm my order.`;
    window.open(`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]);
    setShowCart(false);
    toast.success('Order sent on WhatsApp!', { icon: '🎉' });
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#94A3B8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading store...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Store Not Found</h2>
        <p style={{ color: '#94A3B8', marginTop: '8px' }}>This store doesn't exist or hasn't been published.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* Store Header */}
      <div style={{ background: 'linear-gradient(160deg, #0F172A, #1E293B)', padding: '48px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,200,150,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {business.logo ? (
            <img src={`${API_URL}${business.logo}`} alt="logo" style={{ width: '88px', height: '88px', borderRadius: '22px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.1)', marginBottom: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }} />
          ) : (
            <div style={{ width: '88px', height: '88px', borderRadius: '22px', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px', fontWeight: '800', color: 'white', boxShadow: '0 12px 32px rgba(0,200,150,0.3)' }}>
              {business.name.charAt(0)}
            </div>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', letterSpacing: '-0.02em' }}>{business.name}</h1>
          {business.description && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: '460px', margin: '0 auto 20px', lineHeight: '1.7' }}>{business.description}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {business.address?.city && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><FiMapPin size={12} />{business.address.city}{business.address.state ? `, ${business.address.state}` : ''}</span>}
            {business.phone && <a href={`tel:${business.phone}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}><FiPhone size={12} />{business.phone}</a>}
          </div>

          <a href={`https://wa.me/91${business.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', padding: '11px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 8px 20px rgba(37,211,102,0.35)' }}>
            <FiMessageCircle size={15} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Sticky Bar */}
      <div style={{ background: 'white', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', borderBottom: '1px solid #F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 38px', border: '1.5px solid #F1F5F9', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = '#00C896'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#F1F5F9'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: cartCount > 0 ? '#0F172A' : 'white', color: cartCount > 0 ? 'white' : '#64748B', border: cartCount > 0 ? 'none' : '1.5px solid #F1F5F9', borderRadius: '12px', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif', boxShadow: cartCount > 0 ? '0 6px 16px rgba(15,23,42,0.2)' : 'none', flexShrink: 0, transition: 'all 0.2s' }}>
            <FiShoppingCart size={16} />
            {cartCount > 0 ? `Cart (${cartCount}) — ₹${cartTotal}` : 'Cart'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px' }}>

        {/* Categories */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                style={{ padding: '8px 18px', borderRadius: '99px', border: 'none', background: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '#0F172A' : '#F1F5F9', color: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? 'white' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0, boxShadow: (selectedCategory === cat || (!selectedCategory && cat === 'All')) ? '0 4px 12px rgba(15,23,42,0.2)' : 'none' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px', opacity: 0.25 }}>📦</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>No products yet</h3>
            <p style={{ color: '#94A3B8', marginTop: '8px' }}>Products will be available soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filtered.map(product => {
              const inCart = cart.find(i => i._id === product._id);
              return (
                <div key={product._id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'all 0.3s', border: '1px solid #F8FAFC' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}>

                  {/* Product Image */}
                  <div onClick={() => setSelectedProduct(product)} style={{ height: '200px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                    {product.images?.[0] ? (
                      <img src={`${API_URL}${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    ) : <span style={{ fontSize: '52px', opacity: 0.2 }}>📦</span>}
                    {product.isFeatured && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>⭐ Featured</div>}
                    {product.discountPrice && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>{product.discountPercent}% OFF</div>}
                  </div>

                  <div style={{ padding: '16px' }}>
                    <h3 onClick={() => setSelectedProduct(product)} style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif', cursor: 'pointer', lineHeight: '1.3' }}>{product.name}</h3>
                    {product.description && <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px', lineHeight: '1.6' }}>{product.description.substring(0, 65)}{product.description.length > 65 ? '...' : ''}</p>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{product.discountPrice || product.price}</span>
                      {product.discountPrice && <span style={{ fontSize: '13px', color: '#CBD5E1', textDecoration: 'line-through' }}>₹{product.price}</span>}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Quick WhatsApp Order */}
                      <button onClick={() => orderNow(product)} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(37,211,102,0.3)', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <FiMessageCircle size={14} /> Order Now
                      </button>

                      {/* Add to Cart */}
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', borderRadius: '12px', padding: '6px' }}>
                          <button onClick={() => removeFromCart(product._id)} style={{ width: '32px', height: '32px', border: 'none', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', color: '#0F172A' }}>
                            <FiMinus size={13} />
                          </button>
                          <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>{inCart.qty}</span>
                          <button onClick={() => addToCart(product)} style={{ width: '32px', height: '32px', border: 'none', background: '#0F172A', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <FiPlus size={13} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} style={{ width: '44px', height: '44px', background: '#F8FAFC', border: '1.5px solid #F1F5F9', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0, transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#0F172A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#0F172A'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                          <FiShoppingCart size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: '#F1F5F9', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#CBD5E1', fontSize: '12px' }}>
          Powered by <span style={{ color: '#00C896', fontWeight: '700' }}>BizSathi</span> — India's own business platform
        </p>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedProduct(null)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            {selectedProduct.images?.[0] ? (
              <img src={`${API_URL}${selectedProduct.images[0]}`} alt={selectedProduct.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '200px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', opacity: 0.2 }}>📦</div>
            )}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '1.3', flex: 1 }}>{selectedProduct.name}</h2>
                <button onClick={() => setSelectedProduct(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #F1F5F9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0, marginLeft: '12px' }}>
                  <FiX size={15} />
                </button>
              </div>
              {selectedProduct.description && <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7', marginBottom: '16px' }}>{selectedProduct.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#00C896', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{selectedProduct.discountPrice || selectedProduct.price}</span>
                {selectedProduct.discountPrice && (
                  <>
                    <span style={{ fontSize: '16px', color: '#CBD5E1', textDecoration: 'line-through' }}>₹{selectedProduct.price}</span>
                    <span style={{ background: '#FEF2F2', color: '#EF4444', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>{selectedProduct.discountPercent}% OFF</span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { orderNow(selectedProduct); setSelectedProduct(null); }} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 6px 16px rgba(37,211,102,0.35)' }}>
                  <FiMessageCircle size={16} /> Order on WhatsApp
                </button>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{ flex: 1, padding: '14px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
                  <FiShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '380px', background: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '22px 24px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '17px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Your Cart</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCart(false)} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1.5px solid #F1F5F9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                <FiX size={15} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '44px', opacity: 0.2, marginBottom: '12px' }}>🛒</div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cart is empty</h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '6px' }}>Add products to order</p>
                </div>
              ) : cart.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ width: '54px', height: '54px', background: '#F8FAFC', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    {item.images?.[0] ? <img src={`${API_URL}${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📦</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: '#00C896', fontWeight: '800', marginTop: '2px' }}>₹{item.discountPrice || item.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => removeFromCart(item._id)} style={{ width: '28px', height: '28px', border: '1.5px solid #F1F5F9', background: 'white', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><FiMinus size={11} /></button>
                    <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ width: '28px', height: '28px', border: '1.5px solid #F1F5F9', background: 'white', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><FiPlus size={11} /></button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #F8FAFC', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600', color: '#64748B', fontSize: '14px' }}>Total</span>
                  <span style={{ fontWeight: '800', fontSize: '20px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button onClick={orderCart} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 20px rgba(37,211,102,0.35)' }}>
                  <FiMessageCircle size={17} /> Order All on WhatsApp
                </button>
                <p style={{ textAlign: 'center', fontSize: '11px', color: '#CBD5E1', marginTop: '10px' }}>WhatsApp will open with your order details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
