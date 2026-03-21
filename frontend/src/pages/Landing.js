import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiStar, FiZap, FiShoppingBag, FiUsers, FiBarChart2, FiSmartphone } from 'react-icons/fi';

const Landing = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--gray-100)',
        padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #1D9E75, #534AB7)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '18px',
            fontFamily: 'Poppins, sans-serif'
          }}>B</div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '20px', color: 'var(--gray-900)' }}>BizSathi</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/plans" style={{ fontSize: '14px', color: 'var(--gray-600)', textDecoration: 'none', padding: '8px 16px' }}>Pricing</Link>
          <Link to="/login" style={{ fontSize: '14px', color: 'var(--gray-600)', textDecoration: 'none', padding: '8px 16px' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ borderRadius: '8px', padding: '8px 20px', fontSize: '14px' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      <section style={{
        padding: '100px 40px 80px',
        background: 'linear-gradient(135deg, #f0fdf8 0%, #eeedfe 50%, #fff 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--primary-light)', color: 'var(--primary)',
            padding: '6px 16px', borderRadius: '20px',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px'
          }}>
            <FiZap size={14} />
            India's #1 Local Business Platform
          </div>
          <h1 style={{
            fontSize: '56px', fontWeight: '800', lineHeight: '1.15',
            color: 'var(--gray-900)', marginBottom: '24px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Build Your Business<br />
            <span style={{ background: 'linear-gradient(135deg, #1D9E75, #534AB7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Website in 5 Minutes
            </span>
          </h1>
          <p style={{
            fontSize: '18px', color: 'var(--gray-500)',
            maxWidth: '560px', margin: '0 auto 40px',
            lineHeight: '1.7'
          }}>
            Create your store, add products, and receive orders directly on WhatsApp.
            No technical knowledge required!
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-xl" style={{ gap: '8px' }}>
              Start For Free <FiArrowRight size={18} />
            </Link>
            <Link to="/plans" className="btn btn-outline btn-xl">
              View Plans
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--gray-400)' }}>
            No credit card required &nbsp;&nbsp; 5 minute setup &nbsp;&nbsp; Free forever plan
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 40px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            { value: '10,000+', label: 'Businesses' },
            { value: '5 Min', label: 'Setup Time' },
            { value: 'Free', label: 'Starting Cost' },
            { value: '24/7', label: 'Support' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 40px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>
              Everything in One Place
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--gray-500)', marginTop: '12px' }}>
              Website + Orders + Customers + Analytics — all in one dashboard
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: FiSmartphone, color: '#1D9E75', bg: '#E1F5EE', title: 'WhatsApp Orders', desc: 'Customers place orders and you receive them directly on WhatsApp. No app download needed!' },
              { icon: FiShoppingBag, color: '#534AB7', bg: '#EEEDFE', title: 'Product Management', desc: 'Add products, set prices, upload photos. Everything is super easy and intuitive!' },
              { icon: FiUsers, color: '#D85A30', bg: '#FAECE7', title: 'Customer CRM', desc: 'Keep track of your customers. Know who is regular, who is VIP — all in one place!' },
              { icon: FiBarChart2, color: '#EF9F27', bg: '#FAEEDA', title: 'Analytics', desc: 'Daily orders, monthly revenue, top products — see all your data in one dashboard.' },
              { icon: FiZap, color: '#E24B4A', bg: '#FCEBEB', title: 'Instant Website', desc: 'Fill a form and get a professional website in 5 minutes. Custom URL included!' },
              { icon: FiStar, color: '#0F6E56', bg: '#E1F5EE', title: 'Premium Templates', desc: 'Gym, Shop, Coaching — beautiful templates available for every business type.' }
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '28px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: feature.bg, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <feature.icon size={24} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-800)' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif' }}>
              How It Works?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free. Just your name, email and phone number.' },
              { step: '02', title: 'Setup Your Store', desc: 'Fill business details, upload logo, add products.' },
              { step: '03', title: 'Receive Orders', desc: 'Publish your website and start receiving orders on WhatsApp!' }
            ].map((step, i) => (
              <div key={i}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px', fontFamily: 'Poppins, sans-serif' }}>{step.step}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: 'var(--gray-800)' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 40px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif', marginBottom: '12px' }}>
            Simple Pricing
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--gray-500)', marginBottom: '50px' }}>
            Start free, upgrade when your business grows
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { name: 'Free', price: 'Rs.0', color: '#888', features: ['10 Products', '50 Orders', 'WhatsApp Button', 'Basic Website'] },
              { name: 'Starter', price: 'Rs.299', color: '#1D9E75', features: ['50 Products', '500 Orders', 'SEO Tools', 'Analytics'] },
              { name: 'Pro', price: 'Rs.599', color: '#534AB7', popular: true, features: ['500 Products', 'Custom Domain', 'WhatsApp Marketing', 'Payment Gateway'] },
              { name: 'Enterprise', price: 'Rs.999', color: '#D85A30', features: ['Unlimited', 'API Access', 'Priority Support', 'Remove Branding'] }
            ].map((plan, i) => (
              <div key={i} className="card" style={{ padding: '28px 20px', textAlign: 'center', border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--gray-100)', position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: 'white', padding: '3px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>Most Popular</div>
                )}
                <h3 style={{ fontWeight: '700', fontSize: '16px', color: plan.color, marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--gray-900)', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>{plan.price}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '20px' }}>/month</div>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--gray-600)' }}>
                    <FiCheck size={14} color={plan.color} />{f}
                  </div>
                ))}
                <Link to="/register" className="btn" style={{ marginTop: '20px', width: '100%', background: plan.popular ? plan.color : 'transparent', color: plan.popular ? 'white' : plan.color, border: `1.5px solid ${plan.color}`, borderRadius: '8px', padding: '10px' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', color: 'white', fontFamily: 'Poppins, sans-serif', marginBottom: '16px' }}>
          Start Today!
        </h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '36px' }}>
          Get your professional website ready in 5 minutes
        </p>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', color: 'var(--primary)', padding: '16px 36px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          Start For Free <FiArrowRight size={20} />
        </Link>
      </section>

      <footer style={{ background: 'var(--gray-900)', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1D9E75, #534AB7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>B</div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '18px', color: 'white' }}>BizSathi</span>
        </div>
        <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
          2024 BizSathi. India's own business platform. Made with love in India
        </p>
      </footer>
    </div>
  );
};

export default Landing;
