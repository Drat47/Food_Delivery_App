import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function SupportPage({ handleLogout }) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Browse restaurants on the dashboard, click on a restaurant to view its menu, select items with desired quantity, add them to cart, proceed to checkout, and place your order with delivery details.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit cards, debit cards, digital wallets, and online banking options. Payment is processed securely during checkout.'
    },
    {
      id: 3,
      question: 'How can I track my order?',
      answer: 'Go to "My Orders" section to track real-time status of your order. You\'ll see updates as your order is confirmed, prepared, and out for delivery.'
    },
    {
      id: 4,
      question: 'What is the delivery time?',
      answer: 'Typical delivery time is 30-45 minutes depending on your location and the restaurant. The exact time will be shown during checkout.'
    },
    {
      id: 5,
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within the first 5 minutes of placing it. Go to "My Orders" and click the cancel button. After 5 minutes, contact our customer care.'
    },
    {
      id: 6,
      question: 'What if my order arrives late or has issues?',
      answer: 'Contact our customer care team immediately with your order ID. We\'ll resolve the issue and provide a refund or replacement as needed.'
    },
    {
      id: 7,
      question: 'Are there delivery charges?',
      answer: 'Delivery charges depend on your location. The exact charge will be displayed at checkout before you confirm your order. Some restaurants may offer free delivery.'
    },
    {
      id: 8,
      question: 'How do I report a quality issue?',
      answer: 'If you receive incorrect or poor quality items, contact us immediately with photos. We will resolve the issue within 24 hours.'
    }
  ];

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      details: '+1 (800) 123-4567',
      time: 'Available 24/7'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available in app',
      time: '9:00 AM - 11:00 PM'
    },
    {
      icon: '✉️',
      title: 'Email Support',
      details: 'support@fooddelivery.com',
      time: 'Response within 2 hours'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      details: '+1 (800) 123-4568',
      time: 'Available 24/7'
    }
  ];

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/support">💬 Help & Support</Link>
          {user && <span className="user-info">Hi, {user}</span>}
          <button onClick={handleLogoutClick} style={{
            background: 'none',
            border: 'none',
            color: '#ffd700',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginLeft: '2rem'
          }}>
            Logout
          </button>
        </nav>
      </header>

      <div className="container">
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '12px',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬 Help & Customer Care</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>We're here to help! Get answers to common questions or contact our support team</p>
        </div>

        {/* Contact Methods */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📞 Contact Us</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {contactMethods.map((method) => (
              <div key={method.title} style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{method.icon}</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>{method.title}</h4>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>
                  {method.details}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999' }}>{method.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>❓ Frequently Asked Questions</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {faqs.map((faq) => (
              <div key={faq.id} style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    transform: expandedFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.5rem'
                  }}>▼</span>
                </button>
                {expandedFAQ === faq.id && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem',
                    borderTop: '1px solid #e9ecef',
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '3rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💡 Quick Tips</h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <li>✅ Check restaurant hours before ordering</li>
            <li>✅ Review item details for allergen information</li>
            <li>✅ Save your delivery address for faster checkout</li>
            <li>✅ Track real-time order status anytime</li>
            <li>✅ Apply discount codes at checkout</li>
            <li>✅ Rate restaurants after delivery for better recommendations</li>
          </ul>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '0.8rem 1.5rem',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#764ba2'}
          onMouseLeave={(e) => e.target.style.background = '#667eea'}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
