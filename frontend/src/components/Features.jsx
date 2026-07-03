import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    { title: "Decentralized Governance", desc: "No central authority. Every decision is made by the community." },
    { title: "Transparent Voting", desc: "On-chain voting ensures every vote is visible and unchangeable." },
    { title: "Automated Execution", desc: "Smart contracts execute decisions automatically once passed." }
  ];

  return (
    <section id="features" className="features">
      <h2 className="features-title">Why PiDao?</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
