import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; 
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
  const { user, language } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const formRef = useRef();
  const inputRef = useRef(); 

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = async (query) => {
    if (query) {
      await axios.post('http://localhost:5000/api/save-query', {
        userId: user.userId,
        query: query,
      });

      setSearchTerm('');
      setSuggestions([]);
      navigate(`/search?q=${encodeURIComponent(query)}`); 
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/suggestions`, {
        params: {
           q: query,
           language: language
          },
      });
      setSuggestions(response.data.suggestions); 
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    handleSearch(suggestion); 
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    handleSearch(searchTerm);
  };

  const handleBlur = () => {
    
    setTimeout(() => {
      setSuggestions([]);
    }, 100);
   
  };

  const handleFocus = () => {
    setSuggestions([]);
    fetchSuggestions(searchTerm);
  };

  return (
    <>
      <div className='search-container'>
        <div className='search-text-container'>
          <div className='search-text-container-title'>
            <span>{user && user.name ? `Welcome Back, ${user.name}!` : 'Welcome Back!'}</span> 
            <span className='title-section'>{user && user.job ? `${user.job} Team` : ""}</span> 
          </div>
          <div className='search-text-container-item'>Explore your courses and dive into new learning courses</div>
        </div>
        <form className="search-bar" ref={formRef} onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onBlur={handleBlur} 
            placeholder="Search Courses"
            autoComplete="off"
            onFocus={handleFocus}
            id="searchbar"
            ref={inputRef} 
          />
          <button className='submit-search' type="submit">
            <img src='/assets/images/search.svg' className='search-icon' alt="Search" />
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchBar;