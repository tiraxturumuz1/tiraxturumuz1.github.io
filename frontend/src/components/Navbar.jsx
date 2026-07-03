import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo">PiDao</a>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="/docs">Docs</a></li>
        <li><a href="/login" className="btn-get-started">Get Started</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
