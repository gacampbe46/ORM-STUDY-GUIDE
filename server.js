// Import necessary packages
const express = require('express');
const fs = require('fs');  // File system module to read files
const mysql = require('mysql2');  // MySQL package to interact with the database

const app = express();
app.use(express.json());  // Middleware to parse incoming JSON request bodies

// Step 1: Initial Database Connection without specifying a database
const db = mysql.createConnection({
    host: 'localhost',    // The MySQL server is running on the local machine (localhost)
    user: 'root',         // Default MySQL administrative user
    password: ''          // No password for MySQL root user (can be modified as needed)
});

// Step 2: Connect to MySQL Server
db.connect(err => {
    if (err) throw err;  // If there's an error connecting, it stops execution
    console.log('Connected to MySQL server');

    // Step 3: Check if the 'orm_study_guide' database exists, if not, create it
    db.query('CREATE DATABASE IF NOT EXISTS orm_study_guide', (err) => {
        if (err) throw err;  // Throw an error if creating the database fails
        console.log('Database created or already exists');

        // Step 4: Now switch to the 'orm_study_guide' database
        db.changeUser({ database: 'orm_study_guide' }, (err) => {
            if (err) throw err;  // Throw an error if switching databases fails
            console.log('Connected to orm_study_guide database');

            // Step 5: Read the SQL file (database.sql) and execute its commands (e.g., table creation)
            const sql = fs.readFileSync('database.sql').toString();  // Read the SQL file as a string
            db.query(sql, (err, result) => {
                if (err) throw err;  // Throw an error if the SQL execution fails
                console.log('Table created or already exists');
            });
        });
    });
});

// Middleware function to validate incoming provider data
const validateProvider = (req, res, next) => {
    const { name, service } = req.body;  // Destructure name and service from the request body

    // Step 1: Validate that the name has at least 3 characters
    if (typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
    }

    // Step 2: Validate that the service (occupation) is one of the allowed values
    const validServices = ['Doctor', 'Nurse', 'Engineer', 'Teacher'];  // Predefined list of allowed services
    if (!validServices.includes(service)) {
        return res.status(400).json({ error: `Service must be one of: ${validServices.join(', ')}.` });
    }

    // If validation passes, move on to the next middleware or route handler
    next();
};

// CRUD Operations

// GET: Fetch all providers from the database
app.get('/providers', (req, res) => {
    // Run a query to select all rows from the providers table
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) throw err;  // Throw an error if the query fails
        res.json(results);  // Respond with the results in JSON format
    });
});

// POST: Add a new provider to the database
app.post('/providers', validateProvider, (req, res) => {
    const { name, service } = req.body;  // Extract the name and service from the request body
    const query = 'INSERT INTO providers (name, service) VALUES (?, ?)';  // SQL query with placeholders

    // Execute the query with the provided name and service
    db.query(query, [name, service], (err, result) => {
        if (err) throw err;  // Throw an error if the insertion fails
        // Respond with the newly created provider's ID and the original name and service
        res.status(201).json({ id: result.insertId, name, service });
    });
});

// PUT: Update an existing provider's information
app.put('/providers/:id', validateProvider, (req, res) => {
    const { id } = req.params;  // Extract the provider's ID from the request URL
    const { name, service } = req.body;  // Extract the updated name and service from the request body
    const query = 'UPDATE providers SET name = ?, service = ? WHERE id = ?';  // SQL query to update

    // Execute the update query with the provided name, service, and ID
    db.query(query, [name, service, id], (err) => {
        if (err) throw err;  // Throw an error if the update fails
        res.json({ message: 'Provider updated' });  // Respond with a success message
    });
});

// DELETE: Remove a provider from the database
app.delete('/providers/:id', (req, res) => {
    const { id } = req.params;  // Extract the provider's ID from the request URL
    const query = 'DELETE FROM providers WHERE id = ?';  // SQL query to delete the provider by ID

    // Execute the delete query with the provided ID
    db.query(query, [id], (err) => {
        if (err) throw err;  // Throw an error if the deletion fails
        res.json({ message: 'Provider deleted' });  // Respond with a success message
    });
});

// Port setup for the Express server
const port = process.env.PORT || 3000;  // Use the environment variable PORT or default to 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);  // Log the server's running port
});
