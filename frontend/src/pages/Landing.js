import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiZap, FiShoppingBag, FiUsers, FiBarChart2, FiSmartphone, FiStar, FiMenu, FiX } from 'react-icons/fi';

const Landing = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: FiSmartphone, color: '#00C896', bg: 'rgba(0,200,150,0.1)', title: 'WhatsApp Orders', desc: 'Customers place orders and you receive them instantly on WhatsApp. Zero friction, maximum sales.' },
    { icon: FiShoppingBag, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', title: 'Product Management', desc: 'Add products, set prices, upload photos — all in under 2 minutes. Beautiful and intuitive.' },
    { icon: FiUsers, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', title: 'Customer CRM', desc: 'Know your customers deeply. Track orders, spending, and behavior automatically.' },
    { icon: FiBarChart2, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', title: 'Live Analytics', desc: 'Real-time revenue tracking, order trends, and growth insights in one beautiful dashboard.' },
    { icon: FiZap, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', title: '5 Min Setup', desc: 'From signup to live store in 5 minutes. No code, no complexity, no headaches.' },
    { icon: FiStar, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', title: 'Pro Templates', desc: 'Stunning templates for every business type — Gym, Shop, Coaching, Restaurant and more.' }
  ];

  const stats = [
    { value: '10K+', label: 'Active Stores' },
    { value: '5 Min', label: 'Setup Time' },
    { value: '₹0', label: 'To Start' },
    { value: '99.9%', label: 'Uptime' }
  ];

  const testimonials = [
    { name: 'Rahul Sharma', business: 'Sharma Electronics', text: 'BizSathi transformed my business. Orders on WhatsApp, beautiful website — all for free!', avatar: 'R', rating: 5 },
    { name: 'Priya Singh', business: 'Priya Beauty Salon', text: 'My customers love the online store. Revenue increased 3x in just 2 months!', avatar: 'P', rating: 5 },
    { name: 'Amit Kumar', business: 'AK Fitness Gym', text: 'The analytics dashboard is incredible. I know exactly what is working and what is not.', avatar: 'A', rating: 5 }
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        padding: '0 5%', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 12px rgba(0,200,150,0.3)' }}>B</div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '800', fontSize: '20px', color: '#0F172A', letterSpacing: '-0.02em' }}>BizSathi</span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hide-mobile">
          <Link to="/plans" style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.background = '#F8FAFC'; e.target.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#64748B'; }}>
            Pricing
          </Link>
          <Link to="/login" style={{ fontSize: '14px', color: '#64748B', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.background = '#F8FAFC'; e.target.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#64748B'; }}>
            Login
          </Link>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 14px rgba(0,200,150,0.3)', transition: 'all 0.2s', letterSpacing: '-0.01em' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Get Started Free <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: 'none', color: '#0F172A', padding: '4px', display: 'none' }} className="show-mobile">
          {navOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 5% 80px',
        background: 'linear-gradient(160deg, #F0FDF9 0%, #EEF2FF 50%, #FAFAFA 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: '760px' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', color: '#00A87E', padding: '6px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '28px', animation: 'fadeInUp 0.5s ease both' }}>
              <div style={{ width: '6px', height: '6px', background: '#00C896', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
              India's #1 Local Business Platform
            </div>

            {/* Hero Title */}
            <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', color: '#0F172A', marginBottom: '24px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', animation: 'fadeInUp 0.5s 0.1s ease both' }} className="hero-title">
              Your Business,<br />
              <span style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Online in 5 Minutes
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '20px', color: '#64748B', lineHeight: '1.7', marginBottom: '40px', maxWidth: '560px', animation: 'fadeInUp 0.5s 0.2s ease both', fontWeight: '400' }}>
              Create a stunning store, manage products, and receive orders directly on WhatsApp — no technical skills needed.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px', animation: 'fadeInUp 0.5s 0.3s ease both' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', boxShadow: '0 8px 25px rgba(0,200,150,0.35)', transition: 'all 0.2s', letterSpacing: '-0.01em' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,200,150,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,200,150,0.35)'; }}>
                Start For Free <FiArrowRight size={18} />
              </Link>
              <Link to="/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#334155', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
                View Pricing
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', animation: 'fadeInUp 0.5s 0.4s ease both' }}>
              {['No credit card required', 'Free forever plan', 'Setup in 5 minutes'].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                  <div style={{ width: '18px', height: '18px', background: 'rgba(0,200,150,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiCheck size={10} color="#00C896" strokeWidth={3} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div style={{ position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)', width: '420px', display: 'none' }} className="hide-mobile">
            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 32px 64px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', animation: 'float 4s ease-in-out infinite' }}>
              <div style={{ background: 'linear-gradient(135deg, #00C896, #6366F1)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>B</div>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>BizSathi Dashboard</span>
              </div>
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                {[
                  { label: 'Today Orders', value: '24', color: '#00C896' },
                  { label: 'Revenue', value: '₹8,420', color: '#6366F1' },
                  { label: 'Customers', value: '156', color: '#F59E0B' },
                  { label: 'Products', value: '48', color: '#EF4444' }
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px', fontWeight: '500' }}>{stat.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: stat.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 5%', background: 'white', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #00C896, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.08)', color: '#6366F1', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Everything You Need
            </div>
            <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em' }}>
              All in One Platform
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
              Everything you need to run and grow your local business — beautifully designed and easy to use.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '100px 5%', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,200,150,0.08)', color: '#00A87E', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Simple Process
            </div>
            <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em' }}>
              Up and Running in 3 Steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in 30 seconds. No credit card, no commitment.', color: '#00C896', bg: 'rgba(0,200,150,0.08)' },
              { step: '02', title: 'Setup Your Store', desc: 'Add your business details, products, and logo. Takes 5 minutes.', color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
              { step: '03', title: 'Start Selling', desc: 'Publish your store and start receiving orders on WhatsApp instantly.', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' }
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ width: '72px', height: '72px', background: step.bg, borderRadius: '20px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: step.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{step.step}</span>
                </div>
                {i < 2 && <div style={{ position: 'absolute', top: '36px', left: 'calc(50% + 52px)', right: 'calc(-50% + 52px)', height: '1px', background: 'linear-gradient(90deg, #E2E8F0, transparent)', display: 'none' }} />}
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Loved by Business Owners
            </h2>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Join thousands of happy business owners across India</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #F1F5F9', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={14} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C896, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section style={{ padding: '100px 5%', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '12px' }}>Simple, Fair Pricing</h2>
          <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '56px' }}>Start free, upgrade when you grow</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="pricing-grid">
            {[
              { name: 'Free', price: '₹0', color: '#64748B', features: ['10 Products', '50 Orders', 'WhatsApp Button', 'Basic Website'], popular: false },
              { name: 'Starter', price: '₹299', color: '#00C896', features: ['50 Products', '500 Orders', 'SEO Tools', 'Analytics'], popular: false },
              { name: 'Pro', price: '₹599', color: '#6366F1', features: ['500 Products', 'Custom Domain', 'WhatsApp Marketing', 'Payment Gateway'], popular: true },
              { name: 'Enterprise', price: '₹999', color: '#F59E0B', features: ['Unlimited', 'API Access', 'Priority Support', 'White Label'], popular: false }
            ].map((plan, i) => (
              <div key={i} style={{ background: plan.popular ? 'linear-gradient(160deg, #0F172A, #1E293B)' : 'white', borderRadius: '20px', padding: '28px 20px', textAlign: 'left', border: plan.popular ? 'none' : '1.5px solid #F1F5F9', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: plan.popular ? '0 20px 40px rgba(15,23,42,0.2)' : 'none' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00C896, #6366F1)', color: 'white', padding: '4px 16px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>Most Popular</div>}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: plan.popular ? 'white' : plan.color, marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{plan.name}</h3>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: plan.popular ? 'white' : '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>{plan.price}</div>
                  <div style={{ fontSize: '12px', color: plan.popular ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginTop: '2px' }}>/month</div>
                </div>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', color: plan.popular ? 'rgba(255,255,255,0.8)' : '#475569' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: plan.popular ? 'rgba(0,200,150,0.2)' : `${plan.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiCheck size={10} color={plan.popular ? '#00C896' : plan.color} strokeWidth={3} />
                    </div>
                    {f}
                  </div>
                ))}
                <Link to="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', padding: '11px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', textDecoration: 'none', background: plan.popular ? 'linear-gradient(135deg, #00C896, #00A87E)' : 'transparent', color: plan.popular ? 'white' : plan.color, border: plan.popular ? 'none' : `1.5px solid ${plan.color}30`, boxShadow: plan.popular ? '0 4px 14px rgba(0,200,150,0.3)' : 'none', transition: 'all 0.2s' }}>
                  Get Started <FiArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 5%', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '52px', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.1' }}>
            Ready to Go Online?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
            Join 10,000+ Indian businesses already selling online with BizSathi.
          </p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #00C896, #00A87E)', color: 'white', padding: '16px 36px', borderRadius: '14px', fontWeight: '700', fontSize: '17px', textDecoration: 'none', boxShadow: '0 12px 30px rgba(0,200,150,0.35)', transition: 'all 0.2s', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,200,150,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,200,150,0.35)'; }}>
            Start For Free Today <FiArrowRight size={20} />
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginTop: '16px' }}>No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020617', padding: '40px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00C896, #6366F1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '15px' }}>B</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '16px', color: 'white' }}>BizSathi</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            2024 BizSathi — Made with love in India
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
