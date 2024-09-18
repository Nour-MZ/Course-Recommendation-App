import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css'; 


const ArticleCard = ({ article }) => {
    const getThumbnailUrl = (videoUrl) => {
        const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'default_image.jpg';
    };
    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
          case 'Introductory':
            return 'Introductory';
          case 'Intermediate':
            return 'Intermediate';
          case 'Advanced':
            return 'Advanced';
          default:
            return '';
    }}
    return (
        
        <Link to={`/articles/${article.id}`} className="card">
            <div className="card-image-container">
                <img 
                    src={article.image_url || (article.video_url ? getThumbnailUrl(article.video_url) : 'default_image.jpg')} 
                    alt={article.title} 
                />
                <div className="playbutton" style={{ display: article.video_url ? 'flex' : 'none' }}>
                    <img src="/assets/images/Vector 5.svg" alt="" srcset="" />
                </div>
            </div>
            <div className='card-info-container'>
              
                <h3 > {article.title}</h3>
                <h4 className='by-author'>by <span className='author-card'>{article.author}</span></h4>
                <h5 className={`course-level ${getDifficultyClass(article.difficulty)}`}>{article.difficulty}</h5>
                <div className="duration-read-div">
                    <div className='duration-div'>
                        <div className="duration-icon">
                            <img src="/assets/images/clock.svg" alt="" />
                        </div>
                        <div className="duration-number">
                            {article.duration} Minutes
                        </div>
                    </div>
                    <div className="read-div">
                        <div className="duration-icon">
                            <img src="/assets/images/users.svg" alt="" />
                        </div>
                        <div className="read-number">
                            {article.viewcount}  Read 
                        </div>
                    </div>
                </div>
                <p>{article.description}</p>

            </div>
            </Link>
       
    );  
};

export default ArticleCard;