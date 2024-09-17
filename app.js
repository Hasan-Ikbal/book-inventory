// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Import the database module

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to add a new book
app.post('/add-book', async (req, res) => {
    const { title, author, genre, publication_date, isbn } = req.body;

    console.log('Received data:', req.body);

    if (!title || !author || !publication_date || !isbn) {
        return res.status(400).send('Missing required fields');
    }

    try {
        await db.query(
            `INSERT INTO inventory (title, author, genre, publication_date, isbn)
            VALUES ($1, $2, $3, $4, $5)`,
            [title, author, genre, publication_date, isbn]
        );
        res.send('Book added successfully');
    } catch (err) {
        console.error('Error inserting book:', err);
        res.status(500).send('Error adding book');
    }
});

// Endpoint to filter books
app.post('/filter-books', async (req, res) => {
    const { title, author, genre, publication_date } = req.body;

    try {
        const query = `
            SELECT * FROM inventory
            WHERE ($1::text IS NULL OR title ILIKE $1)
            AND ($2::text IS NULL OR author ILIKE $2)
            AND ($3::text IS NULL OR genre ILIKE $3)
            AND ($4::date IS NULL OR publication_date = $4)
        `;
        const values = [
            title ? `%${title}%` : null,
            author ? `%${author}%` : null,
            genre ? `%${genre}%` : null,
            publication_date || null
        ];

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error filtering books:', err);
        res.status(500).send('Error filtering books');
    }
});

// Endpoint to get all books
app.get('/get-books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).send('Error fetching books');
    }
});

// Endpoint to export books to CSV
app.get('/export-books/csv', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory');
        const csv = new Parser().parse(result.rows);
        res.header('Content-Type', 'text/csv');
        res.attachment('books.csv');
        res.send(csv);
    } catch (err) {
        console.error('Error exporting CSV:', err);
        res.status(500).send('Error exporting CSV');
    }
});

// Endpoint to export books to JSON
app.get('/export-books/json', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory');
        res.header('Content-Type', 'application/json');
        res.attachment('books.json');
        res.send(JSON.stringify(result.rows, null, 2));
    } catch (err) {
        console.error('Error exporting JSON:', err);
        res.status(500).send('Error exporting JSON');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





  