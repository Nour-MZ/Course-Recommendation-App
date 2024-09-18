import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetail.css';
import ArticleCard from './ArticleCard';
import { useUser } from './UserContext';
import RelatedArticleCard from './RelatedArticleCard';


const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [relatedtagArticles, setRelatedtagArticles] = useState([]);

  const { user, language } = useUser();

    useEffect(() => {
      window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/${id}`, {
                params: { user }
            });
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
        }
    };

    fetchArticle();
}, [id, user]);

useEffect(() => {
    if (article) {
        const tags = article.tags || []; 
        fetchtag(tags);
        fetchRelatedArticles();
    }
}, [article]);

const fetchtag = async (tags) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/tagarticles`, {
            params: { 
              articletag: tags,
              language: language

             }
        });
        console.log("Fetched tag articles:", response.data);
        setRelatedtagArticles(response.data)
        console.log("Fetched tag articles:", response.data);
    } catch (error) {
        console.error('Error fetching tag articles:', error);
    }
};



 

  const fetchRelatedArticles = async () => {
  
    const response = await axios.get(`http://localhost:5000/api/articles/related/${id}`,{
      params :{
        language: language
      }
    });
    setRelatedArticles(response.data);
  };

  const getVideoEmbedUrl = (videoUrl) => {
    const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null; 
  };

  if (!article) return <p>Loading...</p>;

  return (
    <>   
     <div className="article-detail padder">
      <h2>{article.title}</h2>
      {article.video_url ? (
        <iframe
          width="100%"
          height="315"
          src={getVideoEmbedUrl(article.video_url)} // Use the modified URL here
          title={article.title}
          frameBorder="0"
          allowFullScreen
          className='radius-1rem'
        />
      ) : (
        <img 
          src={article.image_url || 'default_image.jpg'} 
          alt={article.title} 
           className='radius-1rem'
        />
      )}
      <p>Duration: {article.duration} Minutes</p>
     
      <p>{article.description}</p>
      <p>Tags: {article.tags}</p>
      <p>Views: {article.viewcount}</p>
      <div className={`tag ${article.difficulty}`}>{article.difficulty}</div>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>


    

        

        <h3 className='padder'>Related Courses</h3>
        <div className="related-articles padder">
        {relatedArticles.map(articletag => (
            <RelatedArticleCard key={articletag.id} article={articletag} />
          ))}
          
        </div>

        <h3 className='padder'>You May Also Like</h3>
        <div className="card-container padder">
          {relatedtagArticles.map(relatedArticle => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
        </div>
    </>

  );
};

export default ArticleDetail;