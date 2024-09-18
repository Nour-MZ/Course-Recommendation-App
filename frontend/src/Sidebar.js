import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Sidebar.css'; 

const Sidebar = () => {
  const { language, setLanguage } = useUser();
  const [localLanguage, setLocalLanguage] = useState(language);

  const handleLanguageChange = (lang) => {
    setLocalLanguage(lang); // Update local state immediately
    setLanguage(lang);      // Update context state
  };

  return (
    <nav className="sidebar">
      <Link to="/" className='icon-div'>
        <div className='main-icon-div'>
           <img src='/assets/images/logo.png' className='logo-icon' alt="Logo" />
        </div>
        <div className='logo-text'>Elevate Academy</div>
      </Link>
      <ul>
        <li>
          <Link to="/" className='links-container'>
            <div className='sidebar-icon'>
              <img src='/assets/images/dashboard.svg' className='sidebar-icon' alt="Dashboard" />
            </div>
            <div className='sidebar-item'>Dashboard</div>
          </Link>
        </li>
        <li>
          <Link to="/allarticles" className='links-container'>
            <div className='sidebar-icon'>
              <img src='/assets/images/videos.svg' className='sidebar-icon' alt="Courses" />
            </div>
            <div className='sidebar-item'>Courses</div>
          </Link>
        </li>
        <li>
          <Link to="/history" className='links-container'>
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