import React, { useState, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import './Header.css';

const Header = ({ onLogout, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (email) setUsername(email);
  }, [isLoggedIn]);

  return (
    <header className="header-container">
      <div className="header-title">
        <span className="bold">VIBE</span><span>CART</span>
      </div>

      <h5 className="header-subtitle">Account Management System</h5>

      <div className="header-actions">
        {isLoggedIn && (
          <div
            className="user-info"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <FaRegUserCircle className="user-icon" size={26} color="#dd1e25" />
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <div className="dropdown-header">Account</div>
              <span className="dropdown-item">{username || 'Admin'}</span>
              <button className="dropdown-item" onClick={onLogout}>Sign out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
