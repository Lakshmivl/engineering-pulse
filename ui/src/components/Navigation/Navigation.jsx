import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

/**
 * Navigation component for switching between different views using React Router
 */
const Navigation = () => {
  // Tab options
  const tabs = [
    { id: 'dashboard', label: 'Engineering Velocity', path: '/dashboard' },
    { id: 'contributors', label: 'Leaderboard', path: '/contributors' },
    { id: 'pullrequests', label: 'Review Queue', path: '/pullrequests' }
  ];

  return (
    <nav className="app-navigation">
      <ul className="nav-tabs">
        {tabs.map(tab => (
          <li key={tab.id} className="nav-tab">
            <NavLink 
              to={tab.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              {tab.label}
              {/* The active indicator will be shown via CSS when the NavLink is active */}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
