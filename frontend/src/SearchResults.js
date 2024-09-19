import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import './SearchResults.css';
import { useUser } from './UserContext';

const SearchResults = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const location = useLocation();
  const { language } = useUser();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = new URLSearchParams(location.search).get('q');
      console.log(language);
      const response = await axios.get(`http://localhost:5000/api/articles/search`, {
        params: {
          q: query,
          language: language,
        },
      });

      setArticles(response.data);
      setLoading(false); 
    };

    fetchSearchResults();
  }, [location, language]);

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <div className="card-container">
        {loading ? ( 
          <div className='display-flex'>
          <svg height="200" width="200">
          <circle id="c3" cx="100" cy="100" r="50" stroke="#3474ef" stroke-width="5" fill="transparent" />
          </svg>
        </div >
        ) : articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;