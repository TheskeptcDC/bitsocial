import React from 'react';

export default function MenuBar({ setPage }) {
  return (
    <nav className="menu-bar">
      <div className="menu-bar-container">
  <span className="menu-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
      <path d="M13 2L3 14H12L11 22L21 10H13L13 2Z" fill="#facc15" stroke="#facc15" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
    bitSocial
  </span>
        <ul className="menu-list">
          <li><button className="menu-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setPage('home')}>Home</button></li>
          <li><button className="menu-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setPage('posts')}>Posts</button></li>
          <li><a href="#" className="menu-link">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}
