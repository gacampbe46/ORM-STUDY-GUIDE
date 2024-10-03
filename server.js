const express = require('express');
const mysql = require('mysql2'); // or your preferred SQL package

const app = express();
app.use(express.json());  // Middleware to parse JSON request bodies

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'your_database'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// CRUD operations
app.get('/providers', (req, res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/providers', (req, res) => {
    const { name, service } = req.body;
    const query = 'INSERT INTO providers (name, service) VALUES (?, ?)';
    db.query(query, [name, service], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, name, service });
    });
});

app.put('/providers/:id', (req, res) => {
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
