import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ArticleList.css';
import Banner from './Banner';
import ArticleCard from './ArticleCard';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import ViewedArticleCard from './ViewedArticleCard';
import RelatedArticleCard from './RelatedArticleCard';


const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [viewedArticles, setViewedArticles] = useState([]);
    const [jobArticles, setJobArticles] = useState([])
    const { user,language } = useUser();
    
    useEffect(() => {
        window.scrollTo(0,0)
        const fetchArticles = async () => {
            const response = await axios.post('http://localhost:5000/api/articles', {user: user, language});
            setArticles(response.data);
        };
        fetchArticles();
        fetchViewedArticles();
        fetchJobArticles();
    }, [user, language]);

    const fetchViewedArticles = async () => {
        const response = await axios.post('http://localhost:5000/api/viewed-articles', user);
        const data = response.data;
        console.log(data)
        setViewedArticles(data);
    };

    const fetchJobArticles = async () => {
        const response = await axios.post('http://localhost:5000/api/job-articles', {user:user, language});
        const data = response.data;
        console.log(data)
        setJobArticles(data);
    };

    return (
        <>
           
            {articles && articles.length > 0 ?
            <div className="article-list">
                <div className="list-header">
                    <h2>Courses you may like</h2>

                </div>
                <div className="related-articles">
                    {articles.map(article => (
                        <ViewedArticleCard key={article.id} article={article} /> 
                    ))}
                </div>
            </div>
            : ""}
            <div className="viewed-block" style={{ display: viewedArticles.length > 0 ? 'block' : 'none' }}>
                <div className="list-header padder " style={{ display: viewedArticles.length > 0 ? 'flex' : 'none' }}>
                    <h2>Courses You Viewed</h2>
                    <Link to="/history" className="All-Articles">View All</Link>
                </div>
                <div className="viewed-articles-div">

                    {viewedArticles.length > 0 ? (
                        viewedArticles.slice(0, 3).map(article => (
                            <RelatedArticleCard key={article.id} article={article} />
                        ))
                    ) : (
                        <p>No viewed articles available.</p>
                    )}
                </div>
            </div>
            {jobArticles && jobArticles.length > 0 ?
            <div className="article-list">
                <div className="list-header">
                    <h2>Trending {user ? user.job : ""} Courses</h2>

                </div>
                <div className="card-container">
                    {jobArticles.map(article => (
                        <ArticleCard key={article.id} article={article} /> 
                    ))}
                </div>
            </div>
            : ""}
            


        </>
    );
};

export default ArticleList;