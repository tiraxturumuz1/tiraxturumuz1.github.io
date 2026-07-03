import React from 'react';
import './Features.css';

const Features = () => {
  const featuresData = [
    {
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Built with cutting-edge technology to ensure lightning-fast speed.'
    },
    {
      icon: '🛡️',
      title: 'Secure Data',
      description: 'Your data is protected with industry-leading security standards.'
    },
    {
      icon: '📱',
      title: 'Fully Responsive',
      description: 'Works perfectly on all devices, from mobile to desktop.'
    },
    {
      icon: '🛠️',
      title: 'Easy to Use',
      description: 'Simple and intuitive interface designed for everyone.'
    }
  ];

  return (
    <section className="features-container">
      <h2 className="features-title">Why Choose TiraxturApp?</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
