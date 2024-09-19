import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import './Sidebar.css'; 

const Sidebar = () => {
  const { language, setLanguage } = useUser();
  const [localLanguage, setLocalLanguage] = useState(language);
  const [activeTab, setActiveTab] = useState(1)
  const location = useLocation()
  
  const handleLanguageChange = (lang) => {
    setLocalLanguage(lang); 
    setLanguage(lang);      
  };

  const handleTabChange = (tabIndex) => {
    if (location.pathname !== '/login') {
      setActiveTab(tabIndex);
    }
  };

  return (
    <nav className="sidebar">
      <Link to="/" onClick={() => handleTabChange(1)} className='icon-div'>
        <div className='main-icon-div'>
           <img src='/assets/images/logo.png' className='logo-icon' alt="Logo" />
        </div>
        <div className='logo-text'>Elevate Academy</div>
      </Link>
      <ul>
        <li>
          <Link to="/" className='links-container' onClick={() => handleTabChange(1)} style={{ backgroundColor: activeTab === 1 ? '#e7e7f0' : 'transparent' }}>
          <div className='sidebar-icon'>
              <img src='/assets/images/dashboard.svg' className='sidebar-icon' alt="Dashboard" />
            </div>
            <div className='sidebar-item'>Dashboard</div>
          </Link>
        </li>
        <li>
          <Link to="/allarticles" onClick={() => handleTabChange(2)} className='links-container' style={{ backgroundColor: activeTab === 2 ? '#e7e7f0' : 'transparent' }}>
            <div className='sidebar-icon'>
              <img src='/assets/images/videos.svg' className='sidebar-icon' alt="Courses" />
            </div>
            <div className='sidebar-item'>Courses</div>
          </Link>
        </li>
        <li>
          <Link to="/history" onClick={() => handleTabChange(3)} className='links-container' style={{ backgroundColor: activeTab === 3 ? '#e7e7f0' : 'transparent' }}>
            <div className='sidebar-icon'>
              <img src='/assets/images/history.svg' className='sidebar-icon' alt="History" />
            </div>
            <div className='sidebar-item'>History</div>
          </Link>
        </li>
      </ul>
      <div className="language-div">
        <div className="language-container">
          <div className="language-icon">
            {localLanguage === 1 ? (
              <img src="/assets/images/us.svg" alt="English" />
            ) : (
              <img src="/assets/images/spain.svg" alt="Spanish" />
            )}
          </div>
          <select
            className="language-text"
            value={localLanguage}
            onChange={(e) => handleLanguageChange(Number(e.target.value))}
          >
            <option value={1}>English</option>
            <option value={2}>Spanish</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;