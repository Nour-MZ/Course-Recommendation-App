const xlsx = require('xlsx');
const { Pool } = require('pg'); 
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require("puppeteer")

const pool = new Pool({
 
    user: "postgres",
    host: '127.0.0.1',
    database: 'articles_test',
    password: '123456',

});



  const workbook = xlsx.readFile('./edx_courses.csv');
  const sheetName = workbook.SheetNames[0]; 
  const sheet = workbook.Sheets[sheetName];


const data = xlsx.utils.sheet_to_json(sheet);
const urls = data.map(row => row.course_url).filter(url => url);



const scrapeContent = async () => {
    const workbook = xlsx.readFile('./edx_courses.csv');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    for (const course of data) {
        const { title, language } = course;

        // Select items with similar titles
        const querySelect = 'SELECT * FROM articles WHERE title ILIKE $1';
        const likeTitle = `%${title}%`; // Using ILIKE for case-insensitive matching

        try {
            const res = await pool.query(querySelect, [likeTitle]);
            if (res.rows.length > 0) {
                // If items exist, update their language
                const queryUpdate = 'UPDATE articles SET language = $1 WHERE title ILIKE $2';
                await pool.query(queryUpdate, [language, likeTitle]);
                console.log(`Updated language for titles similar to: ${title}`);
            } else {
                console.log(`No articles found for title: ${title}`);
            }
        } catch (err) {
            console.error('Error processing data:', err);
        }
    }

    await pool.end();
};
scrapeContent();

// const scrapeContent = async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     for (const url of urls) {
//         await page.goto(url);

//         // Get image from header-image class
//         const headerImageUrl = await page.evaluate(() => {
//             const headerImage = document.querySelector('img.CloudflareImage.header-image');
//             return headerImage ? headerImage.src : null;
//         });

//         if (headerImageUrl) {
//             console.log(`Header Image URL for ${url}: ${headerImageUrl}`);
//         } else {
//             // If header image doesn't exist, get image from video-thumb class
//             const videoThumbUrl = await page.evaluate(() => {
//                 const videoImage = document.querySelector('img.CloudflareImage.video-thumb');
//                 return videoImage ? videoImage.src : null;
//             });

//             console.log(`Video Thumb Image URL for ${url}: ${videoThumbUrl}`);

//             // Click on the video trigger and get the video source
//             try {
//                 await page.waitForSelector('.video-trigger-cta', { timeout: 5000 });
//                 await page.click('.video-trigger-cta'); // Click the video trigger

//                 // After clicking, get the video source from the iframe
//                 const videoSrc = await page.evaluate(() => {
//                     const iframe = document.querySelector('.video-iframe');
//                     return iframe ? iframe.src : null; // Get the src of the iframe
//                 });

//                 console.log(`Video URL for ${url}: ${videoSrc || 'No video found'}`);
//             } catch (error) {
//                 console.error(`Error clicking video trigger for ${url}: ${error.message}`);
//             }
//         }
//     }

//     await browser.close();
// };

// scrapeContent();




// const urls = [
//     'https://www.edx.org/learn/happiness/university-of-california-berkeley-the-foundations-of-happiness-at-work',
//     'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science'
// ];

// const imageClass = 'CloudflareImage.header-image';
// const videoClass = 'CloudflareImage.video-thumb';

// const findImageUrl = async (url) => {
//     try {
//         const response = await axios.get(url);
//         const $ = cheerio.load(response.data);

        
//         const image = $(`img.${imageClass}`).attr('src');
//         const video = $(`img.${videoClass}`).attr('src');
//         console.log(image ,video)
//         return video || image || null;
//     } catch (error) {
//         console.error(`Error fetching ${url}: ${error.message}`);
//         return null;
//     }
// };

// const scrapeImages = async () => {
//     for (const url of urls) {
//         const imageUrl = await findImageUrl(url);
//         if (imageUrl) {
//             console.log(`Image URL found for ${url}: ${imageUrl}`);
//         } else {
//             console.log(`No image found for ${url}`);
//         }
//     }
// };

// scrapeImages();




// const importData = async () => {
//   // Read the Excel file
//   const workbook = xlsx.readFile('./edx_courses.csv');
//   const sheetName = workbook.SheetNames[0]; // Assuming you'rne using the first sheet
//   const sheet = workbook.Sheets[sheetName];

//   // Convert sheet to JSON
//   const data = xlsx.utils.sheet_to_json(sheet);
  

//   // Insert data into the database
//   for (const course of data) {
    
    

   
//     const { title, summary, Level, subject, course_description} = course;

//     console.log({ title, summary, Level, subject, course_description})

//     const query = 'INSERT INTO articles (title, description, difficulty, tags, summary) VALUES ($1, $2, $3, $4, $5) RETURNING id';
//     const values = [title, course_description, Level, subject, summary];

//     try {
//       const res = await pool.query(query, values);
//       console.log(`Inserted course with ID: ${res.rows[0].id}`);
//     } catch (err) {
//       console.error('Error inserting data:', err);
//     }
//   }

//   // Close the database connection
//   await pool.end();
// };

// importData();