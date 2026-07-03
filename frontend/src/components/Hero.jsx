import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h1>Welcome to <span>PiDao</span></h1>
      <p>The most advanced solution for managing your digital tasks with ease and efficiency.</p>
      <div className="hero-btns">
        <a href="/start" className="btn-primary">Get Started</a>
        <a href="/docs" className="btn-secondary">Learn More</a>
      </div>
    </section>
  );
};

export default Hero;
