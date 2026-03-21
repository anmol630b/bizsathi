import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiZap, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Plans = () => {
  const [billing, setBilling] = useState('monthly');
  const { user } = useAuthStore();

  const plans = [
    {
      name: 'free', displayName: 'Free', description: 'Shuruat karne ke liye',
      price: { monthly: 0, yearly: 0 }, color: '#888780', popular: false,
      features: [
        { label: '10 Products', included: true },
        { label: '50 Orders/month', included: true },
        { label: 'WhatsApp Button', included: true },
        { label: 'Basic Website', included: true },
        { label: 'Analytics', included: false },
        { label: 'SEO Tools', included: false },
        { label: 'Custom Domain', included: false },
        { label: 'WhatsApp Marketing', included: false },
        { label: 'Payment Gateway', included: false },
        { label: 'Priority Support', included: false }
      ]
    },
    {
      name: 'starter', displayName: 'Starter', description: 'Chhote business ke liye',
      price: { monthly: 299, yearly: 2990 }, color: '#1D9E75', popular: false,
      features: [
        { label: '50 Products', included: true },
        { label: '500 Orders/month', included: true },
        { label: 'WhatsApp Button', included: true },
        { label: 'Professional Website', included: true },
        { label: 'Analytics', included: true },
        { label: 'SEO Tools', included: true },
        { label: 'Custom Domain', included: false },
        { label: 'WhatsApp Marketing', included: false },
        { label: 'Payment Gateway', included: false },
        { label: 'Priority Support', included: false }
      ]
    },
    {
      name: 'pro', displayName: 'Pro', description: 'Growing business ke liye',
      price: { monthly: 599, yearly: 5990 }, color: '#534AB7', popular: true,
      features: [
        { label: '500 Products', included: true },
        { label: '5000 Orders/month', included: true },
        { label: 'WhatsApp Button', included: true },
        { label: 'Premium Website', included: true },
        { label: 'Advanced Analytics', included: true },
        { label: 'SEO Tools', included: true },
        { label: 'Custom Domain', included: true },
        { label: 'WhatsApp Marketing', included: true },
        { label: 'Payment Gateway', included: true },
        { label: 'Priority Support', included: true }
      ]
    },
    {
      name: 'enterprise', displayName: 'Enterprise', description: 'Bade business ke liye',
      price: { monthly: 999, yearly: 9990 }, color: '#D85A30', popular: false,
      features: [
        { label: 'Unlimited Products', included: true },
        { label: 'Unlimited Orders', included: true },
        { label: 'WhatsApp Button', included: true },
        { label: 'Enterprise Website', included: true },
        { label: 'Advanced Analytics', included: true },
        { label: 'SEO Tools', included: true },
        { label: 'Custom Domain', included: true },
        { label: 'WhatsApp Marketing', included: true },
        { label: 'Payment Gateway', included: true },
        { label: 'Priority Support', included: true }
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid var(--gray-100)', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px' }}>B</div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '20px', color: 'var(--gray-900)' }}>BizSathi</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)', marginBottom: '12px' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--gray-500)', marginBottom: '32px' }}>
            Free se shuru karo, jab business grow kare tab upgrade karo
          </p>

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            <button onClick={() => setBilling('monthly')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: billing === 'monthly' ? 'var(--primary)' : 'transparent', color: billing === 'monthly' ? 'white' : 'var(--gray-500)', fontWeight: '500', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
              Monthly
            </button>
            <button onClick={() => setBilling('yearly')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: billing === 'yearly' ? 'var(--primary)' : 'transparent', color: billing === 'yearly' ? 'white' : 'var(--gray-500)', fontWeight: '500', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Yearly
              <span style={{ background: '#E1F5EE', color: 'var(--primary)', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', alignItems: 'start' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ background: 'white', borderRadius: '16px', padding: '28px 24px', border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--gray-200)', position: 'relative', boxShadow: plan.popular ? `0 8px 30px ${plan.color}25` : 'var(--shadow-sm)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <FiZap size={11} /> Most Popular
                </div>
              )}

              {user?.plan === plan.name && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: plan.color + '20', color: plan.color, padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' }}>
                  Current Plan
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: plan.color, fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>{plan.displayName}</h3>
                <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{plan.description}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>
                    {plan.price[billing] === 0 ? 'Free' : `Rs.${plan.price[billing]}`}
                  </span>
                  {plan.price[billing] > 0 && <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>/{billing === 'monthly' ? 'mo' : 'yr'}</span>}
                </div>
                {billing === 'yearly' && plan.price.yearly > 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>
                    Rs.{Math.round(plan.price.yearly / 12)}/mo billed yearly
                  </p>
                )}
              </div>

              <Link to={user ? '/dashboard' : '/register'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '11px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', marginBottom: '24px', background: plan.popular ? plan.color : 'transparent', color: plan.popular ? 'white' : plan.color, border: `2px solid ${plan.color}`, transition: 'all 0.2s' }}>
                {plan.name === 'free' ? 'Get Started Free' : `Get ${plan.displayName}`} <FiArrowRight size={14} />
              </Link>

              <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    {feature.included ? (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: plan.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiCheck size={11} color={plan.color} />
                      </div>
                    ) : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiX size={11} color="var(--gray-300)" />
                      </div>
                    )}
                    <span style={{ color: feature.included ? 'var(--gray-700)' : 'var(--gray-300)' }}>{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: 'var(--gray-900)', marginBottom: '40px' }}>Aksar Pooche Jaane Wale Sawal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
            {[
              { q: 'Kya free plan mein credit card chahiye?', a: 'Bilkul nahi! Free plan ke liye koi payment information nahi chahiye.' },
              { q: 'Kya main plan baad mein upgrade kar sakta hun?', a: 'Haan, aap kabhi bhi upgrade ya downgrade kar sakte hain.' },
              { q: 'Payment kaise hogi?', a: 'Hum Razorpay ke through UPI, cards, aur net banking accept karte hain.' },
              { q: 'Kya data secure rahega?', a: 'Haan, aapka data fully encrypted aur secure hai. Hum kabhi share nahi karte.' }
            ].map((faq, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px' }}>
                <h4 style={{ fontWeight: '600', fontSize: '14px', color: 'var(--gray-800)', marginBottom: '8px' }}>{faq.q}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
