import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <a href="/" className="footer-logo">PiDao</a>
      <ul className="footer-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#poll">Governance</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} PiDao Project. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
