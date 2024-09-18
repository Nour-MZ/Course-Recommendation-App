const xlsx = require('xlsx');
const { Pool } = require('pg'); // Adjust according to your database

const pool = new Pool({
 
    user: "postgres",
    host: '127.0.0.1',
    database: 'articles_test',
    password: '123456',

});

const authors = [
    "Alice Smith",
    "Bob Johnson",
    "Carol Williams",
    "David Brown",
    "Eva Davis"
];

const assignRandomDurations = async () => {
    try {
        // Fetch all articles
        const articlesResult = await pool.query('SELECT id FROM articles');
        const articles = articlesResult.rows;

        // Update each article with a random duration
        for (const article of articles) {
            const randomDuration = Math.floor(Math.random() * 3) + 1; // Random duration between 1 and 100

            await pool.query(
                'UPDATE articles SET duration = $1 WHERE id = $2',
                [randomDuration, article.id]
            );
        }

        console.log('Durations assigned successfully!');
    } catch (error) {
        console.error('Error assigning durations:', error);
    } finally {
        await pool.end(); // Close the database connection
    }
};

// Execute the function
assignRandomDurations();