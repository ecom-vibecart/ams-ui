import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    &copy; {new Date().getFullYear()} VibeCart &mdash; Account Management System
  </footer>
);

export default Footer;
