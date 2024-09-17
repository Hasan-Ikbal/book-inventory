const { Pool } = require('pg');

// Create a pool instance with your PostgreSQL database configuration
const pool = new Pool({
    user: 'postgres',      // Replace with your PostgreSQL username
    host: 'localhost',             // Usually localhost for local setup
    database: 'book_inventory',    // Replace with your PostgreSQL database name
    password: 'Hasan.@123',  // Replace with your PostgreSQL password
    port: 5432                     // Default port for PostgreSQL
});

// Function to execute a query
const query = (text, params) => pool.query(text, params);

// Export the query function
module.exports = { query };

