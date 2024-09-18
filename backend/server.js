const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());


class MyClassificationPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      let { pipeline, env } = await import('@xenova/transformers');
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}


const languageMap = {
  '1': 'English',
  '2': 'EspaÃ±ol'
};



const pool = new Pool({

  user: "postgres",
  host: '127.0.0.1',
  database: 'articles_test',
  password: '123456',
  // port: process.env.DB_PORT,

});


app.get('/', async (req, res) => {

  return res.json("test");

});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
  
    if (user.password == password) {
      
      return res.json({ message: 'Login successful', userId: email, name: user.name, job: user.job_description });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/articles/search', async (req, res) => {
  const { query } = req;
  const searchTerm = query.q;
  const language = query.language

  
  languageString = languageMap[language]

  try {
    const result = await pool.query(
      `SELECT * FROM articles 
      WHERE (title ILIKE $1 OR description ILIKE $1)
      AND language = $2`
      , [`%${searchTerm}%`, languageString]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/suggestions', async (req, res) => {
  const { q, language } = req.query;

  languageString = languageMap[language]
  
  if (!q || q.length === 0) {
    return res.status(400).json({ message: 'No query provided' });
  }

  try {
    const result = await pool.query(
      `SELECT title 
      FROM articles 
      WHERE title ILIKE $1 AND language = $2
      LIMIT 5`,
      [`%${q}%` , languageString]
    );

   
    const suggestions = result.rows.map(row => row.title);
    
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/save-query', async (req, res) => {
  const { userId, query } = req.body;

  try {

    const result = await pool.query(
      'UPDATE users SET search_history = array_append(search_history, $1) WHERE email = $2',
      [query, userId]
    );

    if (result.rowCount > 0) {
      res.json({ message: 'Query saved successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving query' });
  }
});

app.get('/api/articles/all', async (req, res) => {
  // console.log(req.query)
  const {language} = req.query
  console.log(language)
  languageString = languageMap[language]
  try {
    const result = await pool.query('SELECT * FROM articles WHERE language = $1', [languageString]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/articles', async (req, res) => {
  const { user, language } = req.body;

  const classifier = await MyClassificationPipeline.getInstance();

  const languageString = languageMap[language]

  if (!user) {
    res.json("nusls")
  }
  else {
    try {
      const userId = user.userId
      const result = await pool.query('SELECT search_history FROM users WHERE email = $1 LIMIT 5', [userId]);

      const searchhistory = result.rows[0].search_history
      if(searchhistory.length>3){
      
      const lastLimitedSearches = searchhistory.slice(-6);
      const resultString = lastLimitedSearches.join(' ');

      const vector = await classifier(resultString, {
        pooling: 'mean',
        normalize: true,
      });

      const vectorArray = Object.values(vector.data);
      const vectorString = `[${vectorArray.join(',')}]`;


      const test = await pool.query(
        `SELECT *
       FROM articles
       WHERE language = $1
       ORDER BY vector <-> $2::vector
       
       LIMIT 6`,
        [languageString, vectorString]
      );

      res.json(test.rows);
    }
    else{
      res.json("")
    }

    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

});

app.get('/api/tagarticles', async (req, res) => {
  const { articletag, language } = req.query;



  if (!articletag || articletag.length === 0) {
    return res.status(400).json({ message: 'No tags provided' });
  }


  const languageString = languageMap[language];
  try {
    // Prepare the SQL query
    const query = `
          SELECT *
          FROM articles
          WHERE tags ILIKE $1
          AND language ILIKE $2
          ORDER BY RANDOM()
          LIMIT 3;
      `;

    // Prepare parameters for query
    const params = [`${articletag}`, languageString];

    const { rows } = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching similar articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { user } = req.query



  try {
    const test = await pool.query('UPDATE articles SET viewcount = viewcount + 1 WHERE id = $1', [id]);

    const articleresult = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);

    if (articleresult.rows.length === 0) {
      return res.status(404).send('Article not found');
    }



    const article = articleresult.rows[0];


    res.json(article);

    if (user) {
      const userresult = await pool.query('SELECT id FROM users WHERE email = $1', [user.userId]);
      const userer = userresult.rows[0].id;


      await pool.query(
        'INSERT INTO view_history (user_id, article_id) VALUES ($1, $2)',
        [userer, id]
      );
    }





  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/job-articles', async (req, res) => {
  try {
    const classifier = await MyClassificationPipeline.getInstance();

    const { user, language } = req.body
    

    if (user && language) {
    

      languageString = languageMap[language]

      

      const vector = await classifier(user.job, {
        pooling: 'mean',
        normalize: true,
      });
      
      

      const vectorArray = Object.values(vector.data);
      const vectorString = `[${vectorArray.join(',')}]`;

      

      const job = await pool.query(
        `SELECT *
          FROM articles
          WHERE language = $1
          ORDER BY vector <+> $2::vector
          LIMIT 6;`,
        [languageString, vectorString]
      );
    
      res.json(job.rows)
    }
  
    // res.json(job)



  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/viewed-articles', async (req, res) => {

  const { userId } = req.body
  try {


    if (userId) {
      const userresult = await pool.query('SELECT id FROM users WHERE email = $1', [userId]);
      const userer = userresult.rows[0].id;

      const queryresult = await pool.query(
        `
        WITH UniqueArticles AS (
            SELECT article_id, viewed_at 
            FROM view_history 
            WHERE user_id = $1 
            ORDER BY viewed_at DESC 
            LIMIT 10
        )
        SELECT * 
        FROM articles 
        WHERE id IN (SELECT article_id FROM UniqueArticles);
    `, [userer]);


      res.json(queryresult.rows)
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/all-viewed-articles', async (req, res) => {

  const { userId } = req.body

  try {
    if (userId) {

      const userresult = await pool.query('SELECT id FROM users WHERE email = $1', [userId]);
      const userer = userresult.rows[0].id;

      const queryresult = await pool.query(
        `
        WITH UniqueArticles AS (
            SELECT article_id, viewed_at 
            FROM view_history 
            WHERE user_id = $1 
            ORDER BY viewed_at
        )
        SELECT * 
        FROM articles 
        WHERE id IN (SELECT article_id FROM UniqueArticles);
      
    `, [userer]);


      res.json(queryresult.rows)
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/articles/related/:id', async (req, res) => {
  const { id } = req.params;
  const { language } = req.query

  const languageString = languageMap[language]
  try {

    const result = await pool.query(`
      WITH target AS (
        SELECT vector FROM articles WHERE id = $1
      )
      SELECT *, vector <-> (SELECT vector FROM target) AS distance
      FROM articles
      WHERE id != $1 and language = $2
      ORDER BY distance
      LIMIT 3
    `, [id, languageString]);


    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});