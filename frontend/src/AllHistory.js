// ArticleList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllHistory.css'; // Create a separate CSS file for ArticleList
import ArticleCard from './ArticleCard'; // Import the ArticleCard component
import { useUser } from './UserContext';
import { Link, useLocation } from 'react-router-dom';
import ViewedArticleCard from './ViewedArticleCard';
// import ViewedArticleCard from './ViewedArticleCard';


const AllHistory = () => {
    const [articles, setArticles] = useState([]);
    const { user } = useUser();
    const location = useLocation();

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.post('http://localhost:5000/api/all-viewed-articles', user);
            console.log(user)
            setArticles(response.data);
            
        };
        
        fetchArticles();
     
    }, [location, user]);

    return (
        <>
      
            <div className="list-header padder " style={{ display: articles.length > 0 ? 'flex' : 'none' }}>
                <h2>History</h2>
            </div>
            <div className="viewed-articles-div">

                {articles.length > 0 ? (
                    articles.map(article => (
                        <ViewedArticleCard key={article.id} article={article} />
                    ))
                ) : (
                  <div className='display-flex'>
                    <svg height="200" width="200">
                    <circle id="c3" cx="100" cy="100" r="50" stroke="#3474ef" stroke-width="5" fill="transparent" />
                    </svg>
                  </div >
                )}
            </div>
            {/* <div className="article-list">
                <div className="list-header">
                    <h2>Courses you may like</h2>

                </div>
                <div className="card-container">
                    {articles.map(article => (
                        <ViewedArticleCard key={article.id} article={article} /> // Use ArticleCard
                    ))}
                </div>
            </div> */}


        </>
    );
};

export default AllHistory;