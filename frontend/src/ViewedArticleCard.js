import React from 'react';
import { Link } from 'react-router-dom';
import './ViewedArticleCard.css'; 

const ViewedArticleCard = ({ article }) => {
    const getThumbnailUrl = (videoUrl) => {
        const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'default_image.jpg';
    };

    return (
        
        <Link to={`/articles/${article.id}`} className="viewed-articles">
            <div className="viewed-image-container">
                <img 
                    src={article.image_url || (article.video_url ? getThumbnailUrl(article.video_url) : 'default_image.jpg')} 
                    alt={article.title} 
                />
            </div>
            <div className="viewed-playbutton" style={{ display: article.video_url ? 'flex' : 'none' }}>
                <img src="/assets/images/Vector 5.svg" alt="" srcset="" />
            </div>

            

            <div className='viewed-card-info-container'>
            <div className="viewed-duration-number">
                    Course by <span className='author-colored'>{article.author}</span>
                </div>
                <h3>{article.title}</h3>
               
                
            </div>
            </Link>
       
    );  
};

export default ViewedArticleCard;