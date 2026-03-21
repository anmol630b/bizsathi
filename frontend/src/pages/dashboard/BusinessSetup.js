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
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'shop', template: 'modern',
    phone: '', whatsapp: '', email: '',
    address: { street: '', city: '', state: '', pincode: '' },
    socialLinks: { instagram: '', facebook: '', youtube: '' }
  });
  const navigate = useNavigate();

  useEffect(() => { fetchBusiness(); }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/business/my');
      if (res.data.business) {
        setBusiness(res.data.business);
        if (res.data.business.logo) {
          setLogoPreview(`http://localhost:5000${res.data.business.logo}`);
        }
        setFormData({
          name: res.data.business.name || '',
          description: res.data.business.description || '',
          category: res.data.business.category || 'shop',
          template: res.data.business.template || 'modern',
          phone: res.data.business.phone || '',
          whatsapp: res.data.business.whatsapp || '',
          email: res.data.business.email || '',
          address: res.data.business.address || { street: '', city: '', state: '', pincode: '' },
          socialLinks: res.data.business.socialLinks || { instagram: '', facebook: '', youtube: '' }
        });
      }
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be less than 5MB!'); return; }
    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('logo', file);
      const res = await api.post('/business/upload-logo', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Logo uploaded!');
      setBusiness(res.data.business);
    } catch (err) {
      toast.error('Logo upload failed!');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.whatsapp) {
      toast.error('Business name, phone and WhatsApp number are required!');
      return;
    }
    setLoading(true);
    try {
      if (business) {
        await api.put('/business/update', formData);
        toast.success('Business updated!');
      } else {
        const res = await api.post('/business/create', formData);
        setBusiness(res.data.business);
        toast.success('Business created!');
      }
      if (step < 3) setStep(step + 1);
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

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Contact & Address' },
    { num: 3, label: 'Design & Publish' }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', desc: 'Clean & professional', color: '#1D9E75', emoji: '✨' },
    { id: 'classic', name: 'Classic', desc: 'Traditional look', color: '#534AB7', emoji: '🏛️' },
    { id: 'bold', name: 'Bold', desc: 'Strong & impactful', color: '#D85A30', emoji: '🔥' },
    { id: 'minimal', name: 'Minimal', desc: 'Simple & clean', color: '#888', emoji: '⚪' }
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

  return (
    <DashboardLayout>
      <div className="fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)', marginBottom: '8px' }}>
            {business ? 'Update Business' : 'Setup Your Business'}
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Fill in your business details and publish your website</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div onClick={() => business && setStep(s.num)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: business ? 'pointer' : 'default' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= s.num ? 'var(--primary)' : 'var(--gray-200)', color: step >= s.num ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', transition: 'all 0.3s' }}>
                  {step > s.num ? <FiCheck size={14} /> : s.num}
                </div>
                <span style={{ fontSize: '13px', fontWeight: step === s.num ? '600' : '400', color: step === s.num ? 'var(--primary)' : 'var(--gray-400)' }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: step > s.num ? 'var(--primary)' : 'var(--gray-200)', margin: '0 12px', transition: 'background 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card" style={{ padding: '32px' }}>

          {/* Step 1 - Basic Info */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: 'var(--gray-800)' }}>Basic Information</h3>

              {/* Logo Upload */}
              <div className="form-group">
                <label className="form-label">Business Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--gray-100)', border: '2px dashed var(--gray-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FiCamera size={24} color="var(--gray-400)" />
                    )}
                  </div>
                  <div>
                    <input type="file" ref={logoRef} accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    <button type="button" onClick={() => logoRef.current.click()} className="btn btn-outline btn-sm" style={{ gap: '6px', marginBottom: '6px' }} disabled={logoUploading}>
                      {logoUploading ? <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> : <><FiUpload size={14} /> Upload Logo</>}
                    </button>
                    <p style={{ fontSize: '11px', color: 'var(--gray-400)' }}>PNG, JPG up to 5MB. Recommended: 200x200px</p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input name="name" className="form-input" placeholder="e.g. Sharma General Store" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" placeholder="Tell customers about your business..." value={formData.description} onChange={handleChange} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Business Category *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {categories.map(cat => (
                    <div key={cat.id} onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))} style={{ padding: '12px 8px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${formData.category === cat.id ? 'var(--primary)' : 'var(--gray-200)'}`, background: formData.category === cat.id ? 'var(--primary-light)' : 'white', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>{cat.emoji}</div>
                      <div style={{ fontSize: '11px', fontWeight: '500', color: formData.category === cat.id ? 'var(--primary)' : 'var(--gray-600)' }}>{cat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {loading ? <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : 'Save & Continue'}
              </button>
            </div>
          )}

          {/* Step 2 - Contact */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: 'var(--gray-800)' }}>Contact & Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input name="phone" className="form-input" placeholder="10 digit number" value={formData.phone} onChange={handleChange} maxLength={10} />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number *</label>
                  <input name="whatsapp" className="form-input" placeholder="WhatsApp number" value={formData.whatsapp} onChange={handleChange} maxLength={10} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Business Email (Optional)</label>
                <input name="email" type="email" className="form-input" placeholder="business@email.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input name="address.street" className="form-input" placeholder="Street, Area, Locality" value={formData.address.street} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input name="address.city" className="form-input" placeholder="City" value={formData.address.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input name="address.state" className="form-input" placeholder="State" value={formData.address.state} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input name="address.pincode" className="form-input" placeholder="Pincode" value={formData.address.pincode} onChange={handleChange} maxLength={6} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Social Links (Optional)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input name="socialLinks.instagram" className="form-input" placeholder="Instagram URL" value={formData.socialLinks.instagram} onChange={handleChange} />
                  <input name="socialLinks.facebook" className="form-input" placeholder="Facebook URL" value={formData.socialLinks.facebook} onChange={handleChange} />
                  <input name="socialLinks.youtube" className="form-input" placeholder="YouTube URL" value={formData.socialLinks.youtube} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Back</button>
                <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 2, padding: '12px' }}>
                  {loading ? <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : 'Save & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Design & Publish */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: 'var(--gray-800)' }}>Choose Template & Publish</h3>
              <div className="form-group">
                <label className="form-label">Website Template</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {templates.map(tmpl => (
                    <div key={tmpl.id} onClick={() => setFormData(prev => ({ ...prev, template: tmpl.id }))} style={{ padding: '16px 12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${formData.template === tmpl.id ? tmpl.color : 'var(--gray-200)'}`, background: formData.template === tmpl.id ? tmpl.color + '15' : 'white', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '28px', marginBottom: '6px' }}>{tmpl.emoji}</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: formData.template === tmpl.id ? tmpl.color : 'var(--gray-700)' }}>{tmpl.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>{tmpl.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {business && (
                <div style={{ background: 'var(--primary-light)', borderRadius: '12px', padding: '20px', marginTop: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <FiGlobe color="var(--primary)" size={18} />
                    <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '14px' }}>Your Store URL</span>
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--gray-700)', wordBreak: 'break-all' }}>
                    {window.location.origin}/store/<strong>{business.slug}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '6px' }}>This URL will be active after publishing</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Back</button>
                <button onClick={handlePublish} disabled={publishing} className="btn btn-primary" style={{ flex: 2, padding: '12px', gap: '8px' }}>
                  {publishing ? <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : <><FiGlobe size={16} /> {business?.isPublished ? 'Update & Republish' : 'Publish Website'}</>}
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
