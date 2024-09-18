import React from 'react';
import { Link } from 'react-router-dom';
import './RelatedArticleCard.css'; 

const RelatedArticleCard = ({ article }) => {
    const getThumbnailUrl = (videoUrl) => {
        const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'default_image.jpg';
    };

    return (
        
        <Link to={`/articles/${article.id}`} className="related-card">
            <div className="related-card-image-container">
                <img 
                    src={article.image_url || (article.video_url ? getThumbnailUrl(article.video_url) : 'default_image.jpg')} 
                    alt={article.title} 
                />
            </div>
            <div className="related-playbutton" style={{ display: article.video_url ? 'flex' : 'none' }}>
                <img src="/assets/images/vector 5.svg" alt="" srcset="" />
            </div>
            <div className='related-card-info-container'>
                <h3>{article.title}</h3>
               
                <div className="related-duration-number">
                    {article.duration} Minutes
                </div>
            </div>
            </Link>
       
    );  
};

export default RelatedArticleCard;