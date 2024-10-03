# **Express SQL Providers API**

## **Project Overview**

The purpose of this project is to **refresh and solidify my understanding of SQL best practices** using JavaScript, particularly in a full-stack environment utilizing **Express.js** and **MySQL**. This project demonstrates fundamental concepts necessary for database management and API development, which I aim to leverage as a **Technical Solutions Manager (TSM)**.

Through this project, I focused on:
- Setting up a secure and scalable **Express.js** server.
- Safely interacting with a **MySQL database** to execute CRUD operations.
- Applying **SQL best practices**, such as parameterized queries, to prevent SQL injection attacks and ensure data integrity.

The foundation provided by this project serves as a starting point for building more advanced systems, ensuring a scalable and secure backend that aligns with the TSM role's responsibilities.

## **API Functionality**

This API provides the ability to manage providers by enabling **Create**, **Read**, **Update**, and **Delete** (CRUD) operations. It interfaces with a MySQL database to handle provider information securely and efficiently.

### SQL Cheatsheet

| Command            | SQL Query / Example                                                                                                           | Purpose                                                                                                                                 |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `CREATE DATABASE`  | `CREATE DATABASE IF NOT EXISTS orm_study_guide;`                                                                               | Creates a new database.                                                                                                                 |
| `USE`              | `USE orm_study_guide;`                                                                                                        | Selects the database for subsequent queries.                                                                                            |
| `CREATE TABLE`     | `CREATE TABLE IF NOT EXISTS providers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), service VARCHAR(100));`           | Creates a new table to store data, if it doesn't exist.                                                                                 |
| `INSERT INTO`      | `INSERT INTO providers (name, service) VALUES (?, ?);`                                                                        | Inserts a new row into the table.                                                                                                       |
| `SELECT`           | `SELECT * FROM providers;`                                                                                                    | Retrieves all rows from the table.                                                                                                      |
| `UPDATE`           | `UPDATE providers SET name = ?, service = ? WHERE id = ?;`                                                                    | Updates specific rows in the table based on the `id`.                                                                                   |
| `DELETE`           | `DELETE FROM providers WHERE id = ?;`                                                                                         | Deletes specific rows in the table based on the `id`.                                                                                   |
