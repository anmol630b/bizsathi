import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMail, FiShoppingCart, FiPlus, FiMinus, FiMessageCircle, FiInstagram, FiFacebook, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Store = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: { street: '', city: '', pincode: '' } });
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { fetchStore(); }, [slug]);

  const fetchStore = async () => {
    try {
      const [bizRes] = await Promise.all([
        api.get(`/business/store/${slug}`)
      ]);
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
    toast.success(`${product.name} added!`);
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
      toast.error('Naam aur phone number zaroori hai!');
      return;
    }
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
      toast.success('Order place ho gaya!');
      window.open(res.data.whatsappUrl, '_blank');
      setCart([]);
      setShowOrderForm(false);
      setShowCart(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order nahi hua!');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--gray-400)' }}>Store load ho raha hai...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '8px' }}>Store Nahi Mila</h2>
          <p style={{ color: 'var(--gray-400)' }}>Yeh store exist nahi karta ya abhi published nahi hai.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: 'Inter, sans-serif' }}>
      {/* Store Header */}
      <div style={{ background: 'linear-gradient(135deg, #1D9E75, #534AB7)', padding: '40px 20px', textAlign: 'center', position: 'relative' }}>
        {business.logo && (
          <img src={`http://localhost:5000${business.logo}`} alt="logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', marginBottom: '16px' }} />
        )}
        {!business.logo && (
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', fontWeight: '700', color: 'white' }}>
            {business.name.charAt(0)}
          </div>
        )}
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>{business.name}</h1>
        {business.description && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 16px', lineHeight: '1.6' }}>{business.description}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {business.address?.city && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
              <FiMapPin size={14} /> {business.address.city}, {business.address.state}
            </div>
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>
              <FiPhone size={14} /> {business.phone}
            </a>
          )}
          {business.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
              <FiMail size={14} /> {business.email}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gray-100)', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }} />
        </div>
        <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          <FiShoppingCart size={16} />
          Cart
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{cartCount}</span>
          )}
        </button>
        <a href={`https://wa.me/91${business.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm" style={{ gap: '6px', height: '38px' }}>
          <FiMessageCircle size={14} /> WhatsApp
        </a>
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Abhi koi product nahi hai</h3>
            <p>Jald hi products available honge!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)' }}>Products ({filtered.length})</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filtered.map(product => {
                const inCart = cart.find(i => i._id === product._id);
                return (
                  <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  >
                    <div style={{ height: '160px', background: 'linear-gradient(135deg, var(--gray-100), var(--gray-50))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                      {product.images?.[0] ? (
                        <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '📦'}
                      {product.isFeatured && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#EF9F27', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>Featured</div>
                      )}
                      {product.discountPrice && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>
                          {product.discountPercent}% OFF
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' }}>{product.name}</h3>
                      {product.description && <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '8px', lineHeight: '1.5' }}>{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</p>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>Rs.{product.discountPrice || product.price}</span>
                        {product.discountPrice && <span style={{ fontSize: '12px', color: 'var(--gray-300)', textDecoration: 'line-through' }}>Rs.{product.price}</span>}
                      </div>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--primary-light)', borderRadius: '8px', padding: '4px' }}>
                          <button onClick={() => removeFromCart(product._id)} style={{ width: '32px', height: '32px', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiMinus size={14} />
                          </button>
                          <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '14px' }}>{inCart.quantity}</span>
                          <button onClick={() => addToCart(product)} style={{ width: '32px', height: '32px', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '13px', gap: '6px' }}>
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
      <div style={{ background: 'var(--gray-800)', padding: '24px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: 'var(--gray-400)', fontSize: '13px' }}>
          Powered by <span style={{ color: 'var(--primary)', fontWeight: '600' }}>BizSathi</span> — India ka apna business platform
        </p>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '380px', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: '600', fontSize: '16px' }}>Cart ({cartCount} items)</h3>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--gray-400)' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cart.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🛒</div>
                  <h3>Cart empty hai</h3>
                  <p>Products add karo</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {item.images?.[0] ? <img src={`http://localhost:5000${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gray-800)' }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>Rs.{item.discountPrice || item.price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => removeFromCart(item._id)} style={{ width: '28px', height: '28px', border: '1px solid var(--gray-200)', background: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiMinus size={12} />
                      </button>
                      <span style={{ fontWeight: '600', fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: '28px', height: '28px', border: '1px solid var(--gray-200)', background: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>Total</span>
                  <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>Rs.{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowOrderForm(true); }} className="btn btn-primary" style={{ width: '100%', padding: '12px', gap: '8px' }}>
                  <FiMessageCircle size={16} /> Place Order on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif' }}>Order Details</h3>
              <button onClick={() => setShowOrderForm(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--gray-400)' }}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Aapka Naam *</label>
              <input className="form-input" placeholder="Full name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-input" placeholder="10 digit number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} maxLength={10} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['pickup', 'delivery'].map(type => (
                  <button key={type} onClick={() => setDeliveryType(type)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${deliveryType === type ? 'var(--primary)' : 'var(--gray-200)'}`, background: deliveryType === type ? 'var(--primary-light)' : 'white', color: deliveryType === type ? 'var(--primary)' : 'var(--gray-500)', fontWeight: deliveryType === type ? '600' : '400', cursor: 'pointer', fontSize: '13px', textTransform: 'capitalize' }}>
                    {type === 'pickup' ? 'Store Pickup' : 'Home Delivery (+Rs.50)'}
                  </button>
                ))}
              </div>
            </div>
            {deliveryType === 'delivery' && (
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <input className="form-input" placeholder="Street, Area" value={customerInfo.address.street} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, street: e.target.value}})} style={{ marginBottom: '8px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input className="form-input" placeholder="City" value={customerInfo.address.city} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, city: e.target.value}})} />
                  <input className="form-input" placeholder="Pincode" value={customerInfo.address.pincode} onChange={e => setCustomerInfo({...customerInfo, address: {...customerInfo.address, pincode: e.target.value}})} maxLength={6} />
                </div>
              </div>
            )}
            <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>Order Summary</div>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rs.{(item.discountPrice || item.price) * item.quantity}</span>
                </div>
              ))}
              {deliveryType === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                  <span>Delivery Charge</span><span>Rs.50</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '15px', color: 'var(--primary)', borderTop: '1px solid var(--gray-200)', paddingTop: '8px', marginTop: '8px' }}>
                <span>Total</span>
                <span>Rs.{cartTotal + (deliveryType === 'delivery' ? 50 : 0)}</span>
              </div>
            </div>
            <button onClick={handleOrder} className="btn btn-whatsapp" style={{ width: '100%', padding: '13px', gap: '8px', fontSize: '15px' }}>
              <FiMessageCircle size={18} /> Order on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
