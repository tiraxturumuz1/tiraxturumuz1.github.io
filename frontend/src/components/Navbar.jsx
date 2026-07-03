import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo">PiDao</a>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#poll">Governance</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
