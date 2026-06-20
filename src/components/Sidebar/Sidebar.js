import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Dashboard
        </NavLink>
      </div>
      <div className="sidebar-item">
        <NavLink to="/users" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Users
        </NavLink>
      </div>
      <div className="sidebar-item">
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Customers
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
