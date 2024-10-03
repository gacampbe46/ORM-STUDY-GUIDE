const express = require('express');
const fs = require('fs');
const mysql = require('mysql2'); // or your preferred SQL package

const app = express();
app.use(express.json());  // Middleware to parse JSON request bodies

// Database connection setup without specifying a database initially
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL server');

    // Check if database exists, if not, create it
    db.query('CREATE DATABASE IF NOT EXISTS orm_study_guide', (err) => {
        if (err) throw err;
        console.log('Database created or already exists');

        // Now connect to the newly created or existing database
        db.changeUser({ database: 'orm_study_guide' }, (err) => {
            if (err) throw err;
            console.log('Connected to orm_study_guide database');

            // Read and execute the SQL file to create tables
            const sql = fs.readFileSync('database.sql').toString();
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log('Table created or already exists');
            });
        });
    });
});

// Validation Middleware
const validateProvider = (req, res, next) => {
    const { name, service } = req.body;

    // Validate name length
    if (typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
    }

    // Validate service (occupation) from a predefined list
    const validServices = ['Doctor', 'Nurse', 'Engineer', 'Teacher'];
    if (!validServices.includes(service)) {
        return res.status(400).json({ error: `Service must be one of: ${validServices.join(', ')}.` });
    }

    // Proceed to the next middleware/route handler
    next();
};

// CRUD operations
app.get('/providers', (req, res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/providers', validateProvider, (req, res) => {
    const { name, service } = req.body;
    const query = 'INSERT INTO providers (name, service) VALUES (?, ?)';
    db.query(query, [name, service], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, name, service });
    });
});

app.put('/providers/:id', validateProvider, (req, res) => {
    const { id } = req.params;
    const { name, service } = req.body;
    const query = 'UPDATE providers SET name = ?, service = ? WHERE id = ?';
    db.query(query, [name, service, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Provider updated' });
    });
});

app.delete('/providers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM providers WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Provider deleted' });
    });
});

// Port setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
