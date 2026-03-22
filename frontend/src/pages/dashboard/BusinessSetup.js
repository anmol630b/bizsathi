import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiCheck, FiUpload, FiCamera } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const BusinessSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [business, setBusiness] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoRef = useRef();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('shop');
  const [template, setTemplate] = useState('modern');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || API_URL;

  useEffect(() => { fetchBusiness(); }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/business/my');
      if (res.data.business) {
        const b = res.data.business;
        setBusiness(b);
        setName(b.name || '');
        setDescription(b.description || '');
        setCategory(b.category || 'shop');
        setTemplate(b.template || 'modern');
        setPhone(b.phone || '');
        setWhatsapp(b.whatsapp || '');
        setEmail(b.email || '');
        setStreet(b.address?.street || '');
        setCity(b.address?.city || '');
        setState(b.address?.state || '');
        setPincode(b.address?.pincode || '');
        if (b.logo) setLogoPreview(`${API_URL}${b.logo}`);
      }
    } catch (err) {}
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('logo', file);
      await api.post('/business/upload-logo', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Logo uploaded!');
    } catch (err) {
      toast.error('Logo upload failed!');
    } finally {
      setLogoUploading(false);
    }
  };

  // Step 1 - name required only, phone collected in step 2
  const handleStep1 = async () => {
    if (!name.trim()) {
      toast.error('Business name is required!');
      return;
    }
    // Just go to step 2 - save will happen in step 2 with all required fields
    setStep(2);
  };

  // Step 2 - save everything together with all required fields
  const handleStep2 = async () => {
    if (!phone.trim() || !whatsapp.trim()) {
      toast.error('Phone and WhatsApp number are required!');
      return;
    }
    if (!name.trim()) {
      toast.error('Business name is required!');
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const data = {
        name, description, category, template,
        phone, whatsapp, email,
        address: { street, city, state, pincode }
      };
      if (business) {
        await api.put('/business/update', data);
        toast.success('Business updated!');
      } else {
        const res = await api.post('/business/create', data);
        setBusiness(res.data.business);
        toast.success('Business created!');
      }
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.post('/business/publish');
      toast.success('Website is now LIVE!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not publish!');
    } finally {
      setPublishing(false);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern', desc: 'Clean & professional', color: '#00C896', emoji: '✨' },
    { id: 'classic', name: 'Classic', desc: 'Traditional look', color: '#6366F1', emoji: '🏛️' },
    { id: 'bold', name: 'Bold', desc: 'Strong & impactful', color: '#EF4444', emoji: '🔥' },
    { id: 'minimal', name: 'Minimal', desc: 'Simple & clean', color: '#64748B', emoji: '⚪' }
  ];

  const categories = [
    { id: 'shop', label: 'General Shop', emoji: '🛒' },
    { id: 'gym', label: 'Gym & Fitness', emoji: '💪' },
    { id: 'coaching', label: 'Coaching', emoji: '📚' },
    { id: 'salon', label: 'Salon & Beauty', emoji: '💇' },
    { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
    { id: 'medical', label: 'Medical', emoji: '🏥' },
    { id: 'other', label: 'Other', emoji: '🏢' }
  ];

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '10px',
    fontSize: '14px', color: '#0F172A', background: 'white',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#475569', marginBottom: '6px'
  };

  const btnStyle = {
    width: '100%', height: '46px',
    background: 'linear-gradient(135deg, #00C896, #00A87E)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 14px rgba(0,200,150,0.3)'
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }} className="fade-in">
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {business ? 'Update Business' : 'Setup Your Business'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Fill in your business details and publish your website</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {[{ num: 1, label: 'Basic Info' }, { num: 2, label: 'Contact & Address' }, { num: 3, label: 'Design & Publish' }].map((s, i) => (
            <React.Fragment key={s.num}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= s.num ? '#00C896' : '#F1F5F9', color: step >= s.num ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                  {step > s.num ? <FiCheck size={14} /> : s.num}
                </div>
                <span style={{ fontSize: '13px', fontWeight: step === s.num ? '700' : '500', color: step === s.num ? '#00C896' : '#94A3B8', whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > s.num ? '#00C896' : '#F1F5F9', margin: '0 10px', transition: 'background 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '24px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Basic Information</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Business Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '14px', background: '#F8FAFC', border: '2px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {logoPreview ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiCamera size={22} color="#CBD5E1" />}
                  </div>
                  <div>
                    <input type="file" ref={logoRef} accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    <button type="button" onClick={() => logoRef.current.click()} disabled={logoUploading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #E2E8F0', background: 'white', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                      {logoUploading ? '...' : <><FiUpload size={13} /> Upload Logo</>}
                    </button>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Business Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ram General Store"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00C896'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell customers about your business..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                  onFocus={e => e.target.style.borderColor = '#00C896'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Business Category *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {categories.map(cat => (
                    <div key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '12px 8px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${category === cat.id ? '#00C896' : '#F1F5F9'}`, background: category === cat.id ? 'rgba(0,200,150,0.06)' : 'white', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>{cat.emoji}</div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: category === cat.id ? '#00A87E' : '#64748B' }}>{cat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleStep1} style={btnStyle}>
                Next: Contact Details →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '24px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Contact & Address</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10 digit number" maxLength={10} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp Number *</label>
                  <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp number" maxLength={10} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Email (Optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="business@email.com" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Street Address</label>
                <input type="text" value={street} onChange={e => setStreet(e.target.value)} placeholder="Street, Area, Locality" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="State" style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Pincode" maxLength={6} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00C896'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, height: '46px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>← Back</button>
                <button onClick={handleStep2} disabled={loading} style={{ ...btnStyle, flex: 2, width: 'auto' }}>
                  {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : 'Save & Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '24px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Choose Template & Publish</h3>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Website Template</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {templates.map(tmpl => (
                    <div key={tmpl.id} onClick={() => setTemplate(tmpl.id)} style={{ padding: '16px 12px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${template === tmpl.id ? tmpl.color : '#F1F5F9'}`, background: template === tmpl.id ? `${tmpl.color}10` : 'white', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '28px', marginBottom: '6px' }}>{tmpl.emoji}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: template === tmpl.id ? tmpl.color : '#475569' }}>{tmpl.name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{tmpl.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {business && (
                <div style={{ background: 'rgba(0,200,150,0.06)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', border: '1px solid rgba(0,200,150,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <FiGlobe color="#00C896" size={16} />
                    <span style={{ fontWeight: '700', color: '#00A87E', fontSize: '13px' }}>Your Store URL</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', wordBreak: 'break-all' }}>
                    {window.location.origin}/store/<strong>{business.slug}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>This URL will be active after publishing</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, height: '46px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569', fontFamily: 'Inter, sans-serif' }}>← Back</button>
                <button onClick={handlePublish} disabled={publishing} style={{ ...btnStyle, flex: 2, width: 'auto' }}>
                  {publishing ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <><FiGlobe size={16} /> {business?.isPublished ? 'Update & Republish' : 'Publish Website'}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessSetup;
