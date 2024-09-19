import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { useUser } from './UserContext';


const AllArticles = () => {
  const [articles, setArticles] = useState([]);  
  const {language } = useUser();
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0,0)
    const fetchArticles = async () => {

      const response = await axios.get(`http://localhost:5000/api/articles/all`,{
        params:{
          language:language
        },
      });

      setArticles(response.data);
    };

    fetchArticles();
  }, [language, location]);

  const getThumbnailUrl = (videoUrl) => {
    const videoIdMatch = videoUrl.match(/embed\/([^?]+)/); 
    const videoId = videoIdMatch ? videoIdMatch[1] : null; 
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'default_image.jpg'; 
  };

  return (
    <div className="all-articles">
      <h2>All Courses</h2>
      <div className="card-container">
        {articles.length > 0 ? (
          articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            
          ))
        ) : (
          <div className='display-flex'>
            <svg height="200" width="200">
            <circle id="c3" cx="100" cy="100" r="50" stroke="#3474ef" stroke-width="5" fill="transparent" />
            </svg>
          </div >
        )}
      </div>
    </div>
  );
};

export default AllArticles;