const xlsx = require('xlsx');
const { Pool } = require('pg'); // Adjust according to your database

const { response } = require('express');

const pool = new Pool({
 
    user: "postgres",
    host: '127.0.0.1',
    database: 'articles_test',
    password: '123456',

});

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



async function updateArticleVector(articleId, vector) {

  const vectorString = `[${vector.join(',')}]`;

  const query = `
    UPDATE articles
    SET vector = $1
    WHERE id = $2
  `;
  await pool.query(query, [vectorString, articleId]);
}


const importData = async () => {
  // Read the Excel file
  const workbook = xlsx.readFile('./edx_courses.csv');
  const sheetName = workbook.SheetNames[0]; 
  const sheet = workbook.Sheets[sheetName];

  const classifier = await MyClassificationPipeline.getInstance();
   

    let i = 0;
    try {
      const res = await pool.query('SELECT id, description, title FROM articles');
      const articles = res.rows;
     
        
      for (const article of articles) {
       
        articledata = article.title  + article.description
        // console.log(articledata)

        const vector = await classifier(articledata,{
          pooling: 'mean',
          normalize:true,
        });
        let newvector = Array.from(vector.data)
        console.log(newvector)

        await updateArticleVector(article.id, newvector);
        
        console.log(`Updated article ${article.id} with vector.`);
      }
    } catch (error) {
      console.error('Error processing articles:', error);
    } finally {
      await pool.end();
    }
  }

importData();