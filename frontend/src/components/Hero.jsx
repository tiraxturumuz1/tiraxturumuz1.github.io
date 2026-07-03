import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h1>Decentralize Your Future with PiDao</h1>
      <p>The next generation of autonomous decision-making. Empowering communities through transparent governance.</p>
      <div className="hero-btns">
        <a href="#features" className="btn-primary">Get Started</a>
        <a href="#poll" className="btn-secondary">Take a Vote</a>
      </div>
    </section>
  );
};

export default Hero;
