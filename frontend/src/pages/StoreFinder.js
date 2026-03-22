import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiNavigation, FiShoppingBag, FiX } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', label: 'All', emoji: '🏪' },
  { id: 'shop', label: 'Shop', emoji: '🛒' },
  { id: 'gym', label: 'Gym', emoji: '💪' },
  { id: 'coaching', label: 'Coaching', emoji: '📚' },
  { id: 'salon', label: 'Salon', emoji: '💇' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'medical', label: 'Medical', emoji: '🏥' },
  { id: 'other', label: 'Other', emoji: '🏢' }
];

const categoryColors = {
  shop: '#00C896', gym: '#6366F1', coaching: '#F59E0B',
  salon: '#EC4899', restaurant: '#EF4444', medical: '#06B6D4', other: '#8B5CF6'
};

const StoreFinder = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('all');
  const [cities, setCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || API_URL;

  useEffect(() => {
    fetchCities();
    fetchStores();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await api.get('/stores/cities');
      setCities(res.data.cities || []);
    } catch (err) {}
  };

  const fetchStores = async (params = {}) => {
    setLoading(true);
    setSearched(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.lat) queryParams.append('lat', params.lat);
      if (params.lng) queryParams.append('lng', params.lng);
      if (params.city || city) queryParams.append('city', params.city || city);
      if (category !== 'all') queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      queryParams.append('radius', '50');
      const res = await api.get(`/stores/nearby?${queryParams}`);
      setStores(res.data.businesses || []);
    } catch (err) {
      toast.error('Could not load stores!');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationLoading(false);
        toast.success('Location detected!');
        fetchStores({ lat: latitude, lng: longitude });
      },
      () => { setLocationLoading(false); toast.error('Could not detect location. Please enter city.'); },
      { timeout: 10000 }
    );
  };

  const handleSearch = (e) => { e.preventDefault(); fetchStores(); };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', padding: '64px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '18px', color: 'white' }}>BizSathi</span>
          </Link>

          <h1 style={{ fontSize: '40px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '12px', letterSpacing: '-0.03em' }}>
            Find Stores Near You
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Discover local businesses across India
          </p>

          <form onSubmit={handleSearch} style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '8px', display: 'flex', gap: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input placeholder="Search stores..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} />
              </div>
              <div style={{ width: '1px', background: '#F1F5F9', margin: '8px 0' }} />
              <div style={{ position: 'relative', minWidth: '160px' }}>
                <FiMapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                <input placeholder="City..." value={city} onChange={e => setCity(e.target.value)} list="cities-list"
                  style={{ width: '100%', padding: '12px 14px 12px 36px', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', fontFamily: 'Inter, sans-serif', color: '#0F172A', boxSizing: 'border-box' }} />
                <datalist id="cities-list">
                  {cities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,200,150,0.3)', flexShrink: 0 }}>
                Search
              </button>
            </div>
          </form>

          <div style={{ marginTop: '16px' }}>
            <button onClick={handleGetLocation} disabled={locationLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {locationLoading ? <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <FiNavigation size={14} />}
              {locationLoading ? 'Detecting...' : 'Use My Location'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setTimeout(() => fetchStores(), 100); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '99px', border: 'none', background: category === cat.id ? '#0F172A' : '#F8FAFC', color: category === cat.id ? 'white' : '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0, boxShadow: category === cat.id ? '0 4px 12px rgba(15,23,42,0.2)' : 'none' }}>
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {searched && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {loading ? 'Searching...' : `${stores.length} Store${stores.length !== 1 ? 's' : ''} Found`}
            </h2>
            {userLocation && <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Sorted by distance</p>}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid #F1F5F9', borderTopColor: '#00C896', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ color: '#94A3B8', fontSize: '15px' }}>Finding stores...</p>
          </div>
        )}

        {!loading && searched && stores.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}>🏪</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>No stores found</h3>
            <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '24px' }}>Try a different city or category</p>
            <button onClick={() => { setSearch(''); setCity(''); setCategory('all'); fetchStores(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              <FiX size={14} /> Clear Filters
            </button>
          </div>
        )}

        {!loading && stores.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {stores.map(store => (
              <div key={store._id} onClick={() => navigate(`/store/${store.slug}`)}
                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F8FAFC', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}>

                <div style={{ height: '120px', background: `linear-gradient(135deg, ${categoryColors[store.category] || '#00C896'}20, ${categoryColors[store.category] || '#00C896'}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {store.logo ? (
                    <img src={`${API_URL}${store.logo}`} alt={store.name} style={{ width: '72px', height: '72px', borderRadius: '18px', objectFit: 'cover', border: '3px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }} />
                  ) : (
                    <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: categoryColors[store.category] || '#00C896', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: 'white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                      {store.name.charAt(0)}
                    </div>
                  )}
                  {store.distance !== null && store.distance !== undefined && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', color: '#0F172A', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiNavigation size={10} color="#00C896" /> {store.distance} km
                    </div>
                  )}
                </div>

                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '1.3' }}>{store.name}</h3>
                    <span style={{ background: (categoryColors[store.category] || '#00C896') + '15', color: categoryColors[store.category] || '#00C896', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', flexShrink: 0, marginLeft: '8px' }}>
                      {store.category}
                    </span>
                  </div>

                  {store.description && (
                    <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '12px' }}>
                      {store.description.substring(0, 70)}{store.description.length > 70 ? '...' : ''}
                    </p>
                  )}

                  {store.address?.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
                      <FiMapPin size={11} /> {store.address.city}{store.address.state ? `, ${store.address.state}` : ''}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, padding: '10px', background: '#0F172A', color: 'white', borderRadius: '12px', fontSize: '13px', fontWeight: '700', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                      Visit Store
                    </div>
                    <div onClick={e => { e.stopPropagation(); window.open(`https://wa.me/91${store.whatsapp}`, '_blank'); }}
                      style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #25D366, #1DAA54)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37,211,102,0.3)', flexShrink: 0, fontSize: '18px' }}>
                      💬
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗺️</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Discover Local Businesses</h3>
            <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
              Search by city, use your location, or browse by category
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleGetLocation} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '14px', padding: '13px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                <FiNavigation size={15} /> Use My Location
              </button>
              <button onClick={() => fetchStores()} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#0F172A', border: '2px solid #F1F5F9', borderRadius: '14px', padding: '13px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                <FiShoppingBag size={15} /> Browse All Stores
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreFinder;
