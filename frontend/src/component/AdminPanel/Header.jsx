import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/exam-icon.jpeg'; // Changed from image to images
import './Header.css';

function Header() {
  return (
    <header className="admin-header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1>Online Test</h1>
      </div>
      
      <nav className="header-nav">
        <Link to="/admin/about">About</Link>
        <Link to="/admin/features">Features</Link>
        <Link to="/admin/faqs">FAQs</Link>
        <Link to="/admin/gallery">Gallery</Link>
        <Link to="/admin/contact">Contact</Link>
      </nav>
      
      <div className="header-right">
        <button className="profile-btn">Profile</button>
      </div>
    </header>
  );
}

export default Header;
